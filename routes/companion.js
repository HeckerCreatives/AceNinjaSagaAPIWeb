const { getcharactercompanions, getcharactercompanionssa, companionlist, buycompanion } = require("../controllers/companion")
const { protectplayer, protectsuperadmin } = require("../middleware/middleware")

const router = require("express").Router()


router
.get("/getcompanionlist", protectplayer, getcharactercompanions)
.get("/getcompanionlistsa", protectsuperadmin, getcharactercompanionssa)
.get("/companionlist", protectplayer, companionlist)
.post("/buycompanion", buycompanion)

module.exports = router;