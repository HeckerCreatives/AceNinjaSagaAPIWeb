const { createcharacter, getplayerdata, userplayerdata, getinventory, getxplevel, getWallet, getplayercharacters, getcharactertitles, addxp, updateplayerprofile, updateplayertitle } = require("../controllers/character")
const { protectplayer, protectsuperadmin } = require("../middleware/middleware")

const router = require("express").Router()

router

// #region PLAYER
.get("/getplayerdata", getplayerdata)
.get("/getplayercharacters", protectplayer, getplayercharacters)
.get("/getinventorydata", protectplayer, getinventory)
.get("/getxplevel", getxplevel)
.get("/getwallet", getWallet)
.get("/getcharactertitles", protectplayer, getcharactertitles)

.post("/createcharacter", protectplayer, createcharacter)
.post("/addxp", protectplayer, addxp)
.post("/updateplayerprofile", protectplayer, updateplayerprofile)
.post("/updateplayertitle", protectplayer, updateplayertitle)
// #endregion
// #region SUPERADMIN
.get("/getinventorydatasuperadmin", protectsuperadmin, getinventory)
// #endregion

module.exports = router