const Characterdata = require("../models/Characterdata");
const Rankings = require("../models/Ranking");
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


    const lbvalue = await Rankings.findOne({ owner: characterid })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding lbvalue: ${err}`)
        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later." })
    })

    const leaderboards = await Rankings.countDocuments({ mmr: { $gt: lbvalue.mmr } })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding leaderboards: ${err}`)
        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later." })
    })


    const topleaderboard = await Rankings.find()
    .populate("owner" , "username")
    .sort({ mmr: -1 })
    .limit(parseInt(limit))
    .then(data => data)
    .catch(err => {
        console.log(`Error finding topleaderboard: ${err}`)
        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later." })
    })

    console.log(topleaderboard)

    const formattedResponse = {
        data: topleaderboard.reduce((acc, rank, index) => {
            acc[index + 1] = {
                rank: index + 1,
                username: rank?.owner?.username,
                mmr: rank.mmr,
                isCurrentPlayer: rank?.owner?._id.toString() === characterid
            };
            return acc;
        }, {}),
        playerRank: {
            rank: leaderboards + 1,
            username: lbvalue.owner.username,
            mmr: lbvalue.mmr
        }
    };

    return res.status(200).json({
        message: "success",
        data: formattedResponse.data,
        playerRank: formattedResponse.playerRank
    });


}

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
