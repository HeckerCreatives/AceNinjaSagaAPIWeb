const router = require("express").Router()
const { getbattlepass, addexperience, claimreward } = require("../controllers/battlepass")
const { protectplayer, protectsuperadmin } = require("../middleware/middleware")

router
 .get("/getbattlepass", protectplayer, getbattlepass)
 .get("/getbattlepasssa", protectsuperadmin, getbattlepass)
.post("/addexperience", protectplayer, addexperience)
.post("/claimreward", protectplayer, claimreward)

module.exports = router