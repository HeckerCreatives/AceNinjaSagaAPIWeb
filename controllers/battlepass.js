const { Battlepass } = require("../models/Battlepass")
const { checkcharacter } = require("../utils/character")


exports.getbattlepass = async (req, res) => {

    const { id } = req.user
    const { characterid } = req.query

    const checker = await checkcharacter(id, characterid)
    if (checker === "failed") {
        return res.status(400).json({ message: "failed", data: "Character not found." })
    }


    const battlepassdata = await Battlepass.findOne({ owner: characterid })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding battlepass data: ${err}`)
        return
    })

    if(!battlepassdata){
        return res.status(400).json({ message: "failed", data: "Battlepass data not found." })
    }

    return res.status(200).json({ message: "success", data: battlepassdata })
}

exports.getbattlepasssa = async (req, res) => {

    const { id } = req.user
    const { characterid, userid } = req.query

    const checker = await checkcharacter(userid, characterid)
    if (checker === "failed") {
        return res.status(400).json({ message: "failed", data: "Character not found." })
    }


    const battlepassdata = await Battlepass.findOne({ owner: characterid })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding battlepass data: ${err}`)
        return
    })

    if(!battlepassdata){
        return res.status(400).json({ message: "failed", data: "Battlepass data not found." })
    }

    return res.status(200).json({ message: "success", data: battlepassdata })
}


exports.addexperience = async (req, res) => {

    const { id } = req.user
    const { characterid, amount } = req.body

    if (!amount) {
        return res.status(400).json({ message: "failed", data: "Please input amount." })
    }

    if(!characterid){
        return res.status(400).json({ message: "failed", data: "Please input characterid." })
    }

    const checker = await checkcharacter(id, characterid)
    if (checker === "failed") {
        return res.status(400).json({ message: "failed", data: "Character not found." })
    }


    const battlepassdata = await Battlepass.findOne({ owner: characterid })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding battlepass data: ${err}`)
        return
    })


    if(!battlepassdata){
        return res.status(400).json({ message: "failed", data: "Battlepass data not found." })
    }


    try {
        await battlepassdata.addExperience(amount)
        return res.status(200).json({ message: "success" })
    } catch (err) {
        console.log(`Error adding experience: ${err}`)
        return res.status(400).json({ message: "failed", data: "There's a problem with the server. Please try again later." })
    }
}

exports.claimreward = async (req, res) => {

    const { id } = req.user
    const { characterid, level, type } = req.body

    if (!level || !type) {
        return res.status(400).json({ message: "failed", data: "Please input level and type." })
    }

    if(!characterid){
        return res.status(400).json({ message: "failed", data: "Please input characterid." })
    }

    const checker = await checkcharacter(id, characterid)
    if (checker === "failed") {
        return res.status(400).json({ message: "failed", data: "Character not found." })
    }

    await Battlepass.findOne({ owner: characterid })
    .then(async data => {
        try {
            await data.claimReward(level, type)
            return res.status(200).json({ message: "success" })
        } catch (err) {
            console.log(`Error claiming reward: ${err}`)
            return res.status(400).json({ message: "failed", data: "There's a problem with the server. Please try again later." })
        }
    })

}


