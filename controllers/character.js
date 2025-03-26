const { default: mongoose } = require("mongoose")
const Characterdata = require("../models/Characterdata")
const CharacterStats = require("../models/Characterstats")
const Charactertitle = require("../models/Charactertitles")
const Characterwallet = require("../models/Characterwallet")
const Rankings = require("../models/Ranking")
const { CharacterSkillTree } = require("../models/Skills")
const { Battlepass } = require("../models/Battlepass")
const { checkcharacter } = require("../utils/character")
const { CharacterInventory } = require("../models/Market")
const { MonthlyLogin, SpinnerRewards } = require("../models/Rewards")

exports.createcharacter = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        await session.startTransaction();

        const { id } = req.user;
        const { username, gender, outfit, hair, eyes, facedetails, color, itemindex } = req.body;

        // Validation checks...
        if(!id) {
            return res.status(401).json({ 
                message: "failed", 
                data: "You are not authorized to view this page. Please login the right account to view the page."
            });
        }

            
        const usernameRegex = /^[a-zA-Z0-9]+$/;

        if(username.length < 5 || username.length > 20){
            return res.status(400).json({ message: "failed", data: "Username length should be greater than 5 and less than 20 characters."})
        }
        if(!usernameRegex.test(username)){
            return res.status(400).json({ message: "failed", data: "No special characters are allowed for username"})
        }

        if(!hair){
            return res.status(400).json({ message: "failed", data: "Character creation failed: Missing required attributes. Please select gender, outfit, hair, eyes, face details, and color."})
        }


        const characterCount = await Characterdata.countDocuments({ owner: id });
        if (characterCount >= 4) {
            return res.status(400).json({ message: "failed", data: "Character limit reached. You cannot create more than 4 characters." });
        }   

        const exists = await Characterdata.findOne({ username: { $regex: new RegExp('^' + username + '$', 'i')} })

        if(exists){
            return res.status(400).json({ message: "failed", data: "Username already used." });
        }
        // Create character data
        const data = await Characterdata.create([{ 
            owner: id, 
            username,
            gender, 
            outfit,
            hair,
            eyes,
            facedetails,
            color,
            title: 0,
            experience: 0,
            level: 1,
            badge: "",
            itemindex
        }], { session });

        const characterId = data[0]._id;

        // Create character stats
        await CharacterStats.create([{
            owner: characterId,
            health: 100,
            energy: 50,
            armor: 20,
            magicresist: 15,
            speed: 10,
            attackdamage: 9,
            armorpen: 0,
            magicpen: 0,
            critchance: 0,
            magicdamage: 15,
            lifesteal: 0,
            omnivamp: 0,
            healshieldpower: 0,
            critdamage: 0,
        }], { session });

        // Create character titles
        await Charactertitle.create([{ 
            owner: characterId, 
            items: [{ itemid: "" }]
        }], { session });

        // Create rankings
        await Rankings.create([{ 
            owner: characterId, 
            mmr: 10 
        }], { session });

        // Create skill tree
        await CharacterSkillTree.create([{ 
            owner: characterId, 
            skillPoints: 0, 
            skills: [], 
            unlockedSkills: [] 
        }], { session });

        // Create wallets
        const walletListData = ["coins", "crystal", "emerald"];
        const walletBulkwrite = walletListData.map(walletData => ({
            insertOne: {
                document: { owner: characterId, type: walletData, amount: "0" }
            }
        }));
        await Characterwallet.bulkWrite(walletBulkwrite, { session });

        // Create inventory
        const inventoryListData = ["weapon", "outfit", "hair", "face", "eyes", "skincolor", "skins"];
        const inventoryBulkWrite = inventoryListData.map(inventoryData => ({
            insertOne: {
                document: { owner: characterId, type: inventoryData }
            }
        }));
        await CharacterInventory.bulkWrite(inventoryBulkWrite, { session });

        const battlepassData = await Battlepass.findOne
        ({ owner: id, season: 1 })

        if(!battlepassData){
            await Battlepass.create([{
                owner: id,
                season: 1,
                level: 1,
                xp: 0,
                rewards: []
            }], { session })
        }

        await MonthlyLogin.create({
            owner: characterId,
            month: new Date().getMonth(),
            year: new Date().getFullYear()
        }, { session })
        
        await SpinnerRewards.create({
            owner: characterId
        }, { session })

        await session.commitTransaction();
        return res.status(200).json({ message: "success" });

    } catch (error) {
        await session.abortTransaction();
        console.log(`Error in character creation: ${error}`);
        return res.status(400).json({ 
            message: "bad-request", 
            data: error.message 
        });
    } finally {
        session.endSession();
    }
}

exports.getplayerdata = async (req, res) => {
    const { characterid } = req.query

    if(!characterid){
        return res.status(400).json({ message: "failed", data: "Please input character ID."})
    }

    const matchCondition = [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(characterid) 
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $lookup: {
                from: "characterwallets",  
                localField: "_id",          
                foreignField: "owner",
                as: "wallet"      
            },
        },
        {
            $lookup: {
                from: "characterinventories",             
                localField: "_id",       
                foreignField: "owner",       
                as: "inventory"
            }
        },        
        {
            $lookup: {
                from: "rankings",             
                localField: "_id",       
                foreignField: "owner",       
                as: "ranking"
            }
        },
        {
            $lookup: {
                from: "characterstats",
                localField: "_id",
                foreignField: "owner",
                as: "stats"
            }
        },
        { $unwind: "$stats"},
        {
            $project: {
                id: 1,
                userid: { $arrayElemAt: ["$user._id", 0] },
                user: { $arrayElemAt: ["$user.username", 0] }, // Flatten user.username
                status: { $arrayElemAt: ["$user.status", 0] },    // Flatten user.status
                username: 1,
                title: 1,
                level: 1,
                experience: 1,
                mmr: { $arrayElemAt: ["$ranking.mmr", 0] },      // Flatten ranking.mmr
                wallet: {                 
                    $map: {               
                        input: "$wallet", 
                        as: "w",          
                        in: {             
                            type: "$$w.type",      
                            amount: "$$w.amount"  
                        }
                    }
                },
                inventory: {                 
                    $map: {               
                        input: "$inventory", 
                        as: "w",          
                        in: {             
                            type: "$$w.type",      
                            items: "$$w.items"  
                        }
                    }
                },
                stats: {
                    health: "$stats.health",
                    energy: "$stats.energy",
                    armor: "$stats.armor",
                    magicresist: "$stats.magicresist",
                    speed: "$stats.speed",
                    attackdamage: "$stats.attackdamage",
                    armorpen: "$stats.armorpen",
                    magicpen: "$stats.magicpen",
                    critchance: "$stats.critchance",
                    magicdamage: "$stats.magicdamage",
                    lifesteal: "$stats.lifesteal",
                    omnivamp: "$stats.omnivamp",
                    healshieldpower: "$stats.healshieldpower",
                    critdamage: "$stats.critdamage",
                }
            }
        }
    ];

    const characterData = await Characterdata.aggregate(matchCondition)

    return res.status(200).json({ message: "success", data: characterData})
}

exports.getplayercharacters = async (req, res) => {
    const {id} = req.user

    const tempdata = await Characterdata.find({owner: new mongoose.Types.ObjectId(id)})
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem while fetching character datas for user: ${id}. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later."})
    })

    const data = {}
    let index = 0;
    tempdata.forEach(temp => {
        const {_id, username, gender, outfit, hair, eyes, facedetails, level, color, title, experience, badge} = temp;

        data[index] = {
            id: _id,
            Username: username,
            CharacterCostume: {
                Gender: gender,
                Outfit: outfit,
                Hair: hair,
                Eyes: eyes,
                Facedetails: facedetails,
                Color: color,
            },
            Title: title,
            CurrentXP: experience,
            Badge: badge,
            Level: level,
        }
        index++;
    })

    return res.json({message: "success", data: data})
} 

exports.getplayercharactersweb = async (req, res) => {
    const {id} = req.user

    const tempdata = await Characterdata.find({owner: new mongoose.Types.ObjectId(id)})
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem while fetching character datas for user: ${id}. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later."})
    })

    const data = []
    tempdata.forEach(temp => {
        const {_id, username } = temp;

        data.push({
            id: _id,
            username: username,
        })
    })

    return res.json({message: "success", data: data})
} 

exports.getinventory = async (req, res) => {
    const { id } = req.user;
    const { characterid, page = 0, limit = 10 } = req.query;

    if(!characterid) {
        return res.status(400).json({ 
            message: "failed", 
            data: "Please input character ID"
        });
    }

    try {
        const pageOptions = {
            page: parseInt(page),
            limit: parseInt(limit)
        };

        const [inventoryResults, totalItems] = await Promise.all([
            CharacterInventory.aggregate([
                { 
                    $match: { 
                        owner: new mongoose.Types.ObjectId(characterid) 
                    } 
                },
                { 
                    $unwind: { 
                        path: "$items",
                        preserveNullAndEmptyArrays: true 
                    } 
                },
                {
                    $lookup: {
                        from: "items",
                        localField: "items.item",
                        foreignField: "_id",
                        as: "itemDetails"
                    }
                },
                { $unwind: { path: "$itemDetails", preserveNullAndEmptyArrays: true } },
                { $skip: pageOptions.page * pageOptions.limit },
                { $limit: pageOptions.limit }
            ]),
            CharacterInventory.aggregate([
                { 
                    $match: { 
                        owner: new mongoose.Types.ObjectId(characterid) 
                    } 
                },
                { 
                    $unwind: { 
                        path: "$items",
                        preserveNullAndEmptyArrays: true 
                    } 
                },
                { $count: "total" }
            ])
        ]);

        const formattedResponse = {
            data: inventoryResults.reduce((acc, item, index) => {
                acc[index + 1] = {
                    id: item._id,
                    type: item.type,
                    item: item.items ? {
                        id: item.items.item,
                        quantity: item.items.quantity,
                        isEquipped: item.items.isEquipped,
                        acquiredAt: item.items.acquiredAt,
                        details: item.itemDetails ? {
                            name: item.itemDetails.name,
                            description: item.itemDetails.description,
                            rarity: item.itemDetails.rarity,
                            stats: item.itemDetails.stats,
                            level: item.itemDetails.level,
                            price: item.itemDetails.price
                        } : null
                    } : null
                };
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
        console.error(`Error fetching inventory: ${err}`);
        return res.status(400).json({ 
            message: "bad-request", 
            data: "There's a problem with the server. Please try again later."
        });
    }
};

exports.getranking = async (req, res) => {
    const { characterid } = req.query 

    if(!characterid) {
        res.status(400).json({ message: "failed", data: "Please input characterId"})
    }

    const rankingData = await Rankings.find({ owner: new mongoose.Types.ObjectId(characterid)})
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while fetching ranking. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later."})
    })

    return res.status(200).json({ message: "success", data: rankingData})

        // const { id, username } = req.user
        // const { limit } = req.query

        // const pageOptions = {
        //     limit: parseInt(limit) || 10,
        // }

        // const rankingData = await Rankings
        // .find({})
        // .sort({ amount: -1 })
        // .limit(pageOptions.limit)
        // .populate({ path: 'owner', select: 'username' }) 
        // .select('amount owner')
        // .then(data => data)
        // .catch(err => {
        //     console.log(`There's a problem while fetching leaderboard data for ${username}. Error: ${err}`)
        //     return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later." })
        // })
        // const rank = leaderboardData.findIndex(item => item.owner.id.toString() === id.toString()) + 1

        // index = 0;
        // const data = {}
        // leaderboardData.map(item => {
        //     data[index] = {
        //         username: item.owner.username,
        //         amount: item.amount
        //     }
        //     index++
        // })

}

exports.getcharacterrank = async (req, res) => {
    const { characterid } = req.query;

    if (!characterid) {
        return res.status(400).json({ message: "failed", data: "Please input characterId" });
    }

    try {
        const rankingData = await Rankings.findOne(
            { owner: new mongoose.Types.ObjectId(characterid) },
            "mmr rank"
        ).populate("rank", "name icon");

        if (!rankingData) {
            return res.status(404).json({ message: "not-found", data: "Character rank not found" });
        }

        return res.status(200).json({
            message: "success",
            data: {
                mmr: rankingData.mmr,
                rankTier: rankingData.rank?.name || "Unranked",
                icon: rankingData.rank?.icon || null
            }
        });
    } catch (err) {
        console.error(`Error fetching ranking: ${err}`);
        return res.status(500).json({
            message: "server-error",
            data: "There's a problem with the server. Please try again later."
        });
    }
};


exports.getxplevel = async (req, res) => {
    const { characterid } = req.query

    if(!characterid){
        return res.status(400).json({ message: "failed", data: "Please input user ID"})
    }

    const xpleveldata = await Characterdata.findOne(
        { _id: new mongoose.Types.ObjectId(characterid)},
        { experience: 1, level: 1, username: 1}
    )
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem while fetching user exp level data. Error ${err}`)
        return res.status(400).json({ message: "bad-request", data: "There's a problem in the server. Please try again later."})
    })

    return res.status(200).json({ message: "success", data: xpleveldata})
}

exports.getWallet = async (req, res) => {

    const { characterid } = req.query

    if(!characterid){
        return res.status(400).json({ message: "failed", data: "There's no character ID."})
    }

    const walletData = await Characterwallet.find({ owner: new mongoose.Types.ObjectId(characterid)})
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while fetching wallet data. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })

    const data = []

    walletData.forEach(temp => {
        data.push({
            type: temp.type,
            amount: temp.amount
        })
    })

    return res.status(200).json({ message: "success", data: data})
}

exports.getcharactertitles = async (req, res) => {
    const { characterid } = req.query

    if(!characterid){
        return res.status(400).json({ message: "failed", data: "Please input character ID."})
    }

    const charactertitles = await Charactertitle.find({ owner: new mongoose.Types.ObjectId(characterid)})
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while fetching character titles. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })


    const formattedResponse = {
        data: charactertitles.reduce((acc, title, index) => {
            acc[index + 1] = {
                id: title._id,
                type: title.type,
                items: title.items
            }
            return acc
        }, {})
    }

    return res.status(200).json({ 
        message: "success", 
        data: formattedResponse.data 
    })
}

exports.addxp = async (req, res) => {
    const { characterid, xp } = req.body;

    if(!characterid || !xp) {
        return res.status(400).json({ 
            message: "failed", 
            data: "Please input character ID and XP."
        });
    }

    try {
        const character = await Characterdata.findOne({ 
            _id: new mongoose.Types.ObjectId(characterid)
        });

        if(!character) {
            return res.status(400).json({ 
                message: "failed", 
                data: "Character not found."
            });
        }

        let currentLevel = character.level;
        let currentXP = character.experience + xp;
        let levelsGained = 0;

        // Calculate multiple level ups
        while (true) {
            let xpNeeded = 80 * currentLevel;
            
            if (currentXP >= xpNeeded) {
                currentLevel++;
                currentXP -= xpNeeded;
                levelsGained++;
            } else {
                break;
            }
        }

        // If levels were gained, update stats and skill points
        if (levelsGained > 0) {
            await CharacterStats.findOneAndUpdate(
                { owner: characterid }, 
                {
                    $inc: {
                        health: 10 * levelsGained,
                        energy: 5 * levelsGained,
                        armor: 2 * levelsGained,
                        magicresist: 1 * levelsGained,
                        speed: 1 * levelsGained,
                        attackdamage: 1 * levelsGained,
                        armorpen: 1 * levelsGained,
                        magicpen: 1 * levelsGained,
                        magicdamage: 1 * levelsGained,
                        critdamage: 1 * levelsGained
                    }
                }
            );

            await CharacterSkillTree.findOneAndUpdate(
                { owner: characterid }, 
                {
                    $inc: {
                        skillPoints: 4 * levelsGained
                    }
                }
            );
        }

        // Update character level and experience
        character.level = currentLevel;
        character.experience = currentXP;
        await character.save();

        return res.status(200).json({ 
            message: "success",
            data: {
                newLevel: currentLevel,
                levelsGained,
                currentXP,
                nextLevelXP: 80 * currentLevel
            }
        });

    } catch (err) {
        console.log(`Error in XP addition: ${err}`);
        return res.status(500).json({
            message: "failed",
            data: "There's a problem with the server. Please contact support for more details."
        });
    }
};

exports.updateplayerprofile = async (req, res) => {

    const { username, characterid } = req.body

    if(!username || !characterid){
        return res.status(400).json({ message: "failed", data: "Please input username and character ID."})
    }

    const character = await Characterdata.findOne({ _id: new mongoose.Types.ObjectId(characterid)})

    if(!character){
        return res.status(400).json({ message: "failed", data: "Character not found."})
    }

    const usernameRegex = /^[a-zA-Z0-9]+$/;

    if(username.length < 5 || username.length > 20){
        return res.status(400).json({ message: "failed", data: "Username length should be greater than 5 and less than 20 characters."})
    }
    if(!usernameRegex.test(username)){
        return res.status(400).json({ message: "failed", data: "No special characters are allowed for username"})
    }

    character.username = username

    await character.save()
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while saving character data. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })

    return res.status(200).json({ message: "success"})

}

exports.updateplayertitle = async (req, res) => {
    const { titleid, characterid } = req.body;

    const session = await mongoose.startSession();
    try {
        await session.startTransaction();

        // Find title in character's titles
        const character = await Charactertitle.findOne(
            { owner: new mongoose.Types.ObjectId(characterid) }
        ).session(session);

        if (!character) {
            await session.abortTransaction();
            return res.status(404).json({ 
                message: "failed", 
                data: "Character title not found" 
            });
        }

        // Check if title exists in character's titles
        const hasTitle = character.items.some(item => item.itemid === titleid);
        if (!hasTitle) {
            await session.abortTransaction();
            return res.status(404).json({ 
                message: "failed", 
                data: "Title not found in character's collection" 
            });
        }

        // check if there is a title equipped
        const equippedTitle = character.items.find(item => item.isEquipped === true);
        if (equippedTitle) {
            // Unequip the title
            equippedTitle.isEquipped = false;
        }

        // Equip the new title
        const titleIndex = character.items.findIndex(item => item.itemid === titleid);
        character.items[titleIndex].isEquipped = true;

        // Save the updated title

        await character.save({ session });

        await session.commitTransaction();
        return res.status(200).json({ 
            message: "success",
        });

    } catch (err) {
        await session.abortTransaction();
        console.log(`Error in update title transaction: ${err}`);
        return res.status(500).json({ 
            message: "failed", 
            data: "Failed to update title" 
        });
    } finally {
        session.endSession();
    }
}