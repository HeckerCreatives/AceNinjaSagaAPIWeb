const Mail = require("../models/Mail");
const { Item } = require("../models/Market");
const { Redeemcode, CodesRedeemed } = require("../models/Redeemcode")
const { default: mongoose } = require("mongoose");
const { Skill } = require("../models/Skills");




exports.createcode = async (req, res) => {

    const { code , status, expiry, rewards, itemrewards, skillrewards } = req.body

    if(!code || !status || !expiry) {
        return res.status(400).json({ message: "failed", data: "Please input the required fields"})
    }

    if (!rewards && !itemrewards && !skillrewards) {
        return res.status(400).json({ message: "failed", data: "Please provide at least one reward type"})
    }
    // check if code already exists
    const existingCode = await Redeemcode.findOne({ code: { $regex: new RegExp('^' + code + '$', 'i') } })

    if(existingCode) {
        return res.status(400).json({ message: "failed", data: "Code already exists"})
    }
    
    // check if itemrewards are valid items
    if(itemrewards) {
        const itemcheck = await Item.find({ _id: { $in: itemrewards.map(id => new mongoose.Types.ObjectId(id)) } })
        if(itemrewards && itemrewards.length > 0 && itemcheck.length !== itemrewards.length) {
            return res.status(400).json({ message: "failed", data: "Invalid item rewards provided"})
        }
    }
    // check if skillrewards are valid skills
    if(skillrewards) {
        const skillcheck = await Skill.find({ _id: { $in: skillrewards.map(id => new mongoose.Types.ObjectId(id)) } })
        if(skillrewards && skillrewards.length > 0 && skillcheck.length !== skillrewards.length) {
            return res.status(400).json({ message: "failed", data: "Invalid skill rewards provided"})
        }
    }

    await Redeemcode.create({ code, status, expiration: expiry, rewards, itemrewards, skillrewards })
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem while creating redeem code. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })

    return res.status(200).json({ message: "success"})
}


exports.getcodes = async (req, res) => {

    const { status, page, limit } = req.query

    let query = {}

    const pageOptions = {
        page: parseInt(page) || 0,
        limit: parseInt(limit) || 10,
    }

    if(status) {
        if(status === 'expired') {
            query = { expiration: { $lt: new Date() } }
        } else {
            query = { status, expiration: { $gte: new Date() } }
        }
    }

    const codes = await Redeemcode.find(query)
    .sort({ createdAt: -1 })
    .populate("itemrewards")
    .populate("skillrewards")
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while fetching redeem codes. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })

    const totalList = await Redeemcode.countDocuments(query)
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while fetching redeem codes. Error: ${err}`)
        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })

    const totalPages = Math.ceil(totalList / pageOptions.limit)

    const finaldata = []

    const redeemedCounts = await Promise.all(
        codes.map(code => 
            CodesRedeemed.countDocuments({ code: code.id })
            .catch(err => {
                console.log(`There's a problem encountered while fetching redeem codes. Error: ${err}`)
                return 0;
            })
        )
    );

    codes.forEach((data, index) => {
        const { id, code, status, expiration, rewards} = data

        const isExpired = new Date(expiration) < new Date();
        finaldata.push({
            id: id,
            code: code,
            status: isExpired ? 'expired' : status,
            expiration: expiration,
            rewards: rewards,
            itemrewards: data.itemrewards || [],
            skillrewards: data.skillrewards || [],
            redeemedCount: redeemedCounts[index] || 0
        })
    })

    return res.status(200).json({ message: "success", data: finaldata, totalpages: totalPages })
}

exports.claimcode = async (req, res) => {

    const { code, characterid } = req.body

    if(!code || !characterid) {
        return res.status(400).json({ message: "failed", data: "Please input the required fields"})
    }

    // get the code details

    const codedeets = await Redeemcode.findOne({ code: code })

    if(!codedeets) {
        return res.status(400).json({ message: "failed", data: "Code does not exist"})
    }

    // check if user has redeemed the code

    const hasRedeem = await CodesRedeemed.findOne({ owner: characterid, code: code })

    if(hasRedeem) {
        return res.status(400).json({ message: "failed", data: "You have already redeemed this code"})
    }

    // check if code is valid

    const redeemCode = await Redeemcode
    .findOne({ code: code, status: "active", expiration: { $gte: new Date() }})

    if(!redeemCode) {
        return res.status(400).json({ message: "failed", data: "Expired code"})
    }

    // create redeem code

    await CodesRedeemed.create({ owner: characterid, code: code })
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem while creating redeem code. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })

    await Mail.create({ owner: characterid, title: codedeets.title, message: codedeets.description, status: "unread", type: "rewards", rewards: codedeets.rewards })
    .then(data => data)
    .catch(async err => {
        console.log(`There's a problem while creating redeem code. Error: ${err}`)

        await CodesRedeemed.findOneAndDelete({
            owner: characterid,
            code: code
        })
        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })

    return res.status(200).json({ message: "success"})

}

exports.updatecode = async (req, res) => {
    try {
        const { id, code, status, expiry, rewards, itemrewards, skillrewards } = req.body;

        if (!id) {
            return res.status(400).json({ 
                message: "failed", 
                data: "Please provide redeem code ID" 
            });
        }

        // Build update object with non-empty fields only
        const updateObj = {};
        if (code !== undefined && code !== "") updateObj.code = code;
        if (status !== undefined && status !== "") updateObj.status = status;
        if (expiry !== undefined && expiry !== "") updateObj.expiration = expiry;
        if (rewards !== undefined && rewards !== "") updateObj.rewards = rewards;
        if (itemrewards !== undefined && itemrewards.length > 0) {
            // Check if itemrewards are valid items
            const itemcheck = await Item.find({ _id: { $in: itemrewards.map(id => new mongoose.Types.ObjectId(id)) } });
            if (itemcheck.length !== itemrewards.length) {
                return res.status(400).json({ 
                    message: "failed", 
                    data: "Invalid item rewards provided" 
                });
            }
            updateObj.itemrewards = itemrewards;
        }
        if (skillrewards !== undefined && skillrewards.length > 0) {
            // Check if skillrewards are valid skills
            const skillcheck = await Skill.find({ _id: { $in: skillrewards.map(id => new mongoose.Types.ObjectId(id)) } });
            if (skillcheck.length !== skillrewards.length) {
                return res.status(400).json({ 
                    message: "failed", 
                    data: "Invalid skill rewards provided" 
                });
            }
            updateObj.skillrewards = skillrewards;
        }
        // Check if there are fields to update
        if (Object.keys(updateObj).length === 0) {
            return res.status(400).json({
                message: "failed",
                data: "No valid fields provided for update"
            });
        }

        const updatedCode = await Redeemcode.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: updateObj },
            { new: true }
        );

        if (!updatedCode) {
            return res.status(404).json({
                message: "failed",
                data: "Redeem code not found"
            });
        }

        return res.status(200).json({
            message: "success",
        });

    } catch (err) {
        console.error(`Error updating redeem code: ${err}`);
        return res.status(500).json({
            message: "bad-request",
            data: "There's a problem with the server. Please contact support for more details."
        });
    }
};

exports.deletecode = async (req, res) => {
    const { id } = req.body

    if(!id) {
        return res.status(400).json({ message: "failed", data: "Please input the required fields"})
    }

    await Redeemcode.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) })
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem while deleting redeem code. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })

    return res.status(200).json({ message: "success"})
}


exports.redeemanalytics = async (req, res) => {

    const { id, username } = req.user

    const finaldata = {
        redeemed: 0,
        total: 0,
    }

    // get all redeemed codes
    const redeemedCodes = await CodesRedeemed.find()
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem while fetching redeemed codes. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })

    finaldata.redeemed = redeemedCodes.length
    finaldata.total = await Redeemcode.countDocuments()
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem while fetching redeemed codes. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })

    return res.status(200).json({ message: "success", data: finaldata })
}

exports.getredeemedcodeshistory = async (req, res) => {

    const { id, username } = req.user
    const { page, limit } = req.query
    const pageOptions = {
        page: parseInt(page) || 0,
        limit: parseInt(limit) || 10
    }

    const redeemedCodes = await CodesRedeemed.find()
    .populate("code")
    .populate("owner", "username")
    .sort({ createdAt: -1 })
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem while fetching redeemed codes. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })
    
    const totalList = await CodesRedeemed.countDocuments()
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem while fetching redeemed codes. Error: ${err}`)
        
        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })
    
    const totalPages = Math.ceil(totalList / pageOptions.limit)
    if(redeemedCodes.length < 0) {
        return res.status(200).json({ message: "success", data: [], totalpages: totalPages })
    }

    const finaldata = []

    redeemedCodes.forEach(data => {
        const { owner, code, createdAt } = data

        finaldata.push({
            id: data._id,
            username: owner.username,
            code: code?.code || null,
            redeemedAt: createdAt,
            rewards: code.rewards,
        })
    })

    return res.status(200).json({ message: "success", data: finaldata, totalpages: totalPages})
}
