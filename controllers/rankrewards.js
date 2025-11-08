const { RankReward } = require("../models/Ranking");

exports.getRankRewards = async (req, res) => {

    const { id } = req.user
    

    const rewards = await RankReward.find()
        .populate("rank", "name")
        .sort({ createdAt: -1 });
    
    if (!rewards || rewards.length === 0) {
        return res.status(200).json({ message: "success", data: [], pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0
        } });
    }

    const formattedRewards = rewards.map(reward => ({
        id: reward._id,
        rankid: reward.rank._id,
        rank: reward.rank.name,
        rewards: reward.rewards.map(r => ({
            rewardType: r.rewardtype,
            amount: r.amount,
            reward: r.reward
        })),
        createdAt: reward.createdAt.toISOString().split('T')[0]
    }));

    return res.status(200).json({ message: "success", data: formattedRewards });
}

exports.editrankrewards = async (req, res) => {
    const { id } = req.user;
    const { rankid, rewards } = req.body;

    if (!rankid || !rewards || !Array.isArray(rewards)) {
        return res.status(400).json({ message: "bad-request", data: "Invalid input data." });
    }

    if (rewards.length > 6) {
        return res.status(400).json({ message: "bad-request", data: "You can only add up to 6 rewards per rank." });
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

    try {
        const updatedReward = await RankReward.findOneAndUpdate(
            { rank: rankid },
            { rewards: rewards },
            { new: true }
        ).populate("rank", "name");

        if (!updatedReward) {
            return res.status(404).json({ message: "not-found", data: "Rank reward not found." });
        }

        return res.status(200).json({ message: "success", data: updatedReward });
    } catch (error) {
        console.error("Error updating rank rewards:", error);
        return res.status(500).json({ message: "server-error", data: "An error occurred while updating rank rewards." });
    }
}