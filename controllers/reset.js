const { default: mongoose } = require("mongoose");
const { BattlepassSeason, BattlepassMissionProgress } = require("../models/Battlepass");
const ResetHistory = require("../models/Resethistory");
const { QuestDetails, QuestProgress } = require("../models/Quest");
const { CharacterDailySpin } = require("../models/Rewards");
const Reset = require("../models/Reset");



exports.getbattlepassquests = async (req, res) => {

    const battlpassquest = await BattlepassSeason.findOne({ status: "active" })
    if (!battlpassquest) {
        return res.status(404).json({ message: "No active battlepass season found" });
    }
    const freeMissions = battlpassquest.freeMissions;
    const premiumMissions = battlpassquest.premiumMissions;

    const allMissions = [...freeMissions, ...premiumMissions];
    if (!allMissions || allMissions.length === 0) {
        return res.status(404).json({ message: "No missions found in the active battlepass season" });
    }
    const formattedMissions = allMissions.map(mission => ({
        id: mission._id,
        missionName: mission.missionName,
        type: mission.type,
        description: mission.description,
        progress: mission.progress,
        isCompleted: mission.isCompleted,
        isLocked: mission.isLocked,
    }));

    res.status(200).json({
        message: "success",
        data: formattedMissions,
    });
}

exports.resetpassquest = async (req, res) => {
    const { id } = req.user;
    const { questid } = req.body;

    if (!questid) {
        return res.status(400).json({ message: "questid is required" });
    }

    // find the quest on battlepassseason
    const battlepassSeason = await BattlepassSeason.findOne({ status: "active" });

    if (!battlepassSeason) {
        return res.status(404).json({ message: "No active battlepass season found" });
    }

    // check if the questid exists in the battlepassseason
    const questExists = battlepassSeason.freeMissions.some(mission => mission._id.toString() === questid) ||
        battlepassSeason.premiumMissions.some(mission => mission._id.toString() === questid);


    if (!questExists) {
        return res.status(404).json({ message: "Quest not found in the active battlepass season" });
    }

    await BattlepassMissionProgress.updateMany(
        { missionId: questid, },
        { $set: { progress: 0, isCompleted: false } }
    )
    .then(data => data)
    .catch(err => {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while resetting the quest" });
    });

    // Find the actual mission object to get the mission name
    const mission = battlepassSeason.freeMissions.find(mission => mission._id.toString() === questid) ||
        battlepassSeason.premiumMissions.find(mission => mission._id.toString() === questid);

    await ResetHistory.create({
        owner: id,
        type: "battlepass",
        action: `Reset quest ${mission.missionName || questid}`,
    })
    .then(data => data)
    .catch(err => {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while logging the reset action" });
    });

    res.status(200).json({
        message: "success",
    });
}

exports.resetallpassquests = async (req, res) => {
    const { id } = req.user;

    // find the battlepassseason
    const battlepassSeason = await BattlepassSeason.findOne({ status: "active" });

    if (!battlepassSeason) {
        return res.status(404).json({ message: "No active battlepass season found" });
    }

    // Reset all missions in the active battlepass season
    await BattlepassMissionProgress.updateMany(
        { season: battlepassSeason._id },
        { $set: { progress: 0, isCompleted: false } }
    )
    .then(data => data)
    .catch(err => {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while resetting the quests" });
    });

    await ResetHistory.create({
        owner: id,
        type: "battlepass",
        action: `Reset all pass quests in the active battlepass season`,
    })
    .then(data => data)
    .catch(err => {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while logging the reset action" });
    });

    res.status(200).json({
        message: "success",
    });
}

exports.getquests = async (req, res) => {

    const quest = await QuestDetails.find({})
        .sort({ createdAt: -1 })
    if (!quest || quest.length === 0) return res.status(404).json({ message: "No quests found" });
    const formattedQuests = quest.map(q => ({
        id: q._id,
        missionName: q.missionName,
        description: q.description,
        xpReward: q.xpReward,
        rewardtype: q.rewardtype,
        requirements: q.requirements,
        daily: q.daily,
    }));
    res.status(200).json({
        message: "success",
        data: formattedQuests,
    });
}

exports.resetquest = async (req, res) => {
    const { id } = req.user;
    const { questid } = req.body;

    if (!questid) {
        return res.status(400).json({ message: "questid is required" });
    }

   // check if the quest exists
    const questExists = await QuestDetails.findById(questid);
    if (!questExists) {
        return res.status(404).json({ message: "Quest not found" });
    }

    // Reset the quest progress
    await QuestProgress.updateMany(
        { quest: questid  },
        { $set: { progress: 0, isCompleted: false } }
    )
    .then(data => data)
    .catch(err => {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while resetting the quest" });
    });

    await ResetHistory.create({
        owner: id,
        type: "quest",
        action: `Reset quest ${questExists.missionName || questid}`,
    })
    .then(data => data)
    .catch(err => {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while logging the reset action" });
    });

    res.status(200).json({
        message: "success",
    });
}

exports.resetallquests = async (req, res) => {
    const { id } = req.user;
    // Reset all quests
    await QuestProgress.updateMany(
        {},
        { $set: { progress: 0, isCompleted: false } }
    )
    .then(data => data)
    .catch(err => {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while resetting the quests" });
    });

    await ResetHistory.create({
        owner: id,  
        type: "quest",
        action: `Reset all quests`,
    })
    .then(data => data)
    .catch(err => {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while logging the reset action" });
    });

    res.status(200).json({
        message: "success",
    });
}
exports.getresethistory = async (req, res) => {

    const { page, limit } = req.query;
    const pageOptions = {
        page: parseInt(page) || 0,
        limit: parseInt(limit) || 10,
    }

    const resethistory = await ResetHistory.find({})
        .sort({ createdAt: -1 })
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .populate("owner");

    const totalCount = await ResetHistory.countDocuments({});
    const totalPages = Math.ceil(totalCount / pageOptions.limit);

    const formattedResponse = []

    resethistory.forEach(history => {
        formattedResponse.push({
            id: history._id,
            owner: history.owner?.username || "Unknown",
            type: history.type,
            action: history.action,
            manualresetdate: history.manualresetdate,
            createdAt: history.createdAt,
        });
    });

    res.status(200).json({
        message: "success",
        data: formattedResponse,
        pagination: {
            totalCount,
            totalPages,
            currentPage: pageOptions.page + 1,
            limit: pageOptions.limit,
        }
    });
}

exports.resetalldailyspin = async (req, res) => {
    const { id } = req.user

    await CharacterDailySpin.updateMany(
        {},
        { $set: { spin: true }}
    )
    .then(data => data)
    .catch(err => {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while resetting the daily spins" });
    });

    await ResetHistory.create({
        owner: id,
        type: "dailyspin",
        action: `Reset all daily spins`,
    })
    .then(data => data)
    .catch(err => {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while logging the reset action" });
    });

    res.status(200).json({
        message: "success",
    });
}

exports.resetallexpspin = async (req, res) => {
    const { id } = req.user;

    await CharacterDailySpin.updateMany(
        {},
        { $set: { expspin: true }}
    )
    .then(data => data)
    .catch(err => {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while resetting the daily spins" });
    });

    await ResetHistory.create({
        owner: id,
        type: "expspin",
        action: `Reset all exp spins`,
    })
    .then(data => data)
    .catch(err => {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while logging the reset action" });
    });

    res.status(200).json({
        message: "success",
    });
}

exports.resetallweeklylogin = async (req, res) => {
    const { id } = req.user;

    await Reset.deleteMany(
        { type: "weeklylogin", action: "claim" }
    )
    await ResetHistory.create({
        owner: id,
        type: "weeklylogin",
        action: `Reset all weekly login`,
    })
    .then(data => data)
    .catch(err => {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while logging the reset action" });
    });

    res.status(200).json({
        message: "success",
    });
}

exports.resetallmonthlylogin = async (req, res) => {
    const { id } = req.user;

    await Reset.deleteMany(
        { type: "monthlylogin", action: "checkin" }
    )
    await ResetHistory.create({
        owner: id,
        type: "monthlylogin",
        action: `Reset all monthly login`,
    })
    .then(data => data)
    .catch(err => {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while logging the reset action" });
    });

    res.status(200).json({
        message: "success",
    });
}

exports.resetallfreebies = async (req, res) => {
    const { id } = req.user;

    await Reset.deleteMany(
        { type: { $regex: /^freebie/i }, action: "claim" }
    )
    .then(data => data)
    .catch(err => {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while resetting the freebies" });
    });

    await ResetHistory.create({
        owner: id,
        type: "freebies",
        action: `Reset all freebies`,
    })
    .then(data => data)
    .catch(err => {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while logging the reset action" });
    });

    res.status(200).json({
        message: "success",
    });
}