const { default: mongoose } = require("mongoose")
const Characterwallet = require("../models/Characterwallet")
const { Market, CharacterInventory } = require("../models/Market")
const Characterdata = require("../models/Characterdata")


exports.getMarketItems = async (req, res) => {
    const { page, limit, type, rarity, search } = req.query

    const pageOptions = {
        page: parseInt(page, 10) || 0,
        limit: parseInt(limit, 10) || 10
    }

    try {
        // Build pipeline stages
        const pipeline = [
            { $unwind: '$items' },
            {
                $match: {
                    $and: []
                }
            }
        ];

        // Add search conditions if search parameter exists
        if (search) {
            pipeline[1].$match.$and.push({
                $or: [
                    { 'items.type': { $regex: new RegExp(search, "i") } },
                    { 'items.rarity': { $regex: new RegExp(search, "i") } },
                    { 'items.name': { $regex: new RegExp(search, "i") } }
                ]
            });
        }

        // Add type filter if specified
        if (type) {
            pipeline[1].$match.$and.push({ 'items.type': type });
        }

        // Add rarity filter if specified
        if (rarity) {
            pipeline[1].$match.$and.push({ 'items.rarity': rarity });
        }

        // If no conditions were added, remove the $and operator
        if (pipeline[1].$match.$and.length === 0) {
            delete pipeline[1].$match.$and;
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
                    imageUrl: '$items.imageUrl'
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


            // Check if item already exists in inventory
            const inventory = await CharacterInventory.findOne(
                { owner: characterid, 'items.item': itemid },
                { 'items.$': 1 }
            ).session(session);

            if (inventory?.items[0]) {
                await CharacterInventory.findOneAndUpdate(
                    { owner: characterid, 'items.item': itemid },
                    { $inc: { 'items.$.quantity': 1 } },
                    { session }
                );
            } else {
            // Update inventory
            await CharacterInventory.findOneAndUpdate(
                { owner: characterid, type: itemData.type },
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
            } else if(itemData.item.currency === "emerald") {
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
    const { characterid, itemid, quantity } = req.body

    try {
        const item = await Market.findOne(
            { 'items._id': itemid },
            { 'items.$': 1 }
        );

        if (!item?.items[0]) {
            return res.status(404).json({ message: "failed", data: "Item not found" });
        }

        const itemData = item.items[0];

        const session = await mongoose.startSession();

        try {

            await session.startTransaction();

            // Check if item already exists in inventory
            const inventory = await CharacterInventory.findOne(
                { owner: characterid, 'items.item': itemid },
                { 'items.$': 1 }
            ).session(session);

            if (inventory?.items[0]) {
                await CharacterInventory.findOneAndUpdate(
                    { owner: characterid, 'items.item': itemid },
                    { $inc: { 'items.$.quantity': quantity } },
                    { session }
                );
            } else {
                await CharacterInventory.findOneAndUpdate(
                    { owner: characterid, type: itemData.type },
                    { $push: { items: { item: itemData._id, quantity } } },
                    { upsert: true, new: true, session }
                );
            }

            await session.commitTransaction();

            return res.status(200).json({ 
                message: "success",
                data: {
                    item: itemData.name,
                    quantity
                }
            });

        }
        catch (err) {
            await session.abortTransaction();
            console.log(`Error granting item to player: ${err}`);
            return res.status(500).json({ 
                message: "failed", 
                data: "Failed to grant item" 
            });
        } finally {
            session.endSession();
        }

    } catch (err) {
        console.log(`Error finding item: ${err}`);
        return res.status(400).json({ 
            message: "failed", 
            data: "There's a problem with the server! Please try again later." 
        });
    }
}


//superadmin
exports.createItem = async (req, res) => {
    try {
        const {name, price, currency, type, gender, description, rarity, stats } = req.body;

    
        if (!name || !price || !currency || !type || !gender || !rarity) {
            return res.status(400).json({ message: "failed", data: "Missing required fields." });
        }

        let imageUrl = "";
        if (req.file) {
            imageUrl = req.file.path;
        } else {
            return res.status(400).json({ message: "failed", data: "Please select an image first!" });
        }

        const validCurrencies = ["coins", "emerald", "crystal"];
        const validRarities = ["basic", "common", "epic", "rare", "legendary"];
        const validGenders = ["male", "female", "unisex"];

        if (!validCurrencies.includes(currency)) {
            return res.status(400).json({ message: "failed", data: "Invalid currency type." });
        }
        if (!validRarities.includes(rarity)) {
            return res.status(400).json({ message: "failed", data: "Invalid rarity type." });
        }
        if (!validGenders.includes(gender)) {
            return res.status(400).json({ message: "failed", data: "Invalid gender type." });
        }

        const defaultStats = {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0,
        };
        const itemStats = { ...defaultStats, ...stats };

        const market = await Market.findOne();
        if (!market) {
            return res.status(404).json({ message: "failed", data: "Market not found." });
        }

        const newItem = {
            _id: new mongoose.Types.ObjectId(),
            name,
            price,
            currency,
            type,
            gender,
            description: description || "N/A",
            rarity,
            imageUrl,
            stats: itemStats,
        };

        market.items.push(newItem);
        await market.save();

        return res.status(201).json({ message: "success", data: newItem });

    } catch (err) {
        console.error(`Error creating item: ${err}`);
        return res.status(500).json({ message: "server-error", data: "There's a problem with the server." });
    }
};


exports.deleteItem = async (req, res) => {
    try {
        const { itemId } = req.query;

        if (!itemId) {
            return res.status(400).json({ message: "failed", data: "Item ID is required." });
        }

        let market = await Market.findOne();
        if (!market) {
            return res.status(404).json({ message: "failed", data: "Market not found." });
        }

        const itemIndex = market.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "failed", data: "Item not found in Market." });
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
        const { itemId,name, price, currency, type, gender, description, rarity, stats } = req.body;

        if (!itemId) {
            return res.status(400).json({ message: "failed", data: "Item ID is required." });
        }

        let market = await Market.findOne();
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



