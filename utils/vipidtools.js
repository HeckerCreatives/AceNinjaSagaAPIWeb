const { default: mongoose } = require("mongoose");
const Characterdata = require("../models/Characterdata");
const TierAvailability = require("../models/TierAvailability");
const Users = require("../models/Users");

const TIER_RANGES = {
    platinum: { min: 1, max: 9 },
    gold:     { min: 10, max: 99 },
    silver:   { min: 100, max: 899 }
};

const LOCK_TIMEOUT_MS = 30_000; // auto-expire stale locks after 30 seconds

/**
 * Get the tier range config for a given tier name.
 * @param {String} tier
 * @returns {{ min: Number, max: Number } | null}
 */
function getTierRange(tier) {
    return TIER_RANGES[tier] || null;
}

/**
 * Determine which tier an ID belongs to, or null if >= 1000.
 * @param {Number} customid
 * @returns {String|null}
 */
function getTierForId(customid) {
    if (customid >= 1 && customid <= 9) return "platinum";
    if (customid >= 10 && customid <= 99) return "gold";
    if (customid >= 100 && customid <= 899) return "silver";
    return null;
}

/**
 * Return the smallest N available IDs in a tier by reading the TierAvailability document.
 * @param {String} tier
 * @param {Number} count - how many IDs to return (default 5)
 * @returns {Promise<Number[]>}
 */
async function getSmallestAvailableInTier(tier, count = 5) {
    const doc = await TierAvailability.findOne({ tier }).lean();
    if (!doc || !doc.available || doc.available.length === 0) return [];
    return doc.available.slice(0, count);
}

/**
 * Atomically claim a specific ID from the tier's available pool.
 * Uses $pull to remove the chosen ID only if it is still available.
 * Returns the chosen ID if claimed, or null if it was already taken.
 * @param {String} tier
 * @param {Number} chosenId
 * @returns {Promise<Number|null>}
 */
async function claimSpecificIdInTier(tier, chosenId) {
    const preDoc = await TierAvailability.findOneAndUpdate(
        { tier, available: chosenId },
        { $pull: { available: chosenId } },
        { new: false }
    ).lean();
    return preDoc ? chosenId : null;
}

/**
 * Atomically pop the smallest available ID from the tier's TierAvailability document.
 * Uses $pop with value -1 to remove from the front of the array.
 * Returns the claimed ID or null if none are left.
 * @param {String} tier
 * @returns {Promise<Number|null>}
 */
async function claimSmallestInTier(tier) {
    // $pop: { available: -1 } removes the first element; returnDocument: 'before' returns pre-pop state
    const preDoc = await TierAvailability.findOneAndUpdate(
        { tier, available: { $ne: [] } },
        { $pop: { available: -1 } },
        { returnDocument: "before", new: false }
    ).lean();

    if (!preDoc || !preDoc.available || preDoc.available.length === 0) return null;
    return preDoc.available[0];
}

/**
 * Release an ID back to the front of the available array and remove it from taken.
 * @param {String} tier
 * @param {Number} id
 */
async function releaseIdToTier(tier, id) {
    await TierAvailability.updateOne(
        { tier },
        {
            $pull: { taken: id },
            $push: { available: { $each: [id], $position: 0 } }
        }
    );
}

/**
 * Assign a VIP tier ID to a character (Mongo-only, no Redis).
 *
 * Flow:
 *   1. Idempotency check via Users.vipHistory
 *   2. Validate character ownership
 *   3. Atomically pop smallest available ID from TierAvailability.available
 *   4. Update MongoDB inside a Mongoose session:
 *      - Characterdata.customid + vipTier
 *      - TierAvailability.taken (add new, remove old if VIP)
 *      - TierAvailability.available (add old ID back if it was VIP)
 *      - Users.vipHistory
 *   5. On DB failure → compensate by releasing the claimed ID back
 *
 */
async function assignVIPId(userId, characterId, tier, transactionId, externalSession = null) {
    const range = getTierRange(tier);
    if (!range) return { success: false, error: "Invalid tier." };

    // 1. Idempotency: check if this transactionId was already processed
    const user = await Users.findById(userId).lean();
    if (!user) return { success: false, error: "User not found." };

    const existing = (user.vipHistory || []).find(h => h.transactionId === transactionId);
    if (existing) {
        return {
            success: true,
            data: {
                characterId: existing.characterId,
                oldCustomId: existing.oldCustomId,
                newCustomId: existing.newCustomId,
                tier: existing.tier,
                idempotent: true
            }
        };
    }

    // 2. Atomically acquire per-character lock (prevents concurrent duplicate submissions)
    const lockedChar = await Characterdata.findOneAndUpdate(
        {
            _id: new mongoose.Types.ObjectId(characterId),
            owner: new mongoose.Types.ObjectId(userId),
            status: { $ne: "deleted" },
            $or: [
                { vipIdChangeLocked: { $ne: true } },
                { vipIdChangeLockAt: { $lt: new Date(Date.now() - LOCK_TIMEOUT_MS) } }
            ]
        },
        { $set: { vipIdChangeLocked: true, vipIdChangeLockAt: new Date() } },
        { new: true }
    ).lean();

    if (!lockedChar) {
        const check = await Characterdata.findOne({
            _id: new mongoose.Types.ObjectId(characterId),
            owner: new mongoose.Types.ObjectId(userId),
            status: { $ne: "deleted" }
        }).lean();
        if (!check) return { success: false, error: "Character not found or not owned by user." };
        return { success: false, error: "An ID assignment is already in progress. Please wait and try again." };
    }

    const oldCustomId = lockedChar.customid;

    // 3. Atomically claim the smallest available ID from Mongo
    const claimedId = await claimSmallestInTier(tier);
    if (claimedId === null) {
        await Characterdata.updateOne(
            { _id: new mongoose.Types.ObjectId(characterId) },
            { $set: { vipIdChangeLocked: false } }
        ).catch(() => {});
        return { success: false, error: `No available IDs in ${tier} tier.` };
    }

    // 4. Persist to MongoDB inside a session
    const useExternalSession = !!externalSession;
    const session = externalSession || await mongoose.startSession();

    try {
        if (!useExternalSession) session.startTransaction();

        // Update character's customid, vipTier, and release lock
        await Characterdata.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(characterId) },
            { $set: { customid: claimedId, vipTier: tier, vipIdChangeLocked: false } },
            { session }
        );

        // Add claimedId to taken in TierAvailability
        await TierAvailability.findOneAndUpdate(
            { tier },
            { $addToSet: { taken: claimedId } },
            { session }
        );

        // If old ID was in a VIP tier, release it back to available
        const oldTier = getTierForId(oldCustomId);
        if (oldTier) {
            await TierAvailability.findOneAndUpdate(
                { tier: oldTier },
                {
                    $pull: { taken: oldCustomId },
                    $push: { available: { $each: [oldCustomId], $position: 0 } }
                },
                { session }
            );
        }

        // Record in Users.vipHistory
        await Users.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(userId) },
            {
                $push: {
                    vipHistory: {
                        characterId: new mongoose.Types.ObjectId(characterId),
                        oldCustomId,
                        newCustomId: claimedId,
                        tier,
                        transactionId,
                        purchaseDate: new Date()
                    }
                }
            },
            { session }
        );

        if (!useExternalSession) await session.commitTransaction();

        return {
            success: true,
            data: {
                characterId,
                oldCustomId,
                newCustomId: claimedId,
                tier,
                idempotent: false
            }
        };
    } catch (err) {
        if (!useExternalSession) await session.abortTransaction();

        // Compensate: release the claimed ID back to available and unlock character
        await releaseIdToTier(tier, claimedId);
        await Characterdata.updateOne(
            { _id: new mongoose.Types.ObjectId(characterId) },
            { $set: { vipIdChangeLocked: false } }
        ).catch(() => {});

        console.error(`[VIP ID] Failed to assign ID ${claimedId} (${tier}) to character ${characterId}:`, err);
        return { success: false, error: "Database error during ID assignment. Please try again." };
    } finally {
        if (!useExternalSession) session.endSession();
    }
}

/**
 * Swap a VIP character's ID to the next smallest available in their tier.
 * Only callable by characters that already have a vipTier set.
 *
 * @param {String} userId
 * @param {String} characterId
 * @returns {Promise<{ success: Boolean, data?: Object, error?: String }>}
 */
async function changeVIPId(userId, characterId) {
    // Atomically acquire per-character lock and validate ownership + VIP status in one query
    const lockedChar = await Characterdata.findOneAndUpdate(
        {
            _id: new mongoose.Types.ObjectId(characterId),
            owner: new mongoose.Types.ObjectId(userId),
            vipTier: { $ne: null },
            status: { $ne: "deleted" },
            $or: [
                { vipIdChangeLocked: { $ne: true } },
                { vipIdChangeLockAt: { $lt: new Date(Date.now() - LOCK_TIMEOUT_MS) } }
            ]
        },
        { $set: { vipIdChangeLocked: true, vipIdChangeLockAt: new Date() } },
        { new: true }
    ).lean();

    if (!lockedChar) {
        // Distinguish between "wrong character" and "lock held" for a better error message
        const check = await Characterdata.findOne({
            _id: new mongoose.Types.ObjectId(characterId),
            owner: new mongoose.Types.ObjectId(userId),
            status: { $ne: "deleted" }
        }).lean();
        if (!check) return { success: false, error: "Character not found or not owned by user." };
        if (!check.vipTier) return { success: false, error: "Only VIP users can change their ID." };
        return { success: false, error: "An ID change is already in progress. Please wait and try again." };
    }

    const tier = lockedChar.vipTier;
    const oldCustomId = lockedChar.customid;

    // Atomically claim the smallest available ID from the pool
    const claimedId = await claimSmallestInTier(tier);
    if (claimedId === null) {
        await Characterdata.updateOne(
            { _id: new mongoose.Types.ObjectId(characterId) },
            { $set: { vipIdChangeLocked: false } }
        ).catch(() => {});
        return { success: false, error: `No available IDs in ${tier} tier.` };
    }

    // Persist everything inside a Mongoose session
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // Update character's customid and release lock atomically
        await Characterdata.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(characterId) },
            { $set: { customid: claimedId, vipIdChangeLocked: false } },
            { session }
        );

        // Add new ID to taken, remove old ID from taken, return old ID to available
        await TierAvailability.findOneAndUpdate(
            { tier },
            {
                $addToSet: { taken: claimedId },
                $pull: { taken: oldCustomId },
                $push: { available: { $each: [oldCustomId], $position: 0 } }
            },
            { session }
        );

        // Log the swap in vipHistory
        await Users.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(userId) },
            {
                $push: {
                    vipHistory: {
                        characterId: new mongoose.Types.ObjectId(characterId),
                        oldCustomId,
                        newCustomId: claimedId,
                        tier,
                        transactionId: `swap_${Date.now()}`,
                        purchaseDate: new Date()
                    }
                }
            },
            { session }
        );

        await session.commitTransaction();

        return {
            success: true,
            data: {
                characterId,
                oldCustomId,
                newCustomId: claimedId,
                tier
            }
        };
    } catch (err) {
        await session.abortTransaction();

        // Compensate: release the claimed ID back to the pool and unlock the character
        await releaseIdToTier(tier, claimedId);
        await Characterdata.updateOne(
            { _id: new mongoose.Types.ObjectId(characterId) },
            { $set: { vipIdChangeLocked: false } }
        ).catch(() => {});

        console.error(`[VIP ID] Failed to swap ID for character ${characterId}:`, err);
        return { success: false, error: "Database error during ID swap. Please try again." };
    } finally {
        session.endSession();
    }
}

module.exports = {
    TIER_RANGES,
    getTierRange,
    getTierForId,
    getSmallestAvailableInTier,
    claimSmallestInTier,
    claimSpecificIdInTier,
    releaseIdToTier,
    assignVIPId,
    changeVIPId
};
