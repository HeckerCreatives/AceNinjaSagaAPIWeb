const Packs = require('../models/Packs');
const mongoose = require('mongoose');
const { Item, Market } = require('../models/Market');
const Characterdata = require('../models/Characterdata');
const Characterwallet = require('../models/Characterwallet');
const Transaction = require('../models/Transaction');
const Users = require('../models/Users');
const TierAvailability = require('../models/TierAvailability');
const { claimSmallestInTier, releaseIdToTier } = require('../utils/vipidtools');
const { applyPackRewards, validatePackReward } = require('../utils/rewardtools');

const VIP_PACK_TIERS = {
    "platinum vip pack": "platinum",
    "gold vip pack": "gold",
    "silver vip pack": "silver"
};

const LOCK_TIMEOUT_MS = 30_000;

// Create a new pack
exports.createpack = async (req, res) => {
    const { name, amount, currency, description, rarity, rewards } = req.body;

    if (!name || amount == null || !currency) {
        return res.status(400).json({ message: "bad-request", data: "name, amount, and currency are required." });
    }

    // Validate rewards if provided using centralized validator
    if (rewards && Array.isArray(rewards)) {
        if (rewards.length > 10) {
            return res.status(400).json({ message: "bad-request", data: "You can only add up to 10 rewards per pack." });
        }

        // Validate each reward structure
        for (const reward of rewards) {
            if (!validatePackReward(reward)) {
                return res.status(400).json({ message: "bad-request", data: `Invalid reward structure for rewardtype '${reward && reward.rewardtype}'` });
            }
        }

        const totalProbability = rewards.reduce((sum, r) => sum + (Number(r.probability) || 0), 0);
        if (totalProbability > 100) {
            return res.status(400).json({ message: "bad-request", data: "The total probability of rewards cannot exceed 100." });
        }

        // Ensure no duplicate item IDs across id/fid/_id for item rewards
        const rewardIds = [];
        for (const r of rewards) {
            const obj = r.reward || {};
            if (obj.id) rewardIds.push(String(obj.id));
            if (obj._id) rewardIds.push(String(obj._id));
            if (obj.fid) rewardIds.push(String(obj.fid));
        }
        const uniqueRewardIds = new Set(rewardIds);
        if (uniqueRewardIds.size !== rewardIds.length) {
            return res.status(400).json({ message: "bad-request", data: "Duplicate reward IDs are not allowed." });
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
        const [packs, tierDocs] = await Promise.all([
            Packs.find().sort({ createdAt: -1 }),
            TierAvailability.find({}).lean()
        ]);

        if (!packs || packs.length === 0) {
            return res.status(200).json({ message: "success", data: [] });
        }

        // Build a map of tier → smallest 5 available IDs
        const tierAvailabilityMap = {};
        for (const doc of tierDocs) {
            tierAvailabilityMap[doc.tier] = {
                availableCount: doc.available.length,
                smallest5: doc.available.slice(0, 5)
            };
        }

        const formatted = packs.map(pack => {
            const vipTier = VIP_PACK_TIERS[(pack.name || "").toLowerCase().trim()];
            return {
                id: pack._id,
                name: pack.name,
                amount: pack.amount,
                currency: pack.currency,
                rewards: pack.rewards.map(r => ({
                    _id: r._id,
                    rewardType: r.rewardtype,
                    amount: r.amount,
                    reward: r.reward,
                    probability: r.probability
                })),
                createdAt: pack.createdAt.toISOString().split('T')[0],
                ...(vipTier ? {
                    vipTier,
                    availability: tierAvailabilityMap[vipTier] || { availableCount: 0, smallest5: [] }
                } : {})
            };
        });

        return res.status(200).json({ message: "success", data: formatted });
    } catch (error) {
        console.error("Error fetching packs:", error);
        return res.status(500).json({ message: "server-error", data: "An error occurred while fetching packs." });
    }
}

// Purchase a VIP pack using in-game currency, claim a specific (or the smallest) available ID
exports.purchasevippack = async (req, res) => {
    const { id, username } = req.user;
    const { characterid, packid, idempotencyKey } = req.body;

    if (!characterid || !packid) {
        return res.status(400).json({ message: "bad-request", data: "characterid and packid are required." });
    }

    // Generate idempotency key if not provided (backend auto-generates on first attempt)
    // Frontend can optionally send one for explicit retry control
    const txKey = (idempotencyKey && typeof idempotencyKey === "string" && idempotencyKey.trim().length > 0)
        ? idempotencyKey.trim()
        : new mongoose.Types.ObjectId().toString();

    // Idempotency check: if this key was already processed, return the original result
    const existingTx = await Transaction.findOne({ transactionid: txKey }).lean().catch(() => null);
    if (existingTx) {
        return res.status(200).json({
            message: "success",
            data: { idempotent: true, transactionid: txKey }
        });
    }

    // Find the pack
    const pack = await Packs.findById(packid).lean().catch(() => null);
    if (!pack) return res.status(404).json({ message: "not-found", data: "Pack not found." });

    // Confirm it's a VIP pack
    const tier = VIP_PACK_TIERS[(pack.name || "").toLowerCase().trim()];
    if (!tier) {
        return res.status(400).json({ message: "bad-request", data: "This pack is not a VIP pack." });
    }

    // Pre-check wallet balance (non-authoritative; definitive check happens inside the session)
    const wallet = await Characterwallet.findOne({ owner: characterid, type: pack.currency }).lean().catch(() => null);
    if (!wallet || wallet.amount < pack.amount) {
        return res.status(400).json({
            message: "bad-request",
            data: `Insufficient ${pack.currency}. Required: ${pack.amount}, Available: ${wallet ? wallet.amount : 0}.`
        });
    }

    // Look up user email for the Transaction record
    const userRecord = await Users.findById(id).lean().catch(() => null);

    // Atomically acquire per-character lock (prevents concurrent duplicate purchases for the same character)
    const lockedChar = await Characterdata.findOneAndUpdate(
        {
            _id: new mongoose.Types.ObjectId(characterid),
            owner: new mongoose.Types.ObjectId(id),
            status: { $ne: "deleted" },
            $or: [
                { vipIdChangeLocked: { $ne: true } },
                { vipIdChangeLockAt: { $lt: new Date(Date.now() - LOCK_TIMEOUT_MS) } }
            ]
        },
        { $set: { vipIdChangeLocked: true, vipIdChangeLockAt: new Date() } },
        { new: true }
    ).lean().catch(() => null);


    if (!lockedChar) {
        const check = await Characterdata.findOne({
            _id: new mongoose.Types.ObjectId(characterid),
            owner: new mongoose.Types.ObjectId(id),
            status: { $ne: "deleted" }
        }).lean();
        if (!check) return res.status(404).json({ message: "not-found", data: "Character not found or not owned by user." });
        return res.status(409).json({ message: "conflict", data: "A VIP ID operation is already in progress for this character. Please try again." });
    }

    // Prevent repurchase of the same VIP tier
    if (lockedChar.vipTier === tier) {
        await Characterdata.updateOne(
            { _id: new mongoose.Types.ObjectId(characterid) },
            { $set: { vipIdChangeLocked: false } }
        ).catch(() => {});
        return res.status(409).json({ message: "conflict", data: `You already own a ${tier} VIP pack. Cannot purchase the same tier again.` });
    }


    const claimedId = await claimSmallestInTier(tier);
    if (claimedId === null) {
        await Characterdata.updateOne(
            { _id: new mongoose.Types.ObjectId(characterid) },
            { $set: { vipIdChangeLocked: false } }
        ).catch(() => {});
        return res.status(410).json({ message: "sold-out", data: `All ${tier} VIP IDs have been claimed. No more are available.` });
    }

    const oldCustomId = lockedChar.customid;
    const existingVipTier = lockedChar.vipTier || null; // tier the character currently holds (may differ from new tier)

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // Deduct wallet (authoritative balance guard inside the session)
        const updatedWallet = await Characterwallet.findOneAndUpdate(
            { owner: characterid, type: pack.currency, amount: { $gte: pack.amount } },
            { $inc: { amount: -pack.amount } },
            { new: true, session }
        );
        if (!updatedWallet) {
            await session.abortTransaction();
            await releaseIdToTier(tier, claimedId);
            await Characterdata.updateOne(
                { _id: new mongoose.Types.ObjectId(characterid) },
                { $set: { vipIdChangeLocked: false } }
            ).catch(() => {});
            return res.status(400).json({ message: "bad-request", data: `Insufficient ${pack.currency} to complete the purchase.` });
        }

        // Update character: assign new ID, set vipTier, release lock
        await Characterdata.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(characterid) },
            { $set: { customid: claimedId, vipTier: tier, vipIdChangeLocked: false } },
            { session }
        );

        // Mark claimedId as taken in TierAvailability
        await TierAvailability.findOneAndUpdate(
            { tier },
            { $addToSet: { taken: claimedId } },
            { session }
        );

        // Release the old VIP ID back to its tier pool if the character previously had a VIP tier
        if (existingVipTier) {
            await TierAvailability.findOneAndUpdate(
                { tier: existingVipTier },
                {
                    $pull: { taken: oldCustomId },
                    $push: { available: { $each: [oldCustomId], $position: 0 } }
                },
                { session }
            );
        }

        // Record the transaction
        await Transaction.create([{
            owner: characterid,
            transactionid: txKey,
            amount: pack.amount,
            item: pack._id,
            name: pack.name,
            email: userRecord ? userRecord.email : "ingame@system",
            currency: pack.currency,
            status: "completed",
            items: [{ name: pack.name, quantity: 1, price: pack.amount }]
        }], { session });

        // Award pack rewards
        const rewardResults = await applyPackRewards(characterid, pack.rewards, 1, session);

        await session.commitTransaction();

        return res.status(200).json({
            message: "success",
            data: {
                transactionId: txKey,
                claimedId,
                oldCustomId,
                tier,
                rewards: rewardResults
            }
        });
    } catch (err) {
        await session.abortTransaction();
        await releaseIdToTier(tier, claimedId);
        await Characterdata.updateOne(
            { _id: new mongoose.Types.ObjectId(characterid) },
            { $set: { vipIdChangeLocked: false } }
        ).catch(() => {});

        // Duplicate key on transactionid means a concurrent request already committed — treat as idempotent
        if (err.code === 11000 && err.keyPattern?.transactionid) {
            return res.status(200).json({ message: "success", data: { idempotent: true, transactionid: txKey } });
        }

        console.error(`[VIP Pack] Purchase failed for user ${username}, character ${characterid}:`, err);
        return res.status(500).json({ message: "server-error", data: "Purchase failed. Please try again." });
    } finally {
        session.endSession();
    }
};

// Edit pack rewards for a specific pack
exports.editpackrewards = async (req, res) => {
    const { packid, rewards } = req.body;

    if (!packid || !rewards || !Array.isArray(rewards)) {
        return res.status(400).json({ message: "bad-request", data: "Invalid input data." });
    }

    if (rewards.length > 10) {
        return res.status(400).json({ message: "bad-request", data: "You can only add up to 10 rewards per pack." });
    }

    // Use centralized validator
    for (const reward of rewards) {
        if (!validatePackReward(reward)) {
            return res.status(400).json({ message: "bad-request", data: `Invalid reward structure for rewardtype '${reward && reward.rewardtype}'` });
        }
    }

    // Ensure total probability does not exceed 100
    const totalProbability = rewards.reduce((sum, r) => sum + (Number(r.probability) || 0), 0);
    if (totalProbability > 100) {
        return res.status(400).json({ message: "bad-request", data: "The total probability of rewards cannot exceed 100." });
    }

    // Ensure no duplicate item IDs across id/fid/_id for item rewards
    const rewardIds = [];
    for (const r of rewards) {
        const obj = r.reward || {};
        if (obj.id) rewardIds.push(String(obj.id));
        if (obj._id) rewardIds.push(String(obj._id));
        if (obj.fid) rewardIds.push(String(obj.fid));
    }
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

// Edit pack metadata (name, amount and currency) and propagate changes to Item and Market.items
exports.editpack = async (req, res) => {
    const { packid, name, amount, currency } = req.body;

    if (!packid) {
        return res.status(400).json({ message: "bad-request", data: "packid is required." });
    }

    // At least one field to update must be provided
    if (name === undefined && amount === undefined && currency === undefined) {
        return res.status(400).json({ message: "bad-request", data: "At least one field (name, amount, or currency) must be provided." });
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

        // Update pack fields if provided
        if (name !== undefined) pack.name = name;
        if (amount !== undefined) pack.amount = amount;
        if (currency !== undefined) pack.currency = currency;
        await pack.save({ session });

        // Update Item (assuming pack _id maps to an Item with same _id)
        const item = await Item.findById(packid).session(session);
        if (!item) {
            await session.abortTransaction();
            return res.status(404).json({ message: "not-found", data: "Associated item not found." });
        }

        if (name !== undefined) item.name = name;
        if (amount !== undefined) item.price = amount;
        if (currency !== undefined) item.currency = currency;
        await item.save({ session });

        // Update any Market documents that reference this item in their items array
        const markets = await Market.find({ 'items._id': packid }).session(session);
        for (const market of markets) {
            const idx = market.items.findIndex(i => i._id.toString() === packid.toString());
            if (idx !== -1) {
                if (name !== undefined) market.items[idx].name = name;
                if (amount !== undefined) market.items[idx].price = amount;
                if (currency !== undefined) market.items[idx].currency = currency;
                // in case the market stores crystals/coins fields too
                if (market.items[idx].crystals !== undefined) market.items[idx].crystals = item.crystals || 0;
                if (market.items[idx].coins !== undefined) market.items[idx].coins = item.coins || 0;
            }
            market.lastUpdated = new Date();
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
