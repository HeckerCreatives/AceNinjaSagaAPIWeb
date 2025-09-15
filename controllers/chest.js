const Chest = require('../models/Chests');
const mongoose = require('mongoose');
const { Item, Market } = require('../models/Market');

// Get all chests and their rewards
exports.getChestRewards = async (req, res) => {
    try {
        const chests = await Chest.find()
            .sort({ createdAt: -1 });

        if (!chests || chests.length === 0) {
            return res.status(404).json({ message: "not-found", data: "No chests found." });
        }

        const formatted = chests.map(chest => ({
            id: chest._id,
            name: chest.name,
            amount: chest.amount,
            currency: chest.currency,
            rewards: chest.rewards.map(r => ({
                rewardType: r.rewardtype,
                amount: r.amount,
                reward: r.reward,
                probability: r.probability
            })),
            createdAt: chest.createdAt.toISOString().split('T')[0]
        }));

        return res.status(200).json({ message: "success", data: formatted });
    } catch (error) {
        console.error("Error fetching chests:", error);
        return res.status(500).json({ message: "server-error", data: "An error occurred while fetching chests." });
    }
}

// Edit chest rewards for a specific chest
exports.editchestrewards = async (req, res) => {
    const { chestid, rewards } = req.body;

    if (!chestid || !rewards || !Array.isArray(rewards)) {
        return res.status(400).json({ message: "bad-request", data: "Invalid input data." });
    }

    if (rewards.length > 10) {
        return res.status(400).json({ message: "bad-request", data: "You can only add up to 10 rewards per chest." });
    }

    try {
        const updated = await Chest.findOneAndUpdate(
            { _id: chestid },
            { rewards: rewards },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "not-found", data: "Chest not found." });
        }

        return res.status(200).json({ message: "success", data: updated });
    } catch (error) {
        console.error("Error updating chest rewards:", error);
        return res.status(500).json({ message: "server-error", data: "An error occurred while updating chest rewards." });
    }
}

// Edit chest metadata (amount and currency) and propagate changes to Item and Market.items
exports.editchest = async (req, res) => {
    const { chestid, amount, currency } = req.body;

    if (!chestid || amount == null || !currency) {
        return res.status(400).json({ message: "bad-request", data: "chestid, amount and currency are required." });
    }

    const session = await mongoose.startSession();
    try {
        await session.startTransaction();

        // Update chest
        const chest = await Chest.findById(chestid).session(session);
        if (!chest) {
            await session.abortTransaction();
            return res.status(404).json({ message: "not-found", data: "Chest not found." });
        }

        chest.amount = amount;
        chest.currency = currency;
        await chest.save({ session });

        // Update Item (assuming chest _id maps to an Item with same _id)
        const item = await Item.findById(chestid).session(session);
        if (!item) {
            await session.abortTransaction();
            return res.status(404).json({ message: "not-found", data: "Associated item not found." });
        }

        item.price = amount;
        item.currency = currency;
        await item.save({ session });

        // Update any Market documents that reference this item in their items array
        const markets = await Market.find({ 'items._id': chestid }).session(session);
        for (const market of markets) {
            const idx = market.items.findIndex(i => i._id.toString() === chestid.toString());
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

        return res.status(200).json({ message: "success", data: chest });
    } catch (error) {
        await session.abortTransaction();
        console.error("Error updating chest metadata:", error);
        return res.status(500).json({ message: "server-error", data: "An error occurred while updating chest metadata." });
    } finally {
        session.endSession();
    }
}


