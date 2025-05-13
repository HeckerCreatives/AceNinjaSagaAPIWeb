const { createcharacter, getplayerdata, userplayerdata, getinventory, getxplevel, getWallet, getplayercharacters, getcharactertitles, addxp, updateplayerprofile, updateplayertitle, getplayercharactersweb, getranking, getcharacterrank, getcharacterstatssa, getplayercharactersadmin, getcharacterchapters, getcharacterstats } = require("../controllers/character")
const { protectplayer, protectsuperadmin } = require("../middleware/middleware")

const router = require("express").Router()

router

// #region PLAYER

.get("/getplayerdata", getplayerdata)
.get("/getplayercharacters", protectplayer, getplayercharacters)
.get("/getplayercharactersadmin", protectsuperadmin, getplayercharactersadmin)
.get("/getplayercharactersweb", protectplayer, getplayercharactersweb)
.get("/getinventorydata", protectplayer, getinventory)
.get("/getxplevel", getxplevel)
.get("/getwallet", getWallet)
.get("/getcharactertitles", protectplayer, getcharactertitles)
.get("/getrank", protectplayer, getcharacterrank)
.get("/getcharacterchapters", protectplayer, getcharacterchapters)
.get("/getcharacterstats", protectplayer, getcharacterstats)

.post("/createcharacter", protectplayer, createcharacter)
.post("/addxp", protectplayer, addxp)
.post("/updateplayerprofile", protectplayer, updateplayerprofile)
.post("/updateplayertitle", protectplayer, updateplayertitle)

// #endregion


// #region SUPERADMIN

.get("/getinventorydatasa", protectsuperadmin, getinventory)
.get("/getcharacterrank", protectsuperadmin, getcharacterrank)
.get("/getinventorydatasuperadmin", protectsuperadmin, getinventory)
.get("/getcharacterstatssa", protectsuperadmin, getcharacterstatssa)

// #endregion

module.exports = router