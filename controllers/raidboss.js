const { default: mongoose } = require("mongoose");
const Raidboss = require("../models/Raidboss");
const RaidbossFight = require("../models/Raidbossfight");
const { Item } = require("../models/Market");
const { Skill } = require("../models/Skills");
const Characterdata = require("../models/Characterdata");
const { awardBattlepassReward, determineRewardType } = require("../utils/battlepassrewards");
const { gethairbundle } = require("../utils/bundle");
const ResetHistory = require("../models/Resethistory");
const socket = require("../socket/config");

// CRUD Operations

exports.createRaidboss = async (req, res) => {
    const { bossname, rewards, status } = req.body;

    if (!bossname) {
        return res.status(400).json({ 
            message: "failed", 
            data: "Boss name is required" 
        });
    }

    if ((!rewards || (Array.isArray(rewards) && rewards.length === 0))) {
        return res.status(400).json({ 
            message: "failed", 
            data: "Please provide at least one reward" 
        });
    }

    try {
        // Check if boss already exists
        const existingBoss = await Raidboss.findOne({ 
            bossname: { $regex: new RegExp('^' + bossname + '$', 'i') } 
        });

        if (existingBoss) {
            return res.status(400).json({ 
                message: "failed", 
                data: "Boss with this name already exists" 
            });
        }

        // Validate and normalize rewards using determineRewardType
        let normalizedRewards = [];
        if (rewards && Array.isArray(rewards)) {
            if (rewards.length > 3) {
                return res.status(400).json({ 
                    message: "failed", 
                    data: "Rewards entries must not exceed 3" 
                });
            }

            for (const reward of rewards) {
                const normalized = determineRewardType(reward);
                if (!normalized || normalized.type === 'invalid') {
                    return res.status(400).json({ 
                        message: "failed", 
                        data: `Invalid reward entry: ${JSON.stringify(reward)}` 
                    });
                }
                normalizedRewards.push({
                    type: normalized.type,
                    amount: normalized.amount,
                    id: normalized.id,
                    gender: reward.gender
                });
            }
        }

        // Validate reward counts
        const rewardsCount = normalizedRewards.length;

        if (rewardsCount > 15) {
            return res.status(400).json({ 
                message: "failed", 
                data: "Total number of rewards must not exceed 15" 
            });
        }

        const newBoss = await Raidboss.create({
            bossname,
            rewards: normalizedRewards,
            status: status || "inactive"
        });

        return res.status(200).json({ 
            message: "success", 
            data: newBoss 
        });

    } catch (err) {
        console.error(`Error creating raid boss: ${err}`);
        return res.status(500).json({ 
            message: "error", 
            data: "There's a problem with the server. Please contact support." 
        });
    }
};

exports.getRaidbosses = async (req, res) => {
    const { status, page, limit } = req.query;

    let query = {};
    const pageOptions = {
        page: parseInt(page) || 0,
        limit: parseInt(limit) || 10,
    };

    if (status) {
        query.status = status;
    }

    try {
        const raidbosses = await Raidboss.find(query)
            .sort({ createdAt: -1 })
            .skip(pageOptions.page * pageOptions.limit)
            .limit(pageOptions.limit);

        const totalCount = await Raidboss.countDocuments(query);
        const totalPages = Math.ceil(totalCount / pageOptions.limit);

        const formattedData = raidbosses.map(boss => ({
            id: boss._id,
            bossname: boss.bossname,
            status: boss.status,
            rewards: boss.rewards,
            createdAt: boss.createdAt,
            updatedAt: boss.updatedAt
        }));

        return res.status(200).json({ 
            message: "success", 
            data: formattedData,
            pagination: {
                totalCount,
                totalPages,
                currentPage: pageOptions.page,
                limit: pageOptions.limit
            }
        });

    } catch (err) {
        console.error(`Error fetching raid bosses: ${err}`);
        return res.status(500).json({ 
            message: "error", 
            data: "There's a problem with the server. Please contact support." 
        });
    }
};

exports.updateRaidboss = async (req, res) => {
    const { id, bossname, rewards, status } = req.body;

    if (!id) {
        return res.status(400).json({ 
            message: "failed", 
            data: "Boss ID is required" 
        });
    }

    try {
        const boss = await Raidboss.findById(id);
        if (!boss) {
            return res.status(404).json({ 
                message: "failed", 
                data: "Raid boss not found" 
            });
        }

        if (rewards.length > 15) {
            return res.status(400).json({
                message: "failed",
                data: "Total number of rewards must not exceed 15"
            });
        }

        if (bossname) boss.bossname = bossname;
        boss.rewards = rewards;
        if (status) boss.status = status;

        await boss.save();

        return res.status(200).json({ 
            message: "success", 
            data: boss 
        });

    } catch (err) {
        console.error(`Error updating raid boss: ${err}`);
        return res.status(500).json({ 
            message: "error", 
            data: "There's a problem with the server. Please contact support." 
        });
    }
};

exports.deleteRaidboss = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ 
            message: "failed", 
            data: "Boss ID is required" 
        });
    }

    try {
        const boss = await Raidboss.findByIdAndDelete(id);
        if (!boss) {
            return res.status(404).json({ 
                message: "failed", 
                data: "Raid boss not found" 
            });
        }

        return res.status(200).json({ 
            message: "success", 
            data: "Raid boss deleted successfully" 
        });

    } catch (err) {
        console.error(`Error deleting raid boss: ${err}`);
        return res.status(500).json({ 
            message: "error", 
            data: "There's a problem with the server. Please contact support." 
        });
    }
};

// Reward Distribution

exports.awardRaidbossRewards = async (req, res) => {
    const { characterid, bossid } = req.body;

    if (!characterid || !bossid) {
        return res.status(400).json({ 
            message: "failed", 
            data: "Character ID and Boss ID are required" 
        });
    }

    const session = await mongoose.startSession();

    try {
        await session.startTransaction();

        // Get character data
        const character = await Characterdata.findById(characterid).session(session);
        if (!character) {
            await session.abortTransaction();
            return res.status(404).json({ 
                message: "failed", 
                data: "Character not found" 
            });
        }

        // Get raid boss data
        const boss = await Raidboss.findById(bossid).session(session);

        if (!boss) {
            await session.abortTransaction();
            return res.status(404).json({ 
                message: "failed", 
                data: "Raid boss not found" 
            });
        }

        const results = [];

        // Award dynamic rewards using determineRewardType
        if (boss.rewards && boss.rewards.length > 0) {
            for (const reward of boss.rewards) {
                // Use determineRewardType to process the reward
                const processedReward = determineRewardType(reward, character.gender);
                
                if (processedReward && processedReward.type !== 'invalid') {
                    const result = await awardBattlepassReward(characterid, processedReward, session);
                    results.push(result);

                    // Check for hair bundle if it's an outfit/skin
                    if (processedReward.type === 'item' && 
                        ['outfit', 'skin'].includes(processedReward.itemType) && 
                        processedReward.id) {
                        const hairId = gethairbundle(processedReward.id.toString());
                        if (hairId && hairId !== "failed" && hairId !== "") {
                            const hairReward = {
                                type: 'item',
                                id: hairId,
                                itemType: 'hair',
                                amount: 1
                            };
                            const hairResult = await awardBattlepassReward(characterid, hairReward, session);
                            results.push(hairResult);
                        }
                    }
                }
            }
        }

        // Mark raid boss fight as done for this character
        await RaidbossFight.findOneAndUpdate(
            { owner: characterid },
            { status: "done" },
            { upsert: true, session }
        );

        await session.commitTransaction();

        return res.status(200).json({ 
            message: "success", 
            data: {
                boss: boss.bossname,
                results: results.filter(r => r && r.success)
            }
        });

    } catch (err) {
        await session.abortTransaction();
        console.error(`Error awarding raid boss rewards: ${err}`);
        return res.status(500).json({ 
            message: "error", 
            data: "Failed to award raid boss rewards" 
        });
    } finally {
        session.endSession();
    }
};

// Admin Management

exports.setActiveRaidboss = async (req, res) => {
    const { bossid } = req.body;

    if (!bossid) {
        return res.status(400).json({ 
            message: "failed", 
            data: "Boss ID is required" 
        });
    }

    const session = await mongoose.startSession();

    try {
        await session.startTransaction();

        // Check if boss exists
        const boss = await Raidboss.findById(bossid).session(session);
        if (!boss) {
            await session.abortTransaction();
            return res.status(404).json({ 
                message: "failed", 
                data: "Raid boss not found" 
            });
        }

        // Set all bosses to inactive
        await Raidboss.updateMany({}, { $set: { status: "inactive" } }, { session });

        // Activate the chosen boss
        await Raidboss.findByIdAndUpdate(
            bossid,
            { $set: { status: "active" } },
            { session }
        );

        // Reset all fight statuses
        await RaidbossFight.updateMany({}, { $set: { status: "notdone" } }, { session });

        await session.commitTransaction();

        // Calculate time until next midnight for timer
        const now = new Date();
        const midnight = new Date(now);
        midnight.setDate(midnight.getDate() + 1);
        midnight.setHours(0, 0, 0, 0);
        const timeUntilMidnight = midnight - now;
        const secondsRemaining = Math.floor(timeUntilMidnight / 1000);

        socket.emit("sendchangeraidboss", { raidboss: boss.bossname, timeremaining: secondsRemaining })

        return res.status(200).json({ 
            message: "success", 
            data: `${boss.bossname} is now the active raid boss` 
        });

    } catch (err) {
        await session.abortTransaction();
        console.error(`Error setting active raid boss: ${err}`);
        return res.status(500).json({ 
            message: "error", 
            data: "Failed to set active raid boss" 
        });
    } finally {
        session.endSession();
    }
};

exports.manualResetRaidboss = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        await session.startTransaction();

        // Get all inactive bosses
        const inactiveBosses = await Raidboss.find({ status: "inactive" }).session(session);

        if (inactiveBosses.length === 0) {
            await session.abortTransaction();
            return res.status(400).json({ 
                message: "failed", 
                data: "No inactive bosses available to activate" 
            });
        }

        // Pick a random boss from the inactive ones
        const randomBoss = inactiveBosses[Math.floor(Math.random() * inactiveBosses.length)];

        // Set all bosses to inactive
        await Raidboss.updateMany({}, { $set: { status: "inactive" } }, { session });

        // Activate the chosen boss
        await Raidboss.findByIdAndUpdate(
            randomBoss._id,
            { $set: { status: "active" } },
            { session }
        );

        // Reset all fight statuses
        await RaidbossFight.updateMany({}, { $set: { status: "notdone" } }, { session });

        await session.commitTransaction();

        try {
            const id = req.user && (req.user.id || req.user._id) ? (req.user.id || req.user._id) : null;
            if (id) {
                await ResetHistory.create({
                    owner: id,
                    type: "raidboss",
                    action: `Manual reset raidboss ${randomBoss.bossname}`,
                }).then(data => data).catch(err => {
                    console.error("Failed to log manual raidboss reset:", err);
                });
            }
        } catch (logErr) {
            console.error("Error while attempting to write reset history:", logErr);
        }

        // Calculate time until next midnight for timer
        const now = new Date();
        const midnight = new Date(now);
        midnight.setDate(midnight.getDate() + 1);
        midnight.setHours(0, 0, 0, 0);
        const timeUntilMidnight = midnight - now;
        const secondsRemaining = Math.floor(timeUntilMidnight / 1000);

        socket.emit("sendchangeraidboss", { raidboss: randomBoss.bossname, timeremaining: secondsRemaining })
        
        return res.status(200).json({ 
            message: "success", 
            data: {
                newActiveBoss: randomBoss.bossname,
                timeRemaining: secondsRemaining,
                resetTime: midnight
            }
        });

    } catch (err) {
        await session.abortTransaction();
        console.error(`Error in manual raid boss reset: ${err}`);
        return res.status(500).json({ 
            message: "error", 
            data: "Failed to reset raid boss" 
        });
    } finally {
        session.endSession();
    }
};

// exports.getRaidbossStats = async (req, res) => {
//     try {
//         const stats = await Raidboss.aggregate([
//             {
//                 $group: {
//                     _id: "$status",
//                     count: { $sum: 1 }
//                 }
//             }
//         ]);

//         const fightStats = await RaidbossFight.aggregate([
//             {
//                 $group: {
//                     _id: "$status",
//                     count: { $sum: 1 }
//                 }
//             }
//         ]);

//         const activeBoss = await Raidboss.findOne({ status: "active" });

//         return res.status(200).json({ 
//             message: "success", 
//             data: {
//                 bossStats: stats,
//                 fightStats: fightStats[0].count || 0,
//                 activeBoss: activeBoss ? activeBoss.bossname : "None",
//                 activeBossId: activeBoss ? activeBoss._id : null
//             }
//         });

//     } catch (err) {
//         console.error(`Error getting raid boss stats: ${err}`);
//         return res.status(500).json({ 
//             message: "error", 
//             data: "Failed to get raid boss statistics" 
//         });
//     }
// };

