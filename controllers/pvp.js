const { default: mongoose } = require("mongoose")
const Pvp = require("../models/Pvp")
const Season = require("../models/Season")
const Rankings = require("../models/Ranking")
const PvpStats = require("../models/PvpStats")
const Characterdata = require("../models/Characterdata")
const { RemainingTime, getSeasonRemainingTimeInMilliseconds } = require("../utils/datetimetools")

exports.getpvphistory = async (req, res) => {
    try {
        const { id } = req.user;
        const { page, limit, characterid, datefilter } = req.query;

        const pageOptions = {
            page: parseInt(page) || 0,
            limit: parseInt(limit) || 10,
        };

        let query = { owner: characterid };

        if (datefilter) {
            const startOfDay = new Date(datefilter);
            startOfDay.setUTCHours(0, 0, 0, 0);

            const endOfDay = new Date(datefilter);
            endOfDay.setUTCHours(23, 59, 59, 999);

            query.createdAt = {
                $gte: startOfDay,
                $lte: endOfDay
            };
        }

        const pvpData = await Pvp.find(query)
            .populate({ 
                path: "opponent", 
                select: "username"
            })
            .sort({ createdAt: -1 })
            .skip(pageOptions.page * pageOptions.limit)
            .limit(pageOptions.limit);

        const totalList = await Pvp.countDocuments(query);

        const finalData = pvpData.map(data => ({
            _id: data._id,
            opponent: data.opponent ? data.opponent.username : "Unknown",
            status: data.status,
            owner: data.owner,
            createdAt: data.createdAt,
        }));

        return res.status(200).json({
            message: "success",
            data: finalData,
            totalPages: Math.ceil(totalList / pageOptions.limit)
        });

    } catch (err) {
        console.error(`Error fetching PvP history: ${err}`);
        return res.status(500).json({
            message: "server-error",
            data: "There's a problem with the server. Please try again later."
        });
    }
};

// exports.getpvphistorybyseason = async (req, res) => {
//     try {
//         const { page, limit, datefilter, seasonid } = req.query;

//         const pageOptions = {
//             page: parseInt(page) || 0,
//             limit: parseInt(limit) || 10,
//         };

//         let query = {};

//         if (seasonid) {
//             query.season = seasonid;
//         }

//         if (datefilter) {
//             const startOfDay = new Date(datefilter);
//             startOfDay.setUTCHours(0, 0, 0, 0);

//             const endOfDay = new Date(datefilter);
//             endOfDay.setUTCHours(23, 59, 59, 999);

//             query.createdAt = {
//                 $gte: startOfDay,
//                 $lte: endOfDay
//             };
//         }

//         const pvpData = await Pvp.find(query)
//             .populate({ 
//                 path: "opponent", 
//                 select: "username" 
//             })
//             .populate({ 
//                 path: "season", 
//                 select: "name"
//             })
//             .sort({ createdAt: -1 })
//             .skip(pageOptions.page * pageOptions.limit)
//             .limit(pageOptions.limit);

//         const totalList = await Pvp.countDocuments(query);

//         const finalData = pvpData.map(data => ({
//             _id: data._id,
//             opponent: data.opponent ? data.opponent.username : "Unknown",
//             season: data.season ? data.season.name : "Unknown",
//             status: data.status,
//             owner: data.owner,
//             createdAt: data.createdAt,
//         }));

//         return res.status(200).json({
//             message: "success",
//             data: finalData,
//             totalPages: Math.ceil(totalList / pageOptions.limit)
//         });

//     } catch (err) {
//         console.error(`Error fetching PvP history by season: ${err}`);
//         return res.status(500).json({
//             message: "server-error",
//             data: "There's a problem with the server. Please try again later."
//         });
//     }
// };

exports.getpvphistorybyseason = async (req, res) => {
    try {
        const { page, limit, datefilter, seasonid } = req.query;

        const pageOptions = {
            page: parseInt(page) || 0,
            limit: parseInt(limit) || 10,
        };

        let query = {};

        if (seasonid) {
            query.season = seasonid;
        }

        if (datefilter) {
            const startOfDay = new Date(datefilter);
            startOfDay.setUTCHours(0, 0, 0, 0);

            const endOfDay = new Date(datefilter);
            endOfDay.setUTCHours(23, 59, 59, 999);

            query.createdAt = { $gte: startOfDay, $lte: endOfDay };
        }

        const pvpData = await Pvp.find(query)
            .populate({ path: "opponent", model: "Characterdata", select: "username" })
            .populate({ path: "owner", model: "Characterdata", select: "username" })
            .populate({ path: "season", select: "name" })
            .sort({ createdAt: -1 })
            .skip(pageOptions.page * pageOptions.limit)
            .limit(pageOptions.limit);

        const finalData = pvpData.map(data => {
            const ownerName = data.owner ? data.owner.username : "Unknown";
            const opponentName = data.opponent ? data.opponent.username : "Unknown";
            let player1, player2, winner;

            if (data.status === 1) {
                player1 = ownerName;
                player2 = opponentName;
                winner = `${ownerName} won the match`;
            } else {
                player1 = opponentName;
                player2 = ownerName;
                winner = `${opponentName} won the match`;
            }

            return {
                _id: data._id,
                player1,
                player2,
                status: data.status,
                createdAt: data.createdAt,
                winner
            };
        });

        return res.status(200).json({
            message: "success",
            data: finalData,
            totalPages: Math.ceil(await Pvp.countDocuments(query) / pageOptions.limit),
        });

    } catch (err) {
        console.error(`Error fetching PvP history by season: ${err}`);
        return res.status(500).json({
            message: "server-error",
            data: "There's a problem with the server. Please try again later.",
        });
    }
};

exports.getcharacterpvpstats = async (req, res) => {
    try {
        const { id } = req.user; 
        const {characterid} = req.query

        const rankingData = await PvpStats.find({ owner: characterid })
            .populate("owner", "name") 
            .sort({ mmr: -1 })
            .lean();

        return res.status(200).json({
            message: "success",
            data: rankingData[0]
        });

    } catch (err) {
        console.error(`Error fetching ranking stats: ${err}`);
        return res.status(500).json({
            message: "server-error",
            data: "There's a problem with the server. Please try again later."
        });
    }
};

exports.pvpmatchresult = async (req, res) => {
    try {
        const { id } = req.user;
        const { opponent, status, characterid } = req.body;

        if (!opponent || status === undefined) {
            return res.status(400).json({ message: "failed", data: "Opponent character ID and match status are required." });
        }

        const activeSeason = await Season.findOne({ isActive: "active" });

        if (!activeSeason) {
            return res.status(400).json({ message: "failed", data: "No active season found." });
        }


        const newMatch = await Pvp.create({
            owner: characterid,
            opponent,
            status,
            season: activeSeason._id
        });

        let ranking = await PvpStats.findOne({ owner: characterid });

        if (!ranking) {
            ranking = await PvpStats.create({
                owner: characterid,
                mmr: 0,
                win: 0,
                lose: 0,
                totalMatches: 0,
                winRate: 0
            });
        }

        if (status === 1) {
            ranking.win += 1;
        } else {
            ranking.lose += 1;
        }

        ranking.totalMatches = ranking.win + ranking.lose;
        ranking.winRate = ranking.totalMatches > 0 ? (ranking.win / ranking.totalMatches) * 100 : 0;

        await ranking.save();

        return res.status(200).json({ message: "success", data: newMatch });

    } catch (err) {
        console.error(`Error creating PvP match: ${err}`);
        return res.status(500).json({ message: "server-error", data: "There's a problem with the server. Please try again later." });
    }
};

