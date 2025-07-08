const { default: mongoose } = require("mongoose")
const Characterwallet = require("../models/Characterwallet")
const { Market, CharacterInventory, Item } = require("../models/Market")
const Characterdata = require("../models/Characterdata")
const { Skill, CharacterSkillTree } = require("../models/Skills");
const { checkmaintenance } = require("../utils/maintenance");



exports.getMarketItems = async (req, res) => {
    const { page, limit, type, rarity, search, markettype } = req.query

    const pageOptions = {
        page: parseInt(page, 10) || 0,
        limit: parseInt(limit, 10) || 10
    }

    const maintenance = await checkmaintenance(markettype || "market")

    if (maintenance === "failed") {
        return res.status(400).json({
            message: "failed",
            data: "The market is currently under maintenance. Please try again later."
        });
    }

    const query = {

    }

    if (markettype) {
        query.marketType = markettype;
    } 


    try {
        // Build pipeline stages
        const pipeline = [
            {
                $match: {
                    ...query
                }
            },
            { $unwind: '$items' },
            { $match: { "items.inventorytype": { $nin: ["hair", "weapon"] } } },
            {
                $lookup: {
                    from: 'skills',
                    localField: 'items.skill',
                    foreignField: '_id',
                    as: 'skill'
                }
            },
            { $unwind: { path: '$skill', preserveNullAndEmptyArrays: true } }
        ];

        // Initialize match conditions
        const matchConditions = [];

        // Add search conditions if search parameter exists
        if (search) {
            matchConditions.push({
                $or: [
                    { 'items.type': { $regex: new RegExp(search, "i") } },
                    { 'items.rarity': { $regex: new RegExp(search, "i") } },
                    { 'items.name': { $regex: new RegExp(search, "i") } }
                ]
            });
        }

        // Add type filter if specified
        if (type) {
            matchConditions.push({ 'items.type': type });
        }

        // Add rarity filter if specified
        if (rarity) {
            matchConditions.push({ 'items.rarity': rarity });
        }

        // Add match stage only if there are conditions
        if (matchConditions.length > 0) {
            pipeline.push({
                $match: {
                    $and: matchConditions
                }
            });
        }

        // Add pagination
        pipeline.push(
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
            {
            $project: {
                _id: 0,
                itemId: '$items._id',
                name: '$items.name',
                type: '$items.type',
                rarity: '$items.rarity',
                price: '$items.price',
                currency: '$items.currency',
                description: '$items.description',
                stats: '$items.stats',
                imageUrl: '$items.imageUrl',
                gender: '$items.gender',
                isOpenable: '$items.isOpenable',
                exp: {
                $cond: {
                    if: { $ne: ['$items.exp', null] },
                    then: '$items.exp',
                    else: '$$REMOVE'
                }
                },
                crystals: {
                $cond: {
                    if: { $ne: ['$items.crystals', null] },
                    then: '$items.crystals',
                    else: '$$REMOVE'
                }
                },
                coins: {
                $cond: {
                    if: { $ne: ['$items.coins', null] },
                    then: '$items.coins',
                    else: '$$REMOVE'
                }
                },
                skill: {
                $cond: {
                    if: { $ne: ['$skill', null] },
                    then: '$skill',
                    else: '$$REMOVE'
                }
                }
            }
            }
        );

        // Execute aggregation
        const items = await Market.aggregate(pipeline);

        // Get total count for pagination
        const countPipeline = [...pipeline];
        countPipeline.splice(-3, 3); // Remove skip, limit, and project stages
        countPipeline.push({ $count: 'total' });
        const totalItems = await Market.aggregate(countPipeline);

        // Format response
        const formattedResponse = {
            data: items.reduce((acc, item, index) => {
                acc[index + 1] = item;
                return acc;
            }, {}),
            pagination: {
                total: totalItems[0]?.total || 0,
                page: pageOptions.page,
                limit: pageOptions.limit,
                pages: Math.ceil((totalItems[0]?.total || 0) / pageOptions.limit)
            }
        };

        return res.status(200).json({
            message: "success",
            data: formattedResponse.data,
            pagination: formattedResponse.pagination
        });

    } catch (err) {
        console.log(`Error in market items aggregation: ${err}`);
        return res.status(500).json({
            message: "failed",
            data: "There's a problem with the server! Please try again later."
        });
    }
}

exports.buyitem = async (req, res) => {
    const { itemid, characterid } = req.body

    try {
        // Start transaction
        const session = await mongoose.startSession();
        await session.startTransaction();

        try {
            // Find item in market
            const item = await Market.findOne(
                { 'items._id': itemid },
                { 'items.$': 1 }
            ).session(session);

            if (!item?.items[0]) {
                await session.abortTransaction();
                return res.status(404).json({ message: "failed", data: "Item not found" });
            }

            const itemData = item.items[0];
            // Check if item already exists in inventory
            const inventory = await CharacterInventory.findOne(
                { owner: characterid, 'items.item': itemid },
                { 'items.$': 1 }
            ).session(session);

            if (inventory?.items[0]) {
                return res.status(400).json({ message: "failed", data: "Item already exists in inventory" });
            } 
            
            // Check wallet balance
            const wallet = await Characterwallet.findOne({ 
                owner: new mongoose.Types.ObjectId(characterid), 
                type: itemData.currency 
            }).session(session);

            if (!wallet) {
                await session.abortTransaction();
                return res.status(404).json({ message: "failed", data: "Wallet not found" });
            }
            
            if (wallet.amount < itemData.price) {
                await session.abortTransaction();
                return res.status(400).json({ message: "failed", data: "Insufficient balance" });
            }

            // Update wallet
            await Characterwallet.findOneAndUpdate(
                { owner: characterid, type: itemData.currency },
                { $inc: { amount: -itemData.price } },
                { new: true, session }
            );


            // if item type is skill then store it in Characterskills

            if (itemData.type === "skills") {

                const skill = await Skill.findById(itemData.skill).session(session);
                if (!skill) {
                    return res.status(404).json({
                            message: "failed",
                            data: "Skill not found"
                    });
                }
                // Get character's skill tree
                  let skillTree = await CharacterSkillTree.findOne({ owner: characterid }).session(session)
                  .populate('skills.skill');

              if (!skillTree) {
                  skillTree = await CharacterSkillTree.create({
                      owner: characterid,  // Fixed: changed characterid to owner
                      skills: []
                  });
              }

              // Check prerequisites are maxed
              if (skill.prerequisites && skill.prerequisites.length > 0) {
                  const hasMaxedPrerequisites = skill.prerequisites.every(prereqId => {
                      const prereqSkill = skillTree.skills.find(s => 
                          s.skill._id.toString() === prereqId.toString()
                      );
                      return prereqSkill && prereqSkill.level >= prereqSkill.skill.maxLevel;
                  });

                  if (!hasMaxedPrerequisites) {
                      return res.status(400).json({
                          message: "failed",
                          data: "Prerequisites must be at maximum level"
                      });
                  }
              }

              // Check if character already has this skill
              const existingSkill = skillTree.skills.find(s => 
                  s.skill._id.toString() === itemData.skill.toString()
              );

              if (existingSkill && existingSkill.level >= skill.maxLevel) {
                  return res.status(400).json({
                      message: "failed",
                      data: "Skill already at maximum level"
                  });
              }

                if (existingSkill) {
                    existingSkill.level += 1;
                } else {
                    skillTree.skills.push({
                        skill: itemData.skill,
                        level: 1,
                    });
                    if (!skillTree.unlockedSkills.includes(itemData.skill)) {
                        skillTree.unlockedSkills.push(itemData.skill);
                    }
                }

                await skillTree.save({ session });

            } else if (itemData.type === "crystalpacks") {
                await Characterwallet.findOneAndUpdate(
                    { owner: characterid, type: 'crystal' },
                    { $inc: { amount: itemData.crystals } },
                    { new: true, session }
                );

            } else if (itemData.type === "goldpacks") {
                await Characterwallet.findOneAndUpdate(
                    { owner: characterid, type: 'coins' },
                    { $inc: { amount: itemData.coins } },
                    { new: true, session }
                );
            } else {
                await CharacterInventory.findOneAndUpdate(
                    { owner: characterid, type: itemData.inventorytype },
                    { $push: { items: { item: itemData._id } } },
                { upsert: true, new: true, session }
            );
            }
            
            // Commit transaction
            await session.commitTransaction();
            return res.status(200).json({ 
                message: "success",
                data: {
                    item: itemData.name,
                    price: itemData.price,
                    type: itemData.type
                }
            });

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch (err) {
        console.log(`Error in buy item transaction: ${err}`);
        return res.status(500).json({ 
            message: "failed", 
            data: "Failed to complete purchase" 
        });
    }
}


exports.sellitem = async (req, res) => {

    const { itemid, characterid, quantity } = req.body

    try {
        // Start transaction
        const session = await mongoose.startSession();
        await session.startTransaction();

        // Find item in inventory
            const item = await CharacterInventory.findOne(
                { 'items.item': itemid },
                { 'items.$': 1 }
            ).session(session);

            if (!item?.items[0]) {
                await session.abortTransaction();
                return res.status(404).json({ message: "failed", data: "Item not found" });
            }

            const itemData = item.items[0];

            let coinsamount



            if (itemData.item.currency === "coins") {
                coinsamount = itemData.item.price * 0.5
            } else if(itemData.item.currency === "crystal") {
                coinsamount = (itemData.item.price * 0.5) * 100
            } else {
                return res.status(400).json({ message: "failed", data: "Invalid currency" });
            }

            // Update wallet

            await Characterwallet.findOneAndUpdate(
                { owner: characterid, type: 'coins' },
                { $inc: { amount: coinsamount } },
                { new: true, session }
            );

            // Update inventory

            if (itemData.quantity > 1 && quantity < itemData.quantity) {
                await CharacterInventory.findOneAndUpdate(
                    { owner: characterid, type: itemData.item.type },
                    { $inc: { 'items.$[elem].quantity': -quantity } },
                    { arrayFilters: [{ 'elem.item': itemid }], session }
                );
            } else {
            await CharacterInventory.findOneAndUpdate(
                { owner: characterid, type: itemData.item.type },
                { $pull: { items: { item: itemid } } },
                { session }
            );
            }
            // Commit transaction
            await session.commitTransaction();
            return res.status(200).json({ 
                message: "success",
                data: {
                    item: itemData.item.name,
                    price: coinsamount,
                    type: itemData.item.type
                }
            });


        } catch (err) {
        await session.abortTransaction();
        console.log(`Error in sell item transaction: ${err}`);
    
        return res.status(500).json({ 
            message: "failed", 
            data: "Failed to complete sale" 
        });

    } finally {
        session.endSession();
    }
}


exports.equipitem = async (req, res) => {


    const { itemid, characterid } = req.body

    const session = await mongoose.startSession();
    try {
        // Start transaction
        await session.startTransaction();

        // Find item in inventory
        const item = await CharacterInventory.findOne(
            { 'items.item': itemid },
            { 'items.$': 1 }
        ).session(session);

        if (!item?.items[0]) {
            await session.abortTransaction();
            return res.status(404).json({ message: "failed", data: "Item not found" });
        }

        // check player level if he can equip the item
        const player = await Characterdata.findOne({ _id: characterid }).session(session);

        if (player.level < item.items[0].item.level) {
            await session.abortTransaction();
            return res.status(400).json({ message: "failed", data: "You need to be at least level " + item.items[0].item.level + " to equip this item" });
        }

        // check if item is already equipped

        const hasEquipped = await CharacterInventory.findOne(
            { owner: characterid, 'items.isEquipped': true, 'items.item': { $ne: itemid }, 'items.type': item.items[0].item.type },
            { 'items.$': 1 }
        ).session(session);

        if (hasEquipped?.items[0]) {
            await CharacterInventory.findOneAndUpdate(
                { owner: characterid, type: hasEquipped.items[0].item.type },
                { $set: { 'items.$[elem].isEquipped': false } },
                { arrayFilters: [{ 'elem.item': hasEquipped.items[0].item._id }], session }
            );
        }


        // Update inventory
        await CharacterInventory.findOneAndUpdate(
            { 'items.item': itemid, owner: characterid },
            { $set: { 'items.$[elem].isEquipped': true } },
            { arrayFilters: [{ 'elem.item': itemid }], session }
        );

        // Commit transaction
        await session.commitTransaction();
        return res.status(200).json({ 
            message: "success",
        });

    } catch (err) {
        await session.abortTransaction();
        console.log(`Error in equip item transaction: ${err}`);
    
        return res.status(500).json({ 
            message: "failed", 
            data: "Failed to equip item" 
        });

    } finally {
        session.endSession();
    }

}

exports.unequipitem = async (req, res) => {

    const { itemid, characterid } = req.body

    const session = await mongoose.startSession();
    try {

        // Start transaction


        await session.startTransaction();

        // Find item in inventory

        const item = await CharacterInventory.findOne(
            { 'items.item': itemid },
            { 'items.$': 1 }
        ).session(session);

        if (!item?.items[0]) {
            await session.abortTransaction();
            return res.status(404).json({ message: "failed", data: "Item not found" });
        }

        const itemData = item.items[0];

        // Update inventory

        await CharacterInventory.findOneAndUpdate(
            { 'items.item': itemid, owner: characterid },
            { $set: { 'items.$[elem].isEquipped': false } },
            { arrayFilters: [{ 'elem.item': itemid }], session }
        );

        // Commit transaction

        await session.commitTransaction();

        return res.status(200).json({
            message: "success",
            data: {
                item: itemData.item.name,
                type: itemData.item.type
            }
        });

    } catch (err) {
        await session.abortTransaction();
        console.log(`Error in unequip item transaction: ${err}`);
    
        return res.status(500).json({ 
            message: "failed", 
            data: "Failed to unequip item" 
        });

    } finally {
        session.endSession();
    }
}

exports.listequippeditems = async (req, res) => {
    const { characterid } = req.query

    try {
        const items = await CharacterInventory.aggregate([
            { $match: { owner: new mongoose.Types.ObjectId(characterid) } },
            { $unwind: '$items' },
            { $match: { 'items.isEquipped': true } },
            {
                $lookup: {
                    from: 'items',
                    localField: 'items.item',
                    foreignField: '_id',
                    as: 'item'
                }
            },
            { $unwind: '$item' },
            {
                $project: {
                    _id: 0,
                    itemId: '$item._id',
                    name: '$item.name',
                    type: '$item.type',
                    rarity: '$item.rarity',
                    price: '$item.price',
                    description: '$item.description',
                    stats: '$item.stats',
                    imageUrl: '$item.imageUrl'
                }
            }
        ]);

        console.log(items)
        // Format response by item type
        const formattedResponse = items.reduce((acc, item) => {
            // Initialize category if it doesn't exist
            if (!acc[item.type]) {
                acc[item.type] = {}
            }
            
            // Add item to its category
            acc[item.type] = {
                itemId: item.itemId,
                name: item.name,
                rarity: item.rarity,
                price: item.price,
                description: item.description,
                stats: item.stats,
                imageUrl: item.imageUrl
            }
            
            return acc
        }, {});

        return res.status(200).json({ 
            message: "success", 
            data: formattedResponse 
        });

    } catch (err) {
        console.log(`Error finding equipped items: ${err}`);
        return res.status(400).json({ 
            message: "failed", 
            data: "There's a problem with the server! Please try again later." 
        });
    }
}


exports.grantplayeritemsuperadmin = async (req, res) => {
    const { username, items } = req.body;

    if (!username || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ 
            message: "failed", 
            data: "Please provide username and items array" 
        });
    }

    const session = await mongoose.startSession();

    try {
        await session.startTransaction();

        // Find character by username
        const character = await Characterdata.findOne({ username }).session(session);
        if (!character) {
            return res.status(404).json({
                message: "failed",
                data: "Character not found"
            });
        }


        // Process each item
        const results = [];
        for (const itemid of items) {
            // Find item in market
            const marketItem = await Market.findOne(
                { 'items._id': itemid },
                { 'items.$': 1 }
            ).session(session);

            if (!marketItem?.items[0]) {
                results.push({
                    itemid,
                    status: 'failed',
                    message: 'Item not found'
                });
                continue;
            }

            const itemData = marketItem.items[0];

            try {
                // Check if item exists in inventory
                const inventory = await CharacterInventory.findOne(
                    { 
                        owner: character._id, 
                        'items.item': itemid 
                    },
                    { 'items.$': 1 }
                ).session(session);

                if (inventory?.items[0]) {
                    return res.status(400).json({
                        message: "failed",
                        data: "Item already exists in inventory"
                    });
                } else {
                    // Add new item to inventory
                    await CharacterInventory.findOneAndUpdate(
                        { 
                            owner: character._id, 
                            type: itemData.inventorytype 
                        },
                        { 
                            $push: { 
                                items: { 
                                    item: itemData._id,
                                    quantity: 1
                                } 
                            } 
                        },
                        { 
                            upsert: true, 
                            new: true, 
                            session 
                        }
                    );
                }

                results.push({
                    itemid,
                    status: 'success',
                    name: itemData.name
                });

            } catch (err) {
                results.push({
                    itemid,
                    status: 'failed',
                    message: 'Error processing item'
                });
            }
        }

        await session.commitTransaction();

        console.log(results)
        return res.status(200).json({ 
            message: "success",

        });

    } catch (err) {
        await session.abortTransaction();
        console.error(`Error in grantplayeritemsuperadmin: ${err}`);
        return res.status(500).json({ 
            message: "failed", 
            data: "Failed to grant items" 
        });
    } finally {
        session.endSession();
    }
};

//superadmin
exports.createItem = async (req, res) => {
    // Start session for transaction
    const session = await mongoose.startSession();
    
    try {
        await session.startTransaction();

        const {name, price, currency, type, inventorytype, gender, description, rarity, stats, skill } = req.body;

        if (
            type === 'skins' &&
            (!name || !price || !currency || !description || !rarity)
          ) {
            return res.status(400).json({
              message: "failed",
              data: "Missing required fields for skin item."
            });
        } else if (
            type === 'skills' &&
            (!name || !price || !currency || !description || !skill || !rarity)
          ) {
            return res.status(400).json({
              message: "failed",
              data: "Missing required fields for skill item."
            });
          } else if (
            type === 'chests' &&
            (!name || !price || !currency || !description || !rarity)
          ) {
            return res.status(400).json({
              message: "failed",
              data: "Missing required fields for chests item."
            });
          }  else if (
            type === 'crystalpacks' &&
            (!name || !price || !currency || !description)
          ) {
            return res.status(400).json({
              message: "failed",
              data: "Missing required fields for crystal pack item."
            });
          }  else if (
            type === 'goldpacks' &&
            (!name || !price || !currency || !description)
          ) {
            return res.status(400).json({
              message: "failed",
              data: "Missing required fields for gold pack item."
            });
          }
          
          
          

        // Handle image upload
        let imageUrl = "";
        if (req.file) {
            imageUrl = req.file.path;
        } else {
            return res.status(400).json({ message: "failed", data: "Please select an image first!" });
        }

        // Validate enums
        const validCurrencies = ["coins", "crystal", "topupcredit"];
        const validRarities = ["basic", "common", "epic", "rare", "legendary", ""];

        if (!validCurrencies.includes(currency)) {
            return res.status(400).json({ message: "failed", data: "Invalid currency type." });
        }
        if (!validRarities.includes(rarity)) {
            return res.status(400).json({ message: "failed", data: "Invalid rarity type." });
        }

        let skillId = null;
        if (type === "skills") {
            const skillDoc = await Skill.findOne({ category: "Deals" });
            if (!skillDoc) {
                await session.abortTransaction();
                return res.status(404).json({ message: "failed", data: "Skill with category 'Deals' not found." });
            }
            skillId = skillDoc._id;
        }
     

        // Prepare stats
        const defaultStats = {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0,
        };
        const itemStats = { ...defaultStats, ...stats };

        // Create new item in Items collection
        const itemData = {
            name,
            price,
            currency,
            type,
            inventorytype,
            gender,
            description: description || "N/A",
            rarity,
            imageUrl,
            stats: itemStats,
            skill: skillId
        };

        // Create in Items collection
        const newItem = await Item.create([itemData], { session });
        const createdItem = newItem[0];

        // Find and update Market
        const market = await Market.findOne({ marketType: "market" }).session(session);
        if (!market) {
            await session.abortTransaction();
            return res.status(404).json({ message: "failed", data: "Market not found." });
        }

        // Add to market items array
        market.items.push({
            _id: createdItem._id,
            ...itemData
        });

        await market.save({ session });
        await session.commitTransaction();

        return res.status(201).json({ 
            message: "success", 
            data: {
                itemId: createdItem._id,
                ...itemData
            }
        });

    } catch (err) {
        await session.abortTransaction();
        console.error(`Error creating item: ${err}`);
        return res.status(500).json({ 
            message: "server-error", 
            data: "There's a problem with the server." 
        });
    } finally {
        session.endSession();
    }
};


exports.deleteItem = async (req, res) => {
    try {
        const { itemId } = req.body;

        if (!itemId) {
            return res.status(400).json({ message: "failed", data: "Item ID is required." });
        }

        let market = await Market.findOne({ marketType: "store" });
        if (!market) {
            return res.status(404).json({ message: "failed", data: "Store not found." });
        }

        const itemIndex = market.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "failed", data: "Item not found in Store." });
        }

        market.items.splice(itemIndex, 1);
        await market.save();

        return res.status(200).json({ message: "success", data: "Item deleted successfully." });

    } catch (err) {
        console.error(`Error deleting item: ${err}`);
        return res.status(500).json({ message: "server-error", data: "There's a problem with the server." });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const { itemId,name, price, currency, type, inventorytype, gender, description, rarity, stats } = req.body;

        if (!itemId) {
            return res.status(400).json({ message: "failed", data: "Item ID is required." });
        }

        let market = await Market.findOne({ marketType: "market" });
        if (!market) {
            return res.status(404).json({ message: "failed", data: "Market not found." });
        }

        const itemIndex = market.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "failed", data: "Item not found in Market." });
        }

        let prevImageUrl = market.items[itemIndex].imageUrl;

        let imageUrl = req.file ? req.file.path : prevImageUrl;

        if (name) market.items[itemIndex].name = name;
        if (price) market.items[itemIndex].price = price;
        if (currency) market.items[itemIndex].currency = currency;
        if (type) market.items[itemIndex].type = type;
        if (gender) market.items[itemIndex].gender = gender;
        if (description) market.items[itemIndex].description = description;
        if (rarity) market.items[itemIndex].rarity = rarity;
        if (inventorytype) market.items[itemIndex].inventorytype = inventorytype;
        market.items[itemIndex].imageUrl = imageUrl;

        if (stats) {
            market.items[itemIndex].stats = { ...market.items[itemIndex].stats, ...stats };
        }

        await market.save();

        return res.status(200).json({ message: "success", data: market.items[itemIndex] });

    } catch (err) {
        console.error(`Error updating item: ${err}`);
        return res.status(500).json({ message: "server-error", data: "There's a problem with the server." });
    }
};


exports.getstoreitemlist = async (req, res) => {

    // get market items and items first then filter out the items that are in the market and also check the currency it should be not equal to coins
    const marketitems = await Market.findOne({ marketType: "store" })
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while fetching store items. Error: ${err}`);
            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details." });
        });


    const items = await Item.find({ currency: { $ne: "coins" } })
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while fetching items. Error: ${err}`);
            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details." });
        });


    // Filter out items that are already in the market
    const filteredItems = items.filter(item => {
        return !marketitems.items.some(marketItem => marketItem._id.toString() === item._id.toString()) 
            && item.inventorytype !== 'hair' && item.inventorytype !== 'weapon';
    });

    if(!filteredItems || filteredItems.length === 0) {
        return res.status(404).json({ message: "failed", data: "All available items are in the store." });
    }
    const finalData = []

    filteredItems.forEach(item => {
        finalData.push({
            itemid: item._id,
            name: item.name,
        })
    })

    return res.status(200).json({
        message: "success",
        data: finalData
    })
}

exports.addstoreitems = async (req, res) => {

    const { itemid, price } = req.body;

    if (!itemid || !price) {
        return res.status(400).json({ message: "failed", data: "Please provide item ID and price." });
    }

    // Start session for transaction
    const session = await mongoose.startSession();
    try {
        await session.startTransaction();

        // Find item in Items collection
        const item = await Item.findById(itemid).session(session);
        if (!item) {
            await session.abortTransaction();
            return res.status(404).json({ message: "failed", data: "Item not found." });
        }

        // Check if item already exists in Market
        const market = await Market.findOne({ marketType: "store" }).session(session);
        if (!market) {
            await session.abortTransaction();
            return res.status(404).json({ message: "failed", data: "Store not found." });
        }

        const existingItemIndex = market.items.findIndex(marketItem => marketItem._id.toString() === itemid);
        if (existingItemIndex !== -1) {
            await session.abortTransaction();
            return res.status(400).json({ message: "failed", data: "Item already exists in the store." });
        }

        // check currency if its equal to coins
        if (item.currency === "coins") {
            await session.abortTransaction();
            return res.status(400).json({ message: "failed", data: "Item currency must be coins." });
        }

        item.price = price; // Update price if provided
        // Add item to Market

        market.items.push(item.toObject());

        await market.save({ session });
        await item.save({ session });
        await session.commitTransaction();
        return res.status(200).json({ 
            message: "success"
        });

    } catch (err) {
        await session.abortTransaction();
        console.error(`Error adding item to store: ${err}`);
        return res.status(500).json({ message: "server-error", data: "There's a problem with the server." });
    }
    finally {
        session.endSession();
    }
}

// exports.getallitems = async (req, res) => {
//     const { page = 1, limit = 10 } = req.query;
//     const pageOptions = {
//         page: parseInt(page, 10),
//         limit: parseInt(limit, 10)
//     };

//     const data = await Item.find({})
//         .skip((pageOptions.page - 1) * pageOptions.limit)
//         .limit(pageOptions.limit)
//         .sort({ createdAt: -1 })
//         .then(data => data)
//         .catch(err => {
//             console.log(`There's a problem encountered while fetching items. Error: ${err}`);
//             return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details." });
//         });

//     if (!data || data.length === 0) {
//         return res.status(404).json({ message: "failed", data: "No items found." });
//     }

//     const totalItems = await Item.countDocuments({});

//     const totalPages = Math.ceil(totalItems / pageOptions.limit);

//     const response = {
//         items: data.map(item => ({
//             itemid: item._id,
//             name: item.name,
//             price: item.price,
//             currency: item.currency,
//             type: item.type,
//             inventorytype: item.inventorytype,
//         })),
//         pagination: {
//             totalItems,
//             totalPages,
//             currentPage: pageOptions.page,
//             itemsPerPage: pageOptions.limit
//         }
//     };
//     return res.status(200).json({
//         message: "success",
//         data: response
//     });
// }



exports.getskinitems = async (req, res) => {
  try {
    const data = await Item.find({ type: "skins" })
      .sort({ createdAt: -1 });

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ message: "failed", data: "No items found." });
    }

    const response = {
      items: [
        ...data.map((item) => ({
        itemid: item._id,
        name: item.name,
        inventorytype: item.inventorytype,
        type: "items",
        })),
    ]
    };

    

    return res.status(200).json({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log(
      `There's a problem encountered while fetching items. Error: ${err}`
    );
    return res.status(400).json({
      message: "bad-request",
      data:
        "There's a problem with the server. Please contact support for more details.",
    });
  }
};


exports.getskills = async (req, res) => {

    const skillsdata = await Skill.find({ category: { $ne: "Basic" } })
        .sort({ createdAt: -1 })
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while fetching skills. Error: ${err}`);
            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details." });
        });

    if (!skillsdata || skillsdata.length === 0) {
        return res.status(404).json({ message: "failed", data: "No skills found." });
    }

    const response = {
        skills: skillsdata.map(skill => ({
            skillid: skill._id,
            name: skill.name,
            description: skill.description,
            category: skill.category,
            maxLevel: skill.maxLevel,
            prerequisites: skill.prerequisites || [],
            imageUrl: skill.imageUrl
        }))
    };

    return res.status(200).json({
        message: "success",
        data: response
    });
}


//with exclude type
exports.getallitems = async (req, res) => {
  const { page = 1, limit = 10, excludeType, itemtype, gender } = req.query;

  const pageOptions = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const query = {};
  if (excludeType) {
    const excludeTypesArray = Array.isArray(excludeType) ? excludeType : [excludeType];
    query.type = { $nin: excludeTypesArray };
  }

  try {
    const items = await Item.find(query)
      .skip((pageOptions.page - 1) * pageOptions.limit)
      .limit(pageOptions.limit)
      .sort({ createdAt: -1 });

    const skills = await Skill.find({})
      .skip((pageOptions.page - 1) * pageOptions.limit)
      .limit(pageOptions.limit)
      .sort({ createdAt: -1 });

    if (!items && !skills) {
      return res.status(404).json({
        message: "failed",
        data: "No items or skills found.",
      });
    }

    const itemData = items.map((item) => ({
      itemid: item._id,
      name: item.name,
      type: item.type,
    }));

    const skillData = skills.map((skill) => ({
      itemid: skill._id,
      name: skill.name,
      type: "skills",
    }));

    const mergedItems = [...itemData, ...skillData];


    const totalItems = await Item.countDocuments(query) + await Skill.countDocuments({});
    const totalPages = Math.ceil(totalItems / pageOptions.limit);

    const response = {
      items: mergedItems,
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageOptions.page,
        itemsPerPage: pageOptions.limit,
      },
    };

    return res.status(200).json({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log(`There's a problem encountered while fetching data. Error: ${err}`);
    return res.status(400).json({
      message: "bad-request",
      data: "There's a problem with the server. Please contact support for more details.",
    });
  }
};

exports.editfreebiereward = async (req, res) => {
    const { itemid, amount, description, } = req.body;

    if (!itemid || !amount) {
        return res.status(400).json({ message: "failed", data: "Please provide item ID and amount." });
    }

    let item = await Item.findById(itemid)
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while fetching item. Error: ${err}`);
            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details." });
        });

    if (!item) {
        return res.status(404).json({ message: "failed", data: "Item not found." });
    }

    if (item.type !== "freebie") {
        return res.status(400).json({ message: "failed", data: "Item is not a freebie." });
    }

    // Determine which field to update
    const nonZeroFields = [
        { key: "exp", value: item.exp || 0 },
        { key: "crystals", value: item.crystals || 0 },
        { key: "coins", value: item.coins || 0 }
    ].filter(f => f.value > 0);

    if (nonZeroFields.length !== 1) {
        return res.status(400).json({ message: "failed", data: "Freebie item must have only one reward type set." });
    }

    const field = nonZeroFields[0].key;
    item[field] = amount;

    // Update Item collection
    await Item.findOneAndUpdate(
        { _id: itemid },
        { 
            [field]: amount,
            description: description || item.description 
        }
    ).catch(err => {
        console.log(`There's a problem encountered while updating item. Error: ${err}`);
        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details." });
    });

    // Update market.items as well
    await Market.updateMany(
        { "items._id": itemid },
        { $set: { [`items.$.${field}`]: amount, 'items.$.description': description || item.description } }
    ).catch(err => {
        console.log(`There's a problem encountered while updating market items. Error: ${err}`);
        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details." });
    });

    return res.status(200).json({
        message: "success",
        data: {
            itemid: item._id,
            name: item.name,
            type: item.type,
            amount: amount
        }
    });
}


exports.getallitemsandskill  = async (req, res) => {

    const { page, limit, itemType, genderType } = req.query;
    const pageOptions = {
        page: parseInt(page) || 0,
        limit: parseInt(limit) || 10
    };

    const query = {
        inventorytype: { $nin: ['skills', 'hair'] }
    };
    if (itemType) {

        if(itemType !== "item"){
            query.inventorytype = itemType;
        } else {
            query.inventorytype = { $nin: ['skills', 'hair', "weapon", "outfit"] }; // Exclude skills and hair for itemType "item"
        }
    }
    let skilldata
    if (itemType === "skills") {
        query.category = { $ne: "Basic" }; // Exclude Basic category for skills
        
        skilldata = await Skill.find(query)
            .skip(pageOptions.page* pageOptions.limit)
            .limit(pageOptions.limit)
            .sort({ createdAt: -1 })
            .then(data => data)
            .catch(err => {
                console.log(`There's a problem encountered while fetching skills. Error: ${err}`);
                return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details." });
            });
    }

    if (genderType) {
        query.gender  = genderType;

    }

    const items = await Item.find(query)
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .sort({ createdAt: -1 })
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while fetching items. Error: ${err}`);
            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details." });
        });

    if (!items || items.length === 0) {
        return res.status(404).json({ message: "failed", data: "No items found." });
    }

    
    const totalItems = await Item.countDocuments(query);
    const totalSkills = skilldata ? await Skill.countDocuments({ category: { $ne: "Basic" } }) : 0;
    const totalDocuments = totalItems + totalSkills;

    const totalPages = Math.ceil(totalDocuments / pageOptions.limit);
    

    const sdata = skilldata ? skilldata.map(skill => ({
        itemid: skill._id,
        name: skill.name,
        type: "skills",
        gender: "unisex"
    })) : [];

    const itemData = items.map(item => ({
        itemid: item._id,
        name: item.name,
        type: item.type,
        gender: item.gender
    }));
    const mergedItems = [...itemData, ...sdata];

    const response = {
        items: mergedItems,
        pagination: {
            totalItems: totalDocuments,
            totalPages,
            currentPage: pageOptions.page,
            itemsPerPage: pageOptions.limit
        }
    };

    return res.status(200).json({
        message: "success",
        data: response
    });
}