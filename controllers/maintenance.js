
const Maintenance = require("../models/Maintenance")

exports.getmaintenance = async (req, res) => {

    const maintenanceList = await Maintenance.find()
    .then( data => data)
    .catch(err => {
        console.log(`There's a problem encountered while fetching maintenance list. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })

    const finaldata = {
        id: maintenanceList._id,
        type: maintenanceList.type,
        value: maintenanceList.value
    }

    return res.status(200).json({ message: "success", data: finaldata})

}

exports.changemaintenance = async (req, res) => {
    const { type, value} = req.body

    if(!type || !value) {
        return res.status(400).json({ message: "failed", data: "Please input the type and value"})
    }

    await Maintenance.findOneAndUpdate({ type: type }, { $set: { value: value }})
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem while updating maintenance. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })

    return res.status(200).json({ message: "success"})
}