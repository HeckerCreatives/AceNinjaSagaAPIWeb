const { default: mongoose } = require("mongoose")
const Patchnote = require("../models/Patchnote")


exports.createpatchnote = async (req, res) => {

    const { id } = req.user
    const { title, description, version, date, status } = req.body

    if (!title || !description || !version || !date) {
        return res.status(400).json({ message: "failed", data: "Please input all data." })
    }

    await Patchnote.create({ title, description, version, date, status })
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while creating Patchnote. Error: ${err}.`)
        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later." })
    })


    return res.status(200).json({ message: "success" })
    
}

exports.editpatchnote = async (req, res) => {

    const { id, title, description, version, date, status } = req.body

    if (!title || !description || !version || !date || !status) {
        return res.status(400).json({ message: "failed", data: "Please input all data." })
    }

    await Patchnote.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { title, description, version, date, status })
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while updating Patchnote. Error: ${err}.`)
        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later." })
    })

    return res.status(200).json({ message: "success" })
}

exports.deletepatchnote = async (req, res) => {
    const { id } = req.query

    if (!id) {
        return res.status(400).json({ message: "failed", data: "Please input ID field." })
    }

    await Patchnote.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) })
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered when deleting Patchnote. Error: ${err}`)
        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later." })
    })

    return res.status(200).json({ message: "success" })
}

exports.getpatchnote = async (req, res) => {
    const { status, limit, page } = req.query
    const pageOptions = {
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 0
    }

    const patchnotes = await Patchnote.find({ status })
    .limit(pageOptions.limit)
    .skip(pageOptions.limit * pageOptions.page)
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered when getting Patchnote. Error: ${err}`)
        return
    })

    return res.status(200).json({ message: "success", data: patchnotes })
}
