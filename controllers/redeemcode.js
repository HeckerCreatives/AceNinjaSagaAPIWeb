const { Redeemcode, CodesRedeemed } = require("../models/Redeemcode")



exports.createcode = async (req, res) => {

    const { code, description, status, expiry, rewards } = req.body

    if(!code || !description || !status || !expiry || !rewards) {
        return res.status(400).json({ message: "failed", data: "Please input the required fields"})
    }

    await Redeemcode.create({ code, description, status, expiration: expiry, rewards })
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem while creating redeem code. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })

    return res.status(200).json({ message: "success"})
}


exports.getcodes = async (req, res) => {

    const { status } = req.query

    let query = {}

    if(status) {
        query = { status }
    }

    const codes = await Redeemcode.find(query)
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while fetching redeem codes. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })

    const finaldata = []

    codes.forEach(data => {
        const { id, code, description, status, expiration, rewards} = data

        finaldata.push({
            id: id,
            code: code,
            description: description,
            status: status,
            expiration: expiration,
            rewards: rewards
        })
    })

    return res.status(200).json({ message: "success", data: finaldata})
}

exports.claimcode = async (req, res) => {

    const { code, characterid } = req.body

    if(!code || !characterid) {
        return res.status(400).json({ message: "failed", data: "Please input the required fields"})
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

    return res.status(200).json({ message: "success"})

}

