const router = require("express").Router()
const { getbattlepass, editbattlepassrewards, editbattlepassdetails, editbattlepassmissions, getbattlepassclaimhistory, getcharacterbattlepassclaimhistory, checkuserbattlepasssa, checkuserbattlepass } = require("../controllers/battlepass")
const { protectplayer, protectsuperadmin } = require("../middleware/middleware")

router
 .get("/getbattlepass", protectsuperadmin, getbattlepass)
 .get("/getbattlepassclaimhistory", protectsuperadmin, getbattlepassclaimhistory)
 .get("/getbattlepassclaimhistory/:id", protectsuperadmin, getbattlepassclaimhistory)
 .get("/checkuserbattlepasssa", protectsuperadmin, checkuserbattlepasssa)
 .post("/editbattlepassrewards", protectsuperadmin, editbattlepassrewards)
 .post("/editbattlepassdetails", protectsuperadmin, editbattlepassdetails)
 .post("/editbattlepassmissions", protectsuperadmin, editbattlepassmissions)
 
 
 .get("/getcharacterbattlepassclaimhistory", protectplayer, getcharacterbattlepassclaimhistory)
 .get("/checkuserbattlepass", protectplayer, checkuserbattlepass)

module.exports = router