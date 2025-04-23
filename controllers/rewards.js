const { DailyExpSpin, DailySpin, WeeklyLogin, MonthlyLogin, UserDailySpin, UserMonthlyLogin, UserWeeklyLogin } = require("../models/Rewards")
const { checkcharacter } = require("../utils/character")

// #region  SUPERADMIN
exports.getdailyspinsa = async (req, res) => {

    const { id } = req.user

    const dailyspin = await DailySpin.find({}).sort({ slot: 1 })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding dailyspin data: ${err}`)
        return
    })

    if(!dailyspin){
        return res.status(400).json({ message: "failed", data: "Dailyspin data not found." })
    }

    // sort data

    const finaldata = []

    dailyspin.forEach((item) => {
        const { _id, slot, type, amount, chance } = item
        finaldata.push({ id: _id, slot, type, amount, chance })
    })

    return res.status(200).json({ message: "success", data: finaldata })

}

exports.getdailyexpspinsa = async (req, res) => {

    const { id } = req.user

    const dailyspin = await DailyExpSpin.find({}).sort({ slot: 1 })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding dailyexpspin data: ${err}`)
        return
    })

    if(!dailyspin){
        return res.status(400).json({ message: "failed", data: "Daily exp spin data not found." })
    }

    // sort data

    const finaldata = []

    dailyspin.forEach((item) => {
        const { _id, slot, type, amount, chance } = item
        finaldata.push({ id: _id, slot, type, amount, chance })
    })

    return res.status(200).json({ message: "success", data: finaldata })
    
}

exports.getmonthlyloginsa = async (req, res) => {

    const { id } = req.user

    const monthlylogin = await MonthlyLogin.find().sort({ day: 1 })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding monthlylogin data: ${err}`)
        return
    })

    if(!monthlylogin){
        return res.status(400).json({ message: "failed", data: "Monthly login data not found." })
    }

    // sort data by day its like this day1, day2, day3, etc...

    monthlylogin.sort((a, b) => {
        const dayA = parseInt(a.day.replace("day", ""))
        const dayB = parseInt(b.day.replace("day", ""))

        return dayA - dayB
    })

    const finaldata = []

    monthlylogin.forEach((item) => {
        const { _id, day, type, amount, chance } = item
        finaldata.push({ id: _id, day, type, amount, chance })
    })

    return res.status(200).json({ message: "success", data: finaldata })
}

exports.getweeklyloginsa = async (req, res) => {

    const { id } = req.user

    const weeklylogin = await WeeklyLogin.find().sort({ day: 1 })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding weekly login data: ${err}`)
        return
    })

    if(!weeklylogin){
        return res.status(400).json({ message: "failed", data: "Monthly login data not found." })
    }

    // sort data by day its like this day1, day2, day3, etc...

    weeklylogin.sort((a, b) => {
        const dayA = parseInt(a.day.replace("day", ""))
        const dayB = parseInt(b.day.replace("day", ""))

        return dayA - dayB
    })

    const finaldata = []

    weeklylogin.forEach((item) => {
        const { _id, day, type, amount, chance } = item
        finaldata.push({ id: _id, day, type, amount, chance })
    })

    return res.status(200).json({ message: "success", data: finaldata })
}