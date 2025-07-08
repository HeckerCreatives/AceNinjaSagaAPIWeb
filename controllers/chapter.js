const { default: mongoose } = require("mongoose");
const { CharacterChapter, CharacterChapterHistory } = require("../models/Chapter");
const { checkcharacter } = require("../utils/character");
const Characterdata = require("../models/Characterdata");
const moment = require("moment");

// Player version - requires authentication and character ownership check
exports.challengechapterhistory = async (req, res) => {
    const { id } = req.user;
    const { characterid, page, limit, filter } = req.query;
    
    if (!characterid) {
        return res.status(400).json({ message: "failed", data: "Please input character ID." });
    }

    const checker = await checkcharacter(id, characterid);

    if (checker === "failed") {
        return res.status(400).json({
            message: "Unauthorized",
            data: "You are not authorized to view this page. Please login the right account to view the page."
        });
    }

    const pageOptions = {
        page: parseInt(page) || 0,
        limit: parseInt(limit) || 10,
    };

    try {
        let query = { owner: new mongoose.Types.ObjectId(characterid) };
        
        // Apply filter if provided
        if (filter) {
            if (filter === 'win') {
                query.status = "win";
            } else if (filter === 'lose') {
                query.status = "lose";
            }
        }

        const ctchallenge = await CharacterChapterHistory.find(query)
            .sort({ createdAt: -1 })
            .skip(pageOptions.page * pageOptions.limit)
            .limit(pageOptions.limit);
            
        const totalCount = await CharacterChapterHistory.countDocuments(query);
        const totalpages = Math.ceil(totalCount / pageOptions.limit);

        const data = ctchallenge.map(chapter => ({
            id: chapter._id,
            chapter: chapter.chapter, 
            challenge: chapter.challenge,
            status: chapter.status,
            createdAt: moment(chapter.createdAt).format("YYYY-MM-DD HH:mm:ss")
        }));

        return res.status(200).json({
            message: "success",
            data: data,
            totalCount: totalCount,
            totalPages: totalpages,
            currentPage: pageOptions.page + 1
        });

    } catch (err) {
        console.log(`There's a problem encountered while fetching character chapter history. Error: ${err}`);
        return res.status(400).json({ 
            message: "bad-request", 
            data: "There's a problem with the server. Please contact support for more details."
        });
    }
};

// Admin version - no character ownership check, includes character info
exports.challengechapterhistoryadmin = async (req, res) => {
    const { characterid, page, limit, filter } = req.query;
    
    if (!characterid) {
        return res.status(400).json({ message: "failed", data: "Please input character ID." });
    }

    const pageOptions = {
        page: parseInt(page) || 0,
        limit: parseInt(limit) || 10,
    };

    try {
        let query = { owner: new mongoose.Types.ObjectId(characterid) };
        
        // Apply filter if provided
        if (filter) {
            if (filter === 'win') {
                query.status = "win";
            } else if (filter === 'lose') {
                query.status = "lose";
            }
        }

        // Use aggregation to include character info
        const pipeline = [
            { $match: query },
            {
                $lookup: {
                    from: "characterdatas",
                    localField: "owner",
                    foreignField: "_id",
                    as: "character"
                }
            },
            { $unwind: "$character" },
            { $sort: { createdAt: -1 } },
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
            {
                $project: {
                    _id: 1,
                    chapter: 1,
                    challenge: 1,
                    status: 1,
                    createdAt: 1,
                    character: {
                        _id: "$character._id",
                        username: "$character.username"
                    }
                }
            }
        ];

        const ctchallenge = await CharacterChapterHistory.aggregate(pipeline);
        const totalCount = await CharacterChapterHistory.countDocuments(query);
        const totalpages = Math.ceil(totalCount / pageOptions.limit);

        const data = ctchallenge.map(chapter => ({
            id: chapter._id,
            chapter: chapter.chapter, 
            challenge: chapter.challenge,
            status: chapter.status,
            createdAt: moment(chapter.createdAt).format("YYYY-MM-DD HH:mm:ss"),
            character: {
                id: chapter.character._id,
                username: chapter.character.username
            }
        }));

        return res.status(200).json({
            message: "success",
            data: data,
            totalCount: totalCount,
            totalPages: totalpages,
            currentPage: pageOptions.page + 1
        });

    } catch (err) {
        console.log(`There's a problem encountered while fetching character chapter history for admin. Error: ${err}`);
        return res.status(400).json({ 
            message: "bad-request", 
            data: "There's a problem with the server. Please contact support for more details."
        });
    }
};

// Get all chapter challenge history for all characters (admin only)
exports.allchallengechapterhistory = async (req, res) => {
    const { page, limit, filter, search } = req.query;

    const pageOptions = {
        page: parseInt(page) || 0,
        limit: parseInt(limit) || 10,
    };

    try {
        let matchQuery = {};
        
        // Apply filter if provided
        if (filter) {
            if (filter === 'win') {
                matchQuery.status = "win";
            } else if (filter === 'lose') {
                matchQuery.status = "lose";
            }
        }

        const pipeline = [
            { $match: matchQuery },
            {
                $lookup: {
                    from: "characterdatas",
                    localField: "owner",
                    foreignField: "_id",
                    as: "character"
                }
            },
            { $unwind: "$character" },
            // Add search functionality
            ...(search ? [{
                $match: {
                    "character.username": { $regex: search, $options: "i" }
                }
            }] : []),
            { $sort: { createdAt: -1 } },
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
            {
                $project: {
                    _id: 1,
                    chapter: 1,
                    challenge: 1,
                    status: 1,
                    createdAt: 1,
                    character: {
                        _id: "$character._id",
                        username: "$character.username"
                    }
                }
            }
        ];

        const ctchallenge = await CharacterChapterHistory.aggregate(pipeline);
        
        // Count total for pagination
        const countPipeline = [
            { $match: matchQuery },
            {
                $lookup: {
                    from: "characterdatas",
                    localField: "owner",
                    foreignField: "_id",
                    as: "character"
                }
            },
            { $unwind: "$character" },
            ...(search ? [{
                $match: {
                    "character.username": { $regex: search, $options: "i" }
                }
            }] : []),
            { $count: "total" }
        ];

        const totalResult = await CharacterChapterHistory.aggregate(countPipeline);
        const totalCount = totalResult[0]?.total || 0;
        const totalpages = Math.ceil(totalCount / pageOptions.limit);

        const data = ctchallenge.map(chapter => ({
            id: chapter._id,
            chapter: chapter.chapter, 
            challenge: chapter.challenge,
            status: chapter.status,
            createdAt: moment(chapter.createdAt).format("YYYY-MM-DD HH:mm:ss"),
            character: {
                id: chapter.character._id,
                username: chapter.character.username
            }
        }));

        return res.status(200).json({
            message: "success",
            data: data,
            totalCount: totalCount,
            totalPages: totalpages,
            currentPage: pageOptions.page + 1
        });

    } catch (err) {
        console.log(`There's a problem encountered while fetching all character chapter history. Error: ${err}`);
        return res.status(400).json({ 
            message: "bad-request", 
            data: "There's a problem with the server. Please contact support for more details."
        });
    }
};
