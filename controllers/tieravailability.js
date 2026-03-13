const TierAvailability = require("../models/TierAvailability");

const TIER_CONFIGS = {
    platinum: { min: 1, max: 9 },
    gold: { min: 10, max: 99 },
    silver: { min: 100, max: 899 }
};

/**
 * GET /tieravailability/status
 * Returns all tier docs (available count, taken count, id range).
 * Superadmin only.
 */
exports.getTierStatus = async (req, res) => {
    const docs = await TierAvailability.find({}).lean().catch(() => null);
    if (!docs) return res.status(500).json({ message: "failed", data: "Database error." });

    const result = docs.map(d => ({
        tier: d.tier,
        idRange: d.idRange,
        availableCount: d.available.length,
        takenCount: d.taken.length,
        smallest5Available: d.available.slice(0, 5)
    }));

    return res.status(200).json({ message: "success", data: result });
};

/**
 * POST /tieravailability/initialize
 * Seeds a tier's available pool from scratch (only if it doesn't exist yet).
 * Body: { tier: "platinum"|"gold"|"silver" }
 * Superadmin only.
 */
exports.initializeTier = async (req, res) => {
    const { tier } = req.body;

    const config = TIER_CONFIGS[tier];
    if (!config) {
        return res.status(400).json({ message: "failed", data: "Invalid tier. Must be platinum, gold, or silver." });
    }

    const existing = await TierAvailability.findOne({ tier }).lean();
    if (existing) {
        return res.status(409).json({ message: "failed", data: `Tier '${tier}' already initialized. Use /reset to reinitialize.` });
    }

    const available = [];
    for (let i = config.min; i <= config.max; i++) available.push(i);

    await TierAvailability.create({
        tier,
        idRange: { min: config.min, max: config.max },
        available,
        taken: []
    }).catch(err => {
        console.error(`[TierAvailability] Failed to initialize tier ${tier}:`, err);
        return res.status(500).json({ message: "failed", data: "Database error during initialization." });
    });

    return res.status(200).json({
        message: "success",
        data: { tier, idRange: config, totalSeeded: available.length }
    });
};

/**
 * POST /tieravailability/reset
 * Resets a tier back to a fully available pool (clears taken, rebuilds available).
 * Dangerous — use with care.
 * Body: { tier: "platinum"|"gold"|"silver" }
 * Superadmin only.
 */
exports.resetTier = async (req, res) => {
    const { tier } = req.body;

    const config = TIER_CONFIGS[tier];
    if (!config) {
        return res.status(400).json({ message: "failed", data: "Invalid tier." });
    }

    const available = [];
    for (let i = config.min; i <= config.max; i++) available.push(i);

    await TierAvailability.findOneAndUpdate(
        { tier },
        { $set: { available, taken: [], idRange: { min: config.min, max: config.max } } },
        { upsert: true }
    ).catch(err => {
        console.error(`[TierAvailability] Failed to reset tier ${tier}:`, err);
        return res.status(500).json({ message: "failed", data: "Database error during reset." });
    });

    return res.status(200).json({
        message: "success",
        data: { tier, idRange: config, totalSeeded: available.length }
    });
};
