const { default: mongoose } = require("mongoose");
const { BattlepassSeason, BattlepassHistory, BattlepassProgress } = require("../models/Battlepass");
const { checkcharacter } = require("../utils/character");
const { Market, Item } = require("../models/Market");


exports.getbattlepass = async (req, res) => {
    const { id } = req.user;
    const { page, limit } = req.query;

    const pageOptions = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
    }

    const battlepassdata = await BattlepassSeason.find({})
        .populate('grandreward', 'type name rarity description')
        .skip((pageOptions.page - 1) * pageOptions.limit)
        .limit(pageOptions.limit)
        .sort({ createdAt: -1 })
        .then(data => data)
        .catch(err => {
            console.error(`Error fetching battlepass data: ${err}`);
            return res.status(500).json({ message: "error", data: "There was an error fetching battlepass data. Please try again later." });
        });


    const totalCount = await BattlepassSeason.countDocuments({})
        .catch(err => {
            console.error(`Error counting battlepass documents: ${err}`);
            return res.status(500).json({ message: "error", data: "There was an error counting battlepass documents. Please try again later." });
        });
    if (!battlepassdata || battlepassdata.length === 0) {
        return res.status(404).json({ message: "not-found", data: "No battlepass data found." });
    }

    const totalPages = Math.ceil(totalCount / pageOptions.limit);


    //get grandreward items

    const grandrewarditems = await Item.find({ currency: { $ne: "coins"}})

    const finaldata1 = grandrewarditems.map(i => ({
            id: i._id,
            name: i.name,
            type: i.type,
            rarity: i.rarity,
            description: i.description,
            imageUrl: i.imageUrl,
            isEquippable: i.isEquippable,
            isOpenable: i.isOpenable,
            crystals: i.crystals,
            coins: i.coins,
            stats: i.stats,
        }))

    const finalData = battlepassdata.map(bp => ({
        id: bp._id,
        title: bp.title,
        season: bp.season,
        startDate: bp.startDate,
        endDate: bp.endDate,
        status: bp.status,
        tierCount: bp.tierCount,
        premiumCost: bp.premiumCost,
        freeMissions: bp.freeMissions,
        premiumMissions: bp.premiumMissions,
        tiers: bp.tiers,
        // grandreward: {
        //     _id: bp.grandreward?._id || "No Grand Reward",
        //     name: bp.grandreward?.name || "No Grand Reward",
        //     type: bp.grandreward?.type || "none",
        //     rarity: bp.grandreward?.rarity || "none",
        //     description: bp.grandreward?.description || "No description available"
        // },
        grandreward: bp.grandreward.map(gr => ({
            _id: gr._id || "No Grand Reward",
            name: gr.name || "No Grand Reward",
            type: gr.type || "none",
            rarity: gr.rarity || "none",
            description: gr.description || "No description available"
        })) || [],
        createdAt: bp.createdAt,
        updatedAt: bp.updatedAt
    }));

    return res.status(200).json({
        message: "success",
        data: finalData,
        grandrewarditems: finaldata1,
        totalPages: totalPages,
        currentPage: pageOptions.page,
        totalCount: totalCount
    });


}

exports.editbattlepassrewards = async (req, res) => {
    const { id } = req.user;
    const { tierid, bpid, tier } = req.body

    // tier = {
    //     "tierNumber": 1,
    //     "freeReward": {
    //         "type": "coins",
    //         "amount": 500
    //     },
    //     "premiumReward": {
    //         "type": "coins",
    //         "amount": 1000
    //     },
    //     "xpRequired": 1000,
    //     "_id": "6828695a86cc0f2042749688"
    // },

    if (!tierid || !bpid || !tier) {
        return res.status(400).json({ message: "failed", data: "Please provide all required fields." });
    }

    const battlepass = await BattlepassSeason.findById(bpid)
        .catch(err => {
            console.error(`Error fetching battlepass: ${err}`);
            return res.status(500).json({ message: "error", data: "There was an error fetching the battlepass. Please try again later." });
        });
    if (!battlepass) {
        return res.status(404).json({ message: "not-found", data: "Battlepass not found." });
    }

    const tierIndex = battlepass.tiers.findIndex(t => t._id.toString() === tierid);
    if (tierIndex === -1) {
        return res.status(404).json({ message: "not-found", data: "Tier not found." });
    }

    // overwrite the tier data
    battlepass.tiers[tierIndex] = {
        tierNumber: tier.tierNumber,
        freeReward: tier.freeReward,
        premiumReward: tier.premiumReward,
        xpRequired: tier.xpRequired,
        _id: tierid
    };

    await battlepass.save()
        .then(data => data)
        .catch(err => {
            console.error(`Error saving battlepass: ${err}`);
            return res.status(500).json({ message: "error", data: "There was an error updating the battlepass. Please try again later." });
        });


    return res.status(200).json({
        message: "success",
    });
}

exports.editbattlepassdetails = async (req, res) => {
    const { id } = req.user;
    const { bpid, season, title, startDate, endDate, status, tierCount, premiumCost, grandreward } = req.body;

    const updateData = {};
    if (season) updateData.season = season;
    if (title) updateData.title = title;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (status) updateData.status = status;
    if (tierCount) updateData.tierCount = tierCount;
    if (premiumCost) updateData.premiumCost = premiumCost;
    if (grandreward) {
        if (!Array.isArray(grandreward) || grandreward.length === 0) {
            return res.status(400).json({ message: "failed", data: "Grand reward must be a non-empty array." });
        }
        // Validate each grandreward item
        for (const item of grandreward) {
            if (!item._id || !mongoose.Types.ObjectId.isValid(item._id)) {
                return res.status(400).json({ message: "failed", data: "Each grand reward item must have a valid _id." });
            }
        }
        updateData.grandreward = grandreward;
    } 
    if (!bpid || Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "failed", data: "Please provide all required fields." });
    }

    const battlepass = await BattlepassSeason.findById(bpid)
        .catch(err => {
            console.error(`Error fetching battlepass: ${err}`);
            return res.status(500).json({ message: "error", data: "There was an error fetching the battlepass. Please try again later." });
        });
    if (!battlepass) {
        return res.status(404).json({ message: "not-found", data: "Battlepass not found." });
    }

    // validate tiercount with the number of tiers inside battlepass.tiers

    if (updateData.tierCount && updateData.tierCount !== battlepass.tiers.length) {
        return res.status(400).json({ message: "failed", data: "Tier count does not match the number of tiers in the battlepass." });
    }

    // Update the battlepass with the provided data
    Object.assign(battlepass, updateData);
    await battlepass.save()
        .then(data => data)
        .catch(err => {
            console.error(`Error saving battlepass: ${err}`);
            return res.status(500).json({ message: "error", data: "There was an error updating the battlepass. Please try again later." });
        });

    return res.status(200).json({
        message: "success",
    });
}

exports.editbattlepassmissions = async (req, res) => {

    const { id } = req.user;
    const { bpid, freeMissions, premiumMissions } = req.body;

    if (!bpid) {
        return res.status(400).json({ message: "failed", data: "Please provide all required fields." });
    }

    const updateData = {};
    if (freeMissions) updateData.freeMissions = freeMissions;
    if (premiumMissions) updateData.premiumMissions = premiumMissions;
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "failed", data: "Please provide at least one field to update." });
    }

    const battlepass = await BattlepassSeason.findById(bpid)
        .catch(err => {
            console.error(`Error fetching battlepass: ${err}`);
            return res.status(500).json({ message: "error", data: "There was an error fetching the battlepass. Please try again later." });
        });
    if (!battlepass) {
        return res.status(404).json({ message: "not-found", data: "Battlepass not found." });
    }

    // Update the missions
    battlepass.freeMissions = updateData.freeMissions || battlepass.freeMissions;
    battlepass.premiumMissions = updateData.premiumMissions || battlepass.premiumMissions;

    await battlepass.save()
        .then(data => data)
        .catch(err => {
            console.error(`Error saving battlepass: ${err}`);
            return res.status(500).json({ message: "error", data: "There was an error updating the battlepass. Please try again later." });
        });

    return res.status(200).json({
        message: "success",
    });
}

exports.getbattlepassclaimhistory = async (req, res) => {
    const { id } = req.params; // Get owner ID from URL params
    const { page, limit } = req.query;

    const pageOptions = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
    }

    if (id && !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "failed", data: "Please provide a valid owner ID." });
    }

    // Change season filter to owner filter
    const data = await BattlepassHistory.find({ owner: id })
        .skip((pageOptions.page - 1) * pageOptions.limit)
        .limit(pageOptions.limit)
        .sort({ createdAt: -1 })
        .populate('owner', 'username level')
        .populate('season', 'title')
        .then(data => data)
        .catch(err => {
            console.error(`Error fetching battlepass claim history: ${err}`);
            return res.status(500).json({ message: "error", data: "There was an error fetching the battlepass claim history. Please try again later." });
        });

    if (!data || data.length === 0) {
        return res.status(404).json({ message: "not-found", data: "No battlepass claim history found." });
    }

    const totalCount = await BattlepassHistory.countDocuments({ owner: id })
        .catch(err => {
            console.error(`Error counting battlepass claim history documents: ${err}`);
            return res.status(500).json({ message: "error", data: "There was an error counting the battlepass claim history documents. Please try again later." });
        });

    const totalPages = Math.ceil(totalCount / pageOptions.limit);

    const finalData = data.map(bp => ({
        id: bp._id,
        owner: {
            id: bp.owner._id,
            username: bp.owner.username,
            level: bp.owner.level
        },
        season: {
            id: bp.season._id,
            title: bp.season.title
        },
        tier: bp.tier,
        claimedrewards: {
            type: bp.claimedrewards.type,
            item: bp.claimedrewards.item,
            amount: bp.claimedrewards.amount
        },
        createdAt: bp.createdAt
    }));

    return res.status(200).json({
        message: "success",
        data: finalData,
        totalPages: totalPages,
        currentPage: pageOptions.page,
        totalCount: totalCount
    });
}

exports.getcharacterbattlepassclaimhistory = async (req, res) => {
    
    const { id } = req.user;
    const { page, limit, characterid } = req.query;

    const pageOptions = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
    }


    const checker = await checkcharacter(id, characterid);

    if (checker === "failed") {
        return res.status(400).json({
            message: "Unauthorized",
            data: "You are not authorized to view this page. Please login the right account to view the page."
        });
    }


    const data = await BattlepassHistory.find({ owner: characterid})
        .skip((pageOptions.page - 1) * pageOptions.limit)
        .limit(pageOptions.limit)
        .sort({ createdAt: -1 })
        .populate('owner', 'username level')
        .populate('season', 'seasonName')
        .then(data => data)
        .catch(err => {
            console.error(`Error fetching battlepass claim history: ${err}`);
            return res.status(500).json({ message: "error", data: "There was an error fetching the battlepass claim history. Please try again later." });
        });

    if (!data || data.length === 0) {
        return res.status(404).json({ message: "not-found", data: "No battlepass claim history found." });
    }

    const totalCount = await BattlepassHistory.countDocuments({ owner: characterid })
        .catch(err => {
            console.error(`Error counting battlepass claim history documents: ${err}`);
            return res.status(500).json({ message: "error", data: "There was an error counting the battlepass claim history documents. Please try again later." });
        });

    const totalPages = Math.ceil(totalCount / pageOptions.limit);

    const finalData = data.map(bp => ({
        id: bp._id,
        owner: {
            id: bp.owner._id,
            username: bp.owner.username,
            level: bp.owner.level
        },
        season: {
            id: bp.season._id,
            seasonName: bp.season.seasonName
        },
        tier: bp.tier,
        claimedrewards: {
            type: bp.claimedrewards.type,
            item: bp.claimedrewards.item,
            amount: bp.claimedrewards.amount
        },
        createdAt: bp.createdAt
    }));

    return res.status(200).json({
        message: "success",
        data: finalData,
        totalPages: totalPages,
        currentPage: pageOptions.page,
        totalCount: totalCount
    });
}

exports.checkuserbattlepass = async (req, res) => {
    const { id } = req.user;
    const { characterid } = req.query;

    if (!characterid || !mongoose.Types.ObjectId.isValid(characterid)) {
        return res.status(400).json({ message: "failed", data: "Please provide a valid character ID." });
    }

    const checker = await checkcharacter(id, characterid);

    if (checker === "failed") {
        return res.status(400).json({
            message: "Unauthorized",
            data: "You are not authorized to view this page. Please login the right account to view the page."
        });
    }

    const battlepass = await BattlepassProgress.findOne({ owner: characterid })
        .catch(err => {
            console.error(`Error fetching battlepass progress: ${err}`);
            return res.status(500).json({ message: "error", data: "There was an error fetching the battlepass progress. Please try again later." });
        });

    if (!battlepass) {
        return res.status(404).json({ message: "not-found", data: "Battlepass progress not found for this character." });
    }

    return res.status(200).json({
        message: "success",
        data: {
            hasPremium: battlepass.hasPremium
        }
    });
}


exports.checkuserbattlepasssa = async (req, res) => {
    const { id } = req.user;
    const { characterid } = req.query;

    if (!characterid || !mongoose.Types.ObjectId.isValid(characterid)) {
        return res.status(400).json({ message: "failed", data: "Please provide a valid character ID." });
    }

    const battlepass = await BattlepassProgress.findOne({ owner: characterid })
        .catch(err => {
            console.error(`Error fetching battlepass progress: ${err}`);
            return res.status(500).json({ message: "error", data: "There was an error fetching the battlepass progress. Please try again later." });
        });

    if (!battlepass) {
        return res.status(404).json({ message: "not-found", data: "Battlepass progress not found for this character." });
    }

    return res.status(200).json({
        message: "success",
        data: {
            hasPremium: battlepass.hasPremium
        }
    });
}