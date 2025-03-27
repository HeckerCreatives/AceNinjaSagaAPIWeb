const router = require("express").Router()


const { totalregistration, userlist, changeuserpasswordsuperadmin, banunbanuser, changeuserpassword, registrationGraph } = require("../controllers/user")
const { protectsuperadmin, protectplayer } = require("../middleware/middleware")


router
.get("/totalregistration", protectsuperadmin, totalregistration)
.get("/userlist", protectsuperadmin, userlist)
.post("/changeuserpasswordsuperadmin", protectsuperadmin, changeuserpasswordsuperadmin)
.post("/banunbanuser", protectsuperadmin, banunbanuser)
.get("/getregistrationgraph", protectsuperadmin, registrationGraph)

.post("/changeuserpassword", protectplayer, changeuserpassword)

module.exports = router