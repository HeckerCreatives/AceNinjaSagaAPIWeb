const router = require("express").Router()
const { getbattlepass, addexperience, claimreward, getbattlepasssa } = require("../controllers/battlepass")
const { protectplayer, protectsuperadmin } = require("../middleware/middleware")

router
 .get("/getbattlepass", protectplayer, getbattlepass)
 .get("/getbattlepasssa", protectsuperadmin, getbattlepasssa)
.post("/addexperience", protectplayer, addexperience)
.post("/claimreward", protectplayer, claimreward)

module.exports = router