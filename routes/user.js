const router = require("express").Router()


const { totalregistration, userlist, changeuserpasswordsuperadmin, banunbanuser, changeuserpassword, registrationGraph } = require("../controllers/user")
const { protectsuperadmin, protectplayer } = require("../middleware/middleware")


router
.post("/changeuserpassword", protectplayer, changeuserpassword)

.get("/userlist", protectsuperadmin, userlist)
.get("/totalregistration", protectsuperadmin, totalregistration)
.get("/getregistrationgraph", protectsuperadmin, registrationGraph)

.post("/banunbanuser", protectsuperadmin, banunbanuser)
.post("/changeuserpasswordsuperadmin", protectsuperadmin, changeuserpasswordsuperadmin)
module.exports = router