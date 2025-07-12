const Characterdata = require("../models/Characterdata");
const { Rankings, RankingHistory } = require("../models/Ranking");
const Season = require("../models/Season");
const RankTier = require("../models/RankTier");



exports.addmmr = async (req, res) => {
    const { mmr, characterid } = req.body;

    if (!mmr || !characterid) {
        return res.status(400).json({ message: "bad-request", data: "Please provide the necessary data!" })
    }

    // increment mmr
    await Rankings.findOneAndUpdate(
        { owner: characterid },
        { $inc: { mmr } },
        { new: true }
    )
    .then(data => {
        return res.json({ message: "success" })
    })
    .catch(err => {
        console.log(`Error adding mmr: ${err}`)
        return res.status(400).json({ message: "bad-request", data: "There's a problem adding mmr!" })
    })

}

exports.getleaderboards = async (req, res) => {
    const { characterid } = req.query;
    const limit = parseInt(req.query.limit) || 100;

    try {
        // Get current player's ranking data with level check
        const lbvalue = await Rankings.findOne({ owner: characterid })
            .populate({
                path: "owner",
                select: "username level",
                match: { level: { $gte: 20 } } // Only level 20+
            });

        if (!lbvalue || !lbvalue.owner) {
            return res.status(400).json({ 
                message: "bad-request", 
                data: "Character not found or below level 20 requirement." 
            });
        }

        // Use aggregation pipeline for complex sorting and filtering
        const leaderboardPipeline = [
            {
                $lookup: {
                    from: "characterdatas",
                    localField: "owner",
                    foreignField: "_id",
                    as: "character"
                }
            },
            { $unwind: "$character" },
            {
                $match: {
                    "character.level": { $gte: 20 } // Only level 20+
                }
            },
            {
                $sort: {
                    mmr: -1,           // Primary: Highest MMR first
                    updatedAt: 1,      // Secondary: Longest staying (earliest updatedAt) first
                    "character.level": -1  // Tertiary: Highest level first
                }
            },
            { $limit: parseInt(limit) },
            {
                $project: {
                    _id: 1,
                    mmr: 1,
                    updatedAt: 1,
                    username: "$character.username",
                    level: "$character.level",
                    owner: "$character._id"
                }
            }
        ];

        const topleaderboard = await Rankings.aggregate(leaderboardPipeline);

        // Count players with higher MMR (level 20+ only)
        const playersAbove = await Rankings.aggregate([
            {
                $lookup: {
                    from: "characterdatas",
                    localField: "owner",
                    foreignField: "_id",
                    as: "character"
                }
            },
            { $unwind: "$character" },
            {
                $match: {
                    "character.level": { $gte: 20 },
                    $or: [
                        { mmr: { $gt: lbvalue.mmr } },
                        {
                            mmr: lbvalue.mmr,
                            updatedAt: { $lt: lbvalue.updatedAt }
                        },
                        {
                            mmr: lbvalue.mmr,
                            updatedAt: lbvalue.updatedAt,
                            "character.level": { $gt: lbvalue.owner.level }
                        }
                    ]
                }
            },
            { $count: "count" }
        ]);

        const playerRank = (playersAbove[0]?.count || 0) + 1;

        const formattedResponse = {
            data: topleaderboard.reduce((acc, rank, index) => {
                acc[index + 1] = {
                    rank: index + 1,
                    username: rank.username,
                    mmr: rank.mmr,
                    level: rank.level,
                    isCurrentPlayer: rank.owner.toString() === characterid
                };
                return acc;
            }, {}),
            playerRank: {
                rank: playerRank,
                username: lbvalue.owner.username,
                mmr: lbvalue.mmr,
                level: lbvalue.owner.level
            }
        };

        return res.status(200).json({
            message: "success",
            data: formattedResponse.data,
            playerRank: formattedResponse.playerRank
        });

    } catch (err) {
        console.log(`Error in getleaderboards: ${err}`);
        return res.status(400).json({ 
            message: "bad-request", 
            data: "There's a problem with the server. Please try again later." 
        });
    }
};

exports.getlevelleaderboards = async (req, res) => {

    const { characterid } = req.query;
    const limit = parseInt(req.query.limit) || 100;


    const lbvalue = await Characterdata.findOne({ owner: characterid })


    const leaderboards = await Characterdata.countDocuments({ level: { $gt: lbvalue.level } })

    const topleaderboard = await Characterdata.find()
    .populate("owner" , "username")
    .sort({ level: -1 })
    .limit(parseInt(limit))
    .then(data => data)
    .catch(err => {
        console.log(`Error finding top level leaderboard: ${err}`)
        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later." })

    })

    const formattedResponse = {

        data: topleaderboard.reduce((acc, rank, index) => {
            acc[index + 1] = {
                rank: index + 1,
                username: rank?.owner?.username,
                level: rank.level,
                isCurrentPlayer: rank?.owner?._id.toString() === characterid
            };
            return acc;
        }, {}),
        playerRank: {
            rank: leaderboards + 1,
            username: lbvalue.owner.username,
            level: lbvalue.level
        }
    };


    return res.status(200).json({ message: "success", data: formattedResponse.data, playerRank: formattedResponse.playerRank });

}

exports.resetleaderboards = async (req, res) => {
    await Rankings.updateMany({}, { mmr: 0 })
    .then(data => {
        return res.json({ message: "success" })
    })
    .catch(err => {
        console.log(`Error resetting leaderboards: ${err}`)
        return res.status(400).json({ message: "bad-request", data: "There's a problem resetting leaderboards!" })
    })
}

//leaderboard per season
exports.getpvpleaderboards = async (req, res) => {
    try {
        const { page, limit, seasonid, username } = req.query;

        const pageOptions = {
            page: parseInt(page) || 0, 
            limit: parseInt(limit) || 10
        };

        let selectedSeason = seasonid
            ? await Season.findById(seasonid)
            : await Season.findOne({ isActive: "active" });

        if (!selectedSeason) {
            return res.status(404).json({ message: "error", data: "Season not found." });
        }

        const matchStage = { season: selectedSeason._id };

        if (username) {
            matchStage["owner.username"] = { $regex: username, $options: "i" };
        }

        const leaderboardData = await Rankings.aggregate([
            { 
                $match: { season: selectedSeason._id }  // Filter by season
            },
            {
                $lookup: {
                    from: "characterdatas", // The actual collection name of Characterdata
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner"
                }
            },
            { $unwind: "$owner" },
            {
                $lookup: {
                    from: "ranktiers", // The actual collection name of RankTier
                    localField: "rank",
                    foreignField: "_id",
                    as: "rank"
                }
            },
            { $unwind: { path: "$rank", preserveNullAndEmptyArrays: true } }, // Preserve empty rank if no match
            {
                $match: username
                    ? { "owner.username": { $regex: username, $options: "i" } }
                    : {} // Apply username filter if provided
            },
            { $sort: { mmr: -1 } }, // Sort by highest MMR
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
            {
                $project: {
                    _id: 1,
                    username: "$owner.username",
                    mmr: 1,
                    rankname: "$rank.name",
                    icon: "$rank.icon"
                }
            }
        ]);

        const totalPlayers = await Rankings.countDocuments({ season: selectedSeason._id });
        const totalPages = Math.ceil(totalPlayers / pageOptions.limit);

        const formattedResponse = leaderboardData.map((player, index) => ({
            rank: pageOptions.page * pageOptions.limit + index + 1,
            username: player.username || "Unknown",
            mmr: player.mmr,
            rankname: player.rankName || "Unranked",
            icon: player.icon || "default-icon.png"
        }));

        return res.status(200).json({
            message: "success",
            data: formattedResponse,
            pagination: {
                currentPage: pageOptions.page,
                totalPages,
                totalPlayers
            },
            selectedSeason: {
                _id: selectedSeason._id,
                title: selectedSeason.title
            }
        });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return res.status(500).json({
            message: "error",
            data: "An error occurred while fetching the leaderboard."
        });
    }
};



// ...existing code...

exports.getleaderboardssuperadmin = async (req, res) => {
    const { page, limit, seasonid, minLevel } = req.query;
    
    const pageOptions = {
        page: parseInt(page) || 0,
        limit: parseInt(limit) || 100
    };
    
    const levelRequirement = parseInt(minLevel) || 20; // Default to level 20+

    try {
        // Get selected season or current active season
        let selectedSeason = seasonid
            ? await Season.findById(seasonid)
            : await Season.findOne({ isActive: "active" });

        if (!selectedSeason) {
            return res.status(404).json({ 
                message: "error", 
                data: "Season not found." 
            });
        }

        console.log(`Fetching leaderboard for season: ${selectedSeason.title} (ID: ${selectedSeason._id})`);
        // Use aggregation pipeline for complex sorting and filtering
        const leaderboardPipeline = [
            {
                $match: { season: selectedSeason._id }
            },
            {
                $lookup: {
                    from: "characterdatas",
                    localField: "owner",
                    foreignField: "_id",
                    as: "character"
                }
            },
            { $unwind: "$character" },
            {
                $match: {
                    "character.level": { $gte: levelRequirement } // Only specified level and above
                }
            },
            {
                $lookup: {
                    from: "ranktiers",
                    localField: "rank",
                    foreignField: "_id",
                    as: "rankInfo"
                }
            },
            { $unwind: { path: "$rankInfo", preserveNullAndEmptyArrays: true } },
            {
                $sort: {
                    mmr: -1,                    // Primary: Highest MMR first
                    updatedAt: 1,               // Secondary: Longest staying (earliest updatedAt) first
                }
            },
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
            {
                $project: {
                    _id: 1,
                    mmr: 1,
                    lastActive: "$updatedAt",
                    characterId: "$character._id",
                    username: "$character.username",
                    level: "$character.level",
                    rankName: "$rankInfo.name",
                }
            }
        ];

        const leaderboardData = await Rankings.aggregate(leaderboardPipeline);

        // Get total count for pagination
        const totalCountPipeline = [
            {
                $match: { season: selectedSeason._id }
            },
            {
                $lookup: {
                    from: "characterdatas",
                    localField: "owner",
                    foreignField: "_id",
                    as: "character"
                }
            },
            { $unwind: "$character" },
            {
                $match: {
                    "character.level": { $gte: levelRequirement }
                }
            },
            { $count: "total" }
        ];

        const totalCountResult = await Rankings.aggregate(totalCountPipeline);
        const totalPlayers = totalCountResult[0]?.total || 0;
        const totalPages = Math.ceil(totalPlayers / pageOptions.limit);

        const formattedResponse = leaderboardData.map((player, index) => ({
            rank: pageOptions.page * pageOptions.limit + index + 1,
            characterId: player.characterId,
            username: player.username,
            level: player.level,
            mmr: player.mmr,
            rankName: player.rankName || "Unranked",
            lastActive: player.lastActive
        }));

        return res.status(200).json({
            message: "success",
            data: formattedResponse,
            pagination: {
                currentPage: pageOptions.page,
                totalPages,
                totalPlayers,
                itemsPerPage: pageOptions.limit,
                hasNext: pageOptions.page < totalPages - 1,
                hasPrev: pageOptions.page > 0
            },
        });

    } catch (err) {
        console.error(`Error in getleaderboardssuperadmin: ${err}`);
        return res.status(500).json({ 
            message: "error", 
            data: "An error occurred while fetching the leaderboard data." 
        });
    }
};

// #region RANKING HISTORY

// select ranking history first 

exports.selectRankingHistory = async (req, res) => {

    const { id } = req.user

     const pipeline = [
        {
            $group: {
                _id: "$index",
                date: { $first: "$createdAt" },
            }
        },
        { $sort: { _id: 1 } } 
    ];

     const data = await RankingHistory.aggregate(pipeline)
        .then(data => data)
        .catch(err => {
            console.log(`Error fetching ranking history: ${err}`);
            return res.status(400).json({ message: "bad-request", data: "There's a problem fetching ranking history!" });
        });
    if (data.length === 0) {
        return res.status(404).json({ message: "not-found", data: "No ranking history found." });
    }

    const formattedData = data.map(item => ({
        name: `${item.date.toISOString().split('T')[0]} - #${item._id}`,
        index: item._id,
    }));

    return res.status(200).json({ message: "success", data: formattedData });
}

exports.getRankingHistory = async (req, res) => {
    const { index } = req.query;

    if (!index) {
        return res.status(400).json({ message: "bad-request", data: "Index is required." });
    }

    const data = await RankingHistory.find({ index })
        .populate("owner", "username level")
        .populate("rank", "name icon")
        .sort({ mmr: -1 })
        .then(data => data)
        .catch(err => {
            console.log(`Error fetching ranking history: ${err}`);
            return res.status(400).json({ message: "bad-request", data: "There's a problem fetching ranking history!" });
        });
    if (data.length === 0) {
        return res.status(404).json({ message: "not-found", data: "No ranking history found for this index." });
    }

    const formattedData = data.map((item, index) => ({
        id: item._id,
        username: item.owner.username,
        level: item.owner.level,
        mmr: item.mmr,
        rank: index + 1,
        rankName: item.rank ? item.rank.name : "Unranked",
        season: item.season ? item.season.title : "Unknown",
        createdAt: item.createdAt.toISOString().split('T')[0]
    }));

    return res.status(200).json({ message: "success", data: formattedData });
}