const Packs = require('../models/Packs');
const mongoose = require('mongoose');
const { Item, Market } = require('../models/Market');

// Create a new pack
exports.createpack = async (req, res) => {
    const { name, amount, currency, description, rarity, rewards } = req.body;

    if (!name || amount == null || !currency) {
        return res.status(400).json({ message: "bad-request", data: "name, amount, and currency are required." });
    }

    // Validate rewards if provided
    if (rewards && Array.isArray(rewards)) {
        if (rewards.length > 10) {
            return res.status(400).json({ message: "bad-request", data: "You can only add up to 10 rewards per pack." });
        }

        const validRewardTypes = ['badge', 'title', 'weapon', 'outfit', 'exp', 'coins', 'crystal'];
        for (const reward of rewards) {
            if (!reward.rewardtype) {
                return res.status(400).json({ message: "bad-request", data: "Each reward must have a rewardtype." });
            }
            if (!validRewardTypes.includes(reward.rewardtype)) {
                return res.status(400).json({ 
                    message: "bad-request", 
                    data: `Invalid rewardtype '${reward.rewardtype}'. Valid types are: ${validRewardTypes.join(', ')}.` 
                });
            }
        }

        const totalProbability = rewards.reduce((sum, r) => sum + (Number(r.probability) || 0), 0);
        if (totalProbability > 100) {
            return res.status(400).json({ message: "bad-request", data: "The total probability of rewards cannot exceed 100." });
        }
    }

    const session = await mongoose.startSession();
    try {
        await session.startTransaction();

        // Generate a single _id to be used across all collections
        const packId = new mongoose.Types.ObjectId();

        // Create pack in Packs collection
        const newPack = await Packs.create([{
            _id: packId,
            name,
            amount,
            currency,
            rewards: rewards || []
        }], { session });

        // Create item in Item collection
        const newItem = await Item.create([{
            _id: packId,
            name,
            type: "packs",
            inventorytype: "packs",
            price: amount,
            currency,
            description: description || "VIP Pack",
            rarity: rarity || "common",
            gender: "unisex",
            stats: {
                level: 1,
                damage: 0,
                defense: 0,
                speed: 0
            },
            imageUrl: "",
            isOpenable: true,
            isEquippable: false
        }], { session });

        // Add to store market
        const storeMarket = await Market.findOne({ marketType: 'store' }).session(session);
        
        if (storeMarket) {
            storeMarket.items.push(newItem[0]);
            storeMarket.lastUpdated = new Date();
            await storeMarket.save({ session });
        } else {
            // Create store market if it doesn't exist
            await Market.create([{
                marketType: 'store',
                items: [newItem[0]],
                lastUpdated: new Date()
            }], { session });
        }

        await session.commitTransaction();

        return res.status(201).json({ 
            message: "success", 
            data: {
                pack: newPack[0],
                item: newItem[0]
            }
        });
    } catch (error) {
        await session.abortTransaction();
        console.error("Error creating pack:", error);
        return res.status(500).json({ message: "server-error", data: "An error occurred while creating pack." });
    } finally {
        session.endSession();
    }
}

// Delete a pack
exports.deletepack = async (req, res) => {
    const { packid } = req.body;

    if (!packid) {
        return res.status(400).json({ message: "bad-request", data: "packid is required." });
    }

    const session = await mongoose.startSession();
    try {
        await session.startTransaction();

        // Delete from Packs collection
        const deletedPack = await Packs.findByIdAndDelete(packid).session(session);
        
        if (!deletedPack) {
            await session.abortTransaction();
            return res.status(404).json({ message: "not-found", data: "Pack not found." });
        }

        // Delete from Item collection
        await Item.findByIdAndDelete(packid).session(session);

        // Remove from all Market documents
        await Market.updateMany(
            { 'items._id': packid },
            { 
                $pull: { items: { _id: packid } },
                $set: { lastUpdated: new Date() }
            },
            { session }
        );

        await session.commitTransaction();

        return res.status(200).json({ 
            message: "success", 
            data: "Pack deleted successfully"
        });
    } catch (error) {
        await session.abortTransaction();
        console.error("Error deleting pack:", error);
        return res.status(500).json({ message: "server-error", data: "An error occurred while deleting pack." });
    } finally {
        session.endSession();
    }
}

// Get all packs and their rewards
exports.getPackRewards = async (req, res) => {
    try {
        const packs = await Packs.find()
            .sort({ createdAt: -1 });

        if (!packs || packs.length === 0) {
            return res.status(200).json({ message: "success", data: [], pagination: {
                currentPage: 1,
                totalPages: 0,
                totalItems: 0
            } });
        }

        const formatted = packs.map(pack => ({
            id: pack._id,
            name: pack.name,
            amount: pack.amount,
            currency: pack.currency,
            rewards: pack.rewards.map(r => ({
                rewardType: r.rewardtype,
                amount: r.amount,
                reward: r.reward,
                probability: r.probability
            })),
            createdAt: pack.createdAt.toISOString().split('T')[0]
        }));

        return res.status(200).json({ message: "success", data: formatted });
    } catch (error) {
        console.error("Error fetching packs:", error);
        return res.status(500).json({ message: "server-error", data: "An error occurred while fetching packs." });
    }
}

// Edit pack rewards for a specific pack
exports.editpackrewards = async (req, res) => {
    const { packid, rewards } = req.body;

    if (!packid || !rewards || !Array.isArray(rewards)) {
        return res.status(400).json({ message: "bad-request", data: "Invalid input data." });
    }

    if (rewards.length > 10) {
        return res.status(400).json({ message: "bad-request", data: "You can only add up to 10 rewards per pack." });
    }

    // Validate that each reward has a valid rewardtype
    const validRewardTypes = ['badge', 'title', 'weapon', 'outfit', 'exp', 'coins', 'crystal'];
    for (const reward of rewards) {
        if (!reward.rewardtype) {
            return res.status(400).json({ message: "bad-request", data: "Each reward must have a rewardtype." });
        }
        if (!validRewardTypes.includes(reward.rewardtype)) {
            return res.status(400).json({ 
                message: "bad-request", 
                data: `Invalid rewardtype '${reward.rewardtype}'. Valid types are: ${validRewardTypes.join(', ')}.` 
            });
        }
    }

    // Ensure total probability does not exceed 100
    const totalProbability = rewards.reduce((sum, r) => sum + (Number(r.probability) || 0), 0);
    if (totalProbability > 100) {
        return res.status(400).json({ message: "bad-request", data: "The total probability of rewards cannot exceed 100." });
    }

    const rewardIds = rewards.map(r => r.reward && r.reward.id).filter(id => id);
    const uniqueRewardIds = new Set(rewardIds);

    if (uniqueRewardIds.size !== rewardIds.length) {
        return res.status(400).json({ message: "bad-request", data: "Duplicate reward IDs are not allowed." });
    }

    try {
        const updated = await Packs.findOneAndUpdate(
            { _id: packid },
            { rewards: rewards },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "not-found", data: "Pack not found." });
        }

        return res.status(200).json({ message: "success", data: updated });
    } catch (error) {
        console.error("Error updating pack rewards:", error);
        return res.status(500).json({ message: "server-error", data: "An error occurred while updating pack rewards." });
    }
}

// Edit pack metadata (amount and currency) and propagate changes to Item and Market.items
exports.editpack = async (req, res) => {
    const { packid, amount, currency } = req.body;

    if (!packid || amount == null || !currency) {
        return res.status(400).json({ message: "bad-request", data: "packid, amount and currency are required." });
    }

    const session = await mongoose.startSession();
    try {
        await session.startTransaction();

        // Update pack
        const pack = await Packs.findById(packid).session(session);
        if (!pack) {
            await session.abortTransaction();
            return res.status(404).json({ message: "not-found", data: "Pack not found." });
        }

        pack.amount = amount;
        pack.currency = currency;
        await pack.save({ session });

        // Update Item (assuming pack _id maps to an Item with same _id)
        const item = await Item.findById(packid).session(session);
        if (!item) {
            await session.abortTransaction();
            return res.status(404).json({ message: "not-found", data: "Associated item not found." });
        }

        item.price = amount;
        item.currency = currency;
        await item.save({ session });

        // Update any Market documents that reference this item in their items array
        const markets = await Market.find({ 'items._id': packid }).session(session);
        for (const market of markets) {
            const idx = market.items.findIndex(i => i._id.toString() === packid.toString());
            if (idx !== -1) {
                market.items[idx].price = amount;
                market.items[idx].currency = currency;
                // in case the market stores crystals/coins fields too
                if (market.items[idx].crystals !== undefined) market.items[idx].crystals = item.crystals || 0;
                if (market.items[idx].coins !== undefined) market.items[idx].coins = item.coins || 0;
            }
            await market.save({ session });
        }

        await session.commitTransaction();

        return res.status(200).json({ message: "success", data: pack });
    } catch (error) {
        await session.abortTransaction();
        console.error("Error updating pack metadata:", error);
        return res.status(500).json({ message: "server-error", data: "An error occurred while updating pack metadata." });
    } finally {
        session.endSession();
    }
}
