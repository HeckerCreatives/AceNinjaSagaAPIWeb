const router = require("express").Router()
const { getbattlepass, addexperience, claimreward } = require("../controllers/battlepass")
const { protectplayer } = require("../middleware/middleware")

router
 .get("/getbattlepass", protectplayer, getbattlepass)
.post("/addexperience", protectplayer, addexperience)
.post("/claimreward", protectplayer, claimreward)

module.exports = router