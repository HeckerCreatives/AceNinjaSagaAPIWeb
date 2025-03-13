const { getpatchnote, deletepatchnote, createpatchnote, editpatchnote } = require("../controllers/patchnote")
const { protectplayer, protectsuperadmin } = require("../middleware/middleware")

const router = require("express").Router()


router
.get("/getpatchnotesplayer", protectplayer, getpatchnote)
.get("/getpatchnotesadmin", protectsuperadmin, getpatchnote)
.get("/deletepatchnote", protectsuperadmin, deletepatchnote)
.post("/createpatchnote", protectsuperadmin, createpatchnote)
.post("/editpatchnote", protectsuperadmin, editpatchnote)

module.exports = router

