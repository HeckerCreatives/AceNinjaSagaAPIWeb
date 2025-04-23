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

exports.editdailyspin = async (req, res) => {

    const { id } = req.user
    const { slot, type, amount, chance } = req.body

    const dailyspin = await DailySpin.findOne({ slot })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding dailyspin data: ${err}`)
        return
    })

    if(!dailyspin){
        return res.status(400).json({ message: "failed", data: "Dailyspin data not found." })
    }

    if(!type || !amount || !chance){
        return res.status(400).json({ message: "failed", data: "Please input all fields." })
    }
    if(type !== "coin" && type !== "exp" && type !== "crystal"){
        return res.status(400).json({ message: "failed", data: "Type must be coin, crystal or exp." })
    }

    if(chance < 0 || chance > 100){
        return res.status(400).json({ message: "failed", data: "Chance must be between 0 and 100." })
    }
    if(amount < 0){
        return res.status(400).json({ message: "failed", data: "Amount must be greater than 0." })
    }

    if(slot < 1 || slot > 8){
        return res.status(400).json({ message: "failed", data: "Slot must be between 1 and 8." })
    }

    const totalChances = await DailySpin.aggregate([
        { $match: { slot: { $ne: slot } } },
        { $group: { _id: null, total: { $sum: "$chance" } } }
    ]);

    const currentTotal = totalChances.length ? totalChances[0].total : 0;
    const newTotal = currentTotal + chance;

    if (newTotal > 100) {
        return res.status(400).json({ 
            message: "failed", 
            data: `Total chances would exceed 100%. Current total is ${currentTotal}%` 
        });
    }

    await DailySpin.updateOne({ slot }, { type, amount, chance })
    .then(data => data)
    .catch(err => {
        console.log(`Error updating dailyspin data: ${err}`)
        return
    })

    return res.status(200).json({ message: "success" })
}


exports.editdailyexpspin = async (req, res) => {
    const { id } = req.user
    const { slot, type, amount, chance } = req.body

    const dailyexpspin = await DailyExpSpin.findOne({ slot })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding dailyexpspin data: ${err}`)
        return
    })

    if(!dailyexpspin){
        return res.status(400).json({ message: "failed", data: "Daily exp spin data not found." })
    }

    if(!amount || !chance){
        return res.status(400).json({ message: "failed", data: "Please input all fields." })
    }

    if(chance < 0 || chance > 100){
        return res.status(400).json({ message: "failed", data: "Chance must be between 0 and 100." })
    }
    if(amount < 0){
        return res.status(400).json({ message: "failed", data: "Amount must be greater than 0." })
    }

    if(slot < 1 || slot > 8){
        return res.status(400).json({ message: "failed", data: "Slot must be between 1 and 8." })
    }

    const totalChances = await DailyExpSpin.aggregate([
        { $match: { slot: { $ne: slot } } },
        { $group: { _id: null, total: { $sum: "$chance" } } }
    ]);

    const currentTotal = totalChances.length ? totalChances[0].total : 0;
    const newTotal = currentTotal + chance;

    if (newTotal > 100) {
        return res.status(400).json({ 
            message: "failed", 
            data: `Total chances would exceed 100%. Current total is ${currentTotal}%` 
        });
    }

    await DailyExpSpin.updateOne({ slot }, { amount, chance })
    .then(data => data)
    .catch(err => {
        console.log(`Error updating dailyexpspin data: ${err}`)
        return
    })

    return res.status(200).json({ message: "success" })
}


exports.editmonthlylogin = async (req, res) => {
    const { id } = req.user
    const { day, type, amount } = req.body

    const monthlylogin = await MonthlyLogin.findOne({ day })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding monthlylogin data: ${err}`)
        return
    })

    if(!monthlylogin){
        return res.status(400).json({ message: "failed", data: "Monthly login data not found." })
    }

    if(!type || !amount){
        return res.status(400).json({ message: "failed", data: "Please input all fields." })
    }

    if(type !== "exp" && type !== "coins" && type !== "crystal"){
        return res.status(400).json({ message: "failed", data: "Type must be exp, coins or crystal." })
    }

    if(amount < 0){
        return res.status(400).json({ message: "failed", data: "Amount must be greater than 0." })
    }

    if(!day.match(/^day[1-9][0-9]*$/)){
        return res.status(400).json({ message: "failed", data: "Invalid day format. Should be like 'day1', 'day2', etc." })
    }

    await MonthlyLogin.updateOne({ day }, { type, amount })
    .then(data => data)
    .catch(err => {
        console.log(`Error updating monthlylogin data: ${err}`)
        return res.status(400).json({ message: "failed", data: "Error updating monthly login data." })
    })

    return res.status(200).json({ message: "success" })
}

exports.editweeklylogin = async (req, res) => {
    const { id } = req.user
    const { day, type, amount } = req.body

    const weeklylogin = await WeeklyLogin.findOne({ day })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding weeklylogin data: ${err}`)
        return
    })

    if(!weeklylogin){
        return res.status(400).json({ message: "failed", data: "Weekly login data not found." })
    }

    if(!type || !amount){
        return res.status(400).json({ message: "failed", data: "Please input all fields." })
    }

    if(type !== "exp" && type !== "coins" && type !== "crystal"){
        return res.status(400).json({ message: "failed", data: "Type must be exp, coins or crystal." })
    }

    if(amount < 0){
        return res.status(400).json({ message: "failed", data: "Amount must be greater than 0." })
    }

    if(!day.match(/^day[1-7]$/)){
        return res.status(400).json({ message: "failed", data: "Invalid day format. Should be between day1 and day7." })
    }

    await WeeklyLogin.updateOne({ day }, { type, amount })
    .then(data => data)
    .catch(err => {
        console.log(`Error updating weeklylogin data: ${err}`)
        return res.status(400).json({ message: "failed", data: "Error updating weekly login data." })
    })

    return res.status(200).json({ message: "success" })
}