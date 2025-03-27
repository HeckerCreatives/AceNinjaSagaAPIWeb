const { default: mongoose } = require("mongoose")
const Payin = require("../models/Payin")
const Users = require("../models/Users")
const { addanalytics, deleteanalytics } = require("../utils/analyticstools")
const { createpayin } = require("../utils/payintools")
const Characterwallet = require("../models/Characterwallet")
const Characterdata = require("../models/Characterdata")
const { checkcharacter } = require("../utils/character")
//  #region USER

exports.getusertotalpayin = async(req, res)  => {

    const {id, username} = req.user
    const { characterid } = req.query

    // const checker = await checkcharacter(id, characterid);
    // if (checker === "failed") {
    //     return res.status(400).json({
    //         message: "Unauthorized",
    //         data: "You are not authorized to view this page."
    //     });
    // }


    const totalpayin = await Payin.aggregate(
        [
            {
                $match: {
                    status: "done",
                    owner: new mongoose.Types.ObjectId(characterid),
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$value" }
                }
            }
        ]
    )

    return res.json({message: "success", data: {
        totalpayin: totalpayin.length > 0 ? totalpayin[0].totalAmount : 0,
    }})
}

exports.getpayinhistoryplayer = async (req, res) => {
    try {
        const {id, username} = req.user;
        const {page = 0, limit = 10} = req.query;

        // Validate pagination parameters
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        
        if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 0 || limitNum <= 0) {
            return res.status(400).json({
                message: "failed",
                data: "Invalid pagination parameters"
            });
        }

        const [payinhistory, totalPages] = await Promise.all([
            Payin.find({owner: new mongoose.Types.ObjectId(id)})
                .populate({
                    path: "owner processby",
                    select: "username -_id"
                })
                .skip(pageNum * limitNum)
                .limit(limitNum)
                .sort({'createdAt': -1}),
            
            Payin.countDocuments({owner: new mongoose.Types.ObjectId(id)})
        ]);

        const pages = Math.ceil(totalPages / limitNum);
        const formattedHistory = payinhistory.map(({owner, processby, status, value, createdAt}) => ({
            owner: owner.username,
            processby: processby?.username || "",
            status,
            value,
            createdAt
        }));

        return res.json({
            message: "success", 
            data: {
                payinhistory: formattedHistory,
                totalPages: pages
            }
        });

    } catch (error) {
        console.error(`Error in getpayinhistoryplayer: ${error}`);
        return res.status(500).json({
            message: "failed",
            data: "Internal server error"
        });
    }
};

exports.requestpayin = async (req, res) => {
    const {id, username} = req.user
    const {payinvalue, characterid } = req.body

    await Payin.create({owner: new mongoose.Types.ObjectId(id), character: characterid, value: payinvalue, status: "processing"})
    .catch(err => {

        console.log(`Failed to create Payin data for ${username}, error: ${err}`)

        return res.status(401).json({ message: 'failed', data: `There's a problem with your account. Please contact customer support for more details` })
    })
    
    return res.json({message: "success"})
}
//  #endregion

//  #region SUPERADMIN

exports.sendtopupplayer = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        
        const {id, username} = req.user;
        const {playerusername, amount, type} = req.body;

        // Validate inputs
        if (!playerusername || !amount || !type) {
            return res.status(400).json({
                message: "failed",
                data: "Missing required fields"
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                message: "failed",
                data: "Amount must be positive"
            });
        }

        const player = await Characterdata.findOne({username: playerusername});
        if (!player) {
            return res.status(404).json({
                message: "failed",
                data: "Player not found"
            });
        }

        // Update wallet
        await Characterwallet.findOneAndUpdate(
            {owner: player._id, type},
            {$inc: {amount}},
            {session}
        );

        // Create payin record
        const addpayin = await createpayin(player._id, amount, id, "done", session);
        if (!addpayin || addpayin.message !== "success") {
            throw new Error("Failed to create payin record");
        }

        // Add analytics
        const analyticsResult = await addanalytics(
            player._id,
            addpayin.data._id,
            type,
            `Add balance to user ${player._id} with a value of ${amount} processed by ${username}`,
            amount,
            session
        );

        if (analyticsResult !== "success") {
            throw new Error("Failed to add analytics");
        }

        await session.commitTransaction();
        return res.json({message: "success"});

    } catch (error) {
        await session.abortTransaction();
        console.error(`Error in sendtopupplayer: ${error}`);
        return res.status(500).json({
            message: "failed",
            data: "An error occurred while processing the top-up"
        });
    } finally {
        session.endSession();
    }
}

// Improve deletepayinplayersuperadmin with transaction support
exports.deletepayinplayersuperadmin = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        
        const {id, username} = req.user;
        const {transactionid, characterid, type} = req.body;

        // Input validation
        if (!transactionid || !characterid || !type) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const transaction = await Payin.findOne({
            _id: new mongoose.Types.ObjectId(transactionid), 
            status: "done"
        }).session(session);

        if (!transaction) {
            throw new Error("Transaction not found or invalid status");
        }

        // Perform operations within transaction
        await Promise.all([
            Payin.findByIdAndUpdate(
                transactionid, 
                {status: "deleted"}, 
                {session}
            ),
            Characterwallet.findOneAndUpdate(
                {owner: characterid, type}, 
                {$inc: {amount: -transaction.value}},
                {session}
            ),
            deleteanalytics(transaction._id)
        ]);

        await session.commitTransaction();
        return res.json({
            success: true,
            message: "Transaction deleted successfully"
        });

    } catch (error) {
        await session.abortTransaction();
        console.error(`Delete payin error: ${error.message}`);
        return res.status(400).json({
            success: false,
            message: "Failed to delete transaction"
        });
    } finally {
        session.endSession();
    }
};

exports.getpayinhistorysuperadmin = async (req, res) => {
    try {
        const { id, username } = req.user;
        const { page, limit, searchUsername } = req.query;

        const pageOptions = {
            page: parseInt(page) || 0,
            limit: parseInt(limit) || 10
        };

        const payinpipelinelist = [
            {
                $match: {
                    status: { $in: ["done", "reject"] }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "ownerinfo"
                }
            },
            { $unwind: "$ownerinfo" },
            {
                $lookup: {
                    from: "characterdatas",
                    localField: "character",
                    foreignField: "_id",
                    as: "characterinfo"
                }
            },
            { $unwind: "$characterinfo" },
            {
                $lookup: {
                    from: "userdetails",
                    localField: "owner",
                    foreignField: "owner",
                    as: "userdetails"
                }
            },
            { $unwind: "$userdetails" }
        ];
        
        if (searchUsername) {
            payinpipelinelist.push({
                $match: {
                    $or: [
                        { "ownerinfo.username": { $regex: new RegExp(searchUsername, 'i') } },
                        { "characterinfo.username": { $regex: new RegExp(searchUsername, 'i') } }
                    ]
                }
            });
        }
        
        payinpipelinelist.push({ $sort: { createdAt: -1 } });
        
        payinpipelinelist.push({
            $facet: {
                totalPages: [{ $count: "count" }],
                data: [
                    {
                        $project: {
                            _id: 1,
                            status: 1,
                            value: 1,
                            type: 1,
                            username: "$ownerinfo.username",
                            userid: "$ownerinfo._id",
                            characterUsername: "$characterinfo.username",
                            characterId: "$characterinfo._id",
                            firstname: "$userdetails.firstname",
                            lastname: "$userdetails.lastname",
                            createdAt: 1
                        }
                    },
                    { $skip: pageOptions.page * pageOptions.limit },
                    { $limit: pageOptions.limit }
                ]
            }
        });

        const payinhistory = await Payin.aggregate(payinpipelinelist);
        if (!payinhistory || !payinhistory.length) {
            return res.status(404).json({
                success: false,
                message: "No payin history found"
            });
        }

        const totalPages = payinhistory[0].totalPages[0]?.count || 0;
        const pages = Math.ceil(totalPages / pageOptions.limit);
        const currentTime = new Date();

        const data = {
            payinhistory: payinhistory[0].data.map(valuedata => {
                const {
                    _id, status, value, type, username, 
                    characterUsername, characterId, userid,
                    firstname, lastname, createdAt
                } = valuedata;

                return {
                    id: _id,
                    username,
                    userid,
                    characterUsername,
                    characterId,
                    firstname,
                    lastname,
                    value,
                    status,
                    type,
                    createdAt,
                    canbedeleted: (currentTime - new Date(createdAt)) >= (1000 * 60 * 60 * 24)
                };
            }),
            totalPages: pages
        };

        return res.json({
            success: true,
            message: "success",
            data
        });

    } catch (error) {
        console.error(`Error in getpayinhistorysuperadmin: ${error}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.gettotalpayin = async(req, res)  => {
    const totalpayin = await Payin.aggregate(
        [
            {
                $match: {
                    status: "done"
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$value" }
                }
            }
        ]
    )

    return res.json({message: "success", data: {
        totalpayin: totalpayin.length > 0 ? totalpayin[0].totalAmount : 0,
    }})
}

exports.getpayinhistoryplayerforsuperadmin = async (req, res) => {
    try {
        const {id, username} = req.user;
        const {page, limit, userid} = req.query;

        if (!userid) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const pageOptions = {
            page: parseInt(page) || 0,
            limit: parseInt(limit) || 10
        };

        const [payinhistory, totalCount] = await Promise.all([
            Payin.find({owner: new mongoose.Types.ObjectId(userid)})
                .populate([
                    {
                        path: "owner",
                        select: "username -_id"
                    },
                    {
                        path: "processby",
                        select: "username -_id"
                    },
                    {
                        path: "character",
                        select: "username level badge -_id"
                    }
                ])
                .skip(pageOptions.page * pageOptions.limit)
                .limit(pageOptions.limit)
                .sort({'createdAt': -1}),
            
            Payin.countDocuments({owner: new mongoose.Types.ObjectId(userid)})
        ]);

        const totalPages = Math.ceil(totalCount / pageOptions.limit);
        const currentTime = new Date();

        const formattedHistory = payinhistory.map(({
            owner, 
            processby, 
            character,
            status, 
            value, 
            type,
            createdAt
        }) => ({
            owner: owner.username,
            processby: processby?.username || "",
            character: {
                username: character?.username || "",
                level: character?.level || 0,
                badge: character?.badge || ""
            },
            status,
            value,
            type,
            createdAt,
            canbedeleted: (currentTime - new Date(createdAt)) >= (1000 * 60 * 60 * 24)
        }));

        return res.json({
            success: true,
            message: "success", 
            data: {
                payinhistory: formattedHistory,
                totalPages
            }
        });

    } catch (error) {
        console.error(`Error in getpayinhistoryplayerforsuperadmin: ${error}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
//  #endregion