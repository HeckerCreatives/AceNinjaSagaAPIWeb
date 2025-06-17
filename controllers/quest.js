const mongoose = require('mongoose');
const { QuestDetails } = require('../models/Quest');

exports.getdailyquest = async (req, res) => {

    const { page, limit, query } = req.query;
    const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
    };

    if (query) {
        options.query = { missionName: { $regex: query, $options: "i" } };
    }

    const Dailyquestdata = await QuestDetails.find(options.query)
        .sort({ createdAt: -1 })
        .skip((options.page - 1) * options.limit)
        .limit(options.limit)
        .then(data => data)
        .catch(err => {
            console.error(`Error fetching daily quests: ${err}`);
            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later." });
        });

    const totalCount = await QuestDetails.countDocuments(options.query)
    const totalPages = Math.ceil(totalCount / options.limit);


    
                        const now = new Date();
                    const phTime = new Date(now.getTime()); 
                    const midnight = new Date(phTime);
                    midnight.setDate(midnight.getDate() + 1);
                    midnight.setHours(0, 0, 0, 0);
                    
                    const timer = midnight - phTime;
                    const hours = Math.floor(timer / (1000 * 60 * 60));
                    const minutes = Math.floor((timer % (1000 * 60 * 60)) / (1000 * 60));

    const finaldata = Dailyquestdata.map(quest => {
        return {
            id: quest._id,
            missionName: quest.missionName,
            description: quest.description,
            requirements: quest.requirements,
            xpReward: quest.xpReward,
            rewardtype: quest.rewardtype || "none",
            rewards: quest.rewards,
            daily: quest.daily,
            createdAt: quest.createdAt,
            timer: timer || 0, // Timer in milliseconds until next reset
            minutes: minutes || 0, // Minutes until next reset
            hours: hours || 0, // Hours until next reset
        };
    })

    return res.status(200).json({
        message: "success",
        data: finaldata,
        totalpages: totalPages
    });
}

exports.editdailyquest = async (req, res) => {

    const { id, missionName, description, requirements, daily, xpReward, rewardtype } = req.body; 

    const updateData = {
    };

    if (missionName) updateData.missionName = missionName;
    if (description) updateData.description = description;
    if (requirements) updateData.requirements = requirements;
    if (xpReward !== undefined) updateData.xpReward = xpReward;
    if (daily !== undefined) updateData.daily = daily;
    if (rewardtype) updateData.rewardtype = rewardtype;
    if (!id) {
        return res.status(400).json({ message: "bad-request", data: "Quest ID is required." });
    }
    if (updateData.length === 0) {
        return res.status(400).json({ message: "bad-request", data: "No fields to update." });
    }
    try {
        const updatedQuest = await QuestDetails.findByIdAndUpdate(
            id,
            { $set: updateData },
        )
        if (!updatedQuest) {
            return res.status(404).json({ message: "not-found", data: "Quest not found." });
        }

        return res.status(200).json({ message: "success" });

    } catch (err) {
        console.error(`Error updating quest: ${err}`);
        return res.status(500).json({ message: "server-error", data: "There was a problem updating the quest. Please try again later." });
    }

}