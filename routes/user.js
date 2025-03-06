const router = require("express").Router()


const { totalregistration, userlist, changeuserpasswordsuperadmin, banunbanuser } = require("../controllers/user")
const { protectsuperadmin } = require("../middleware/middleware")


router
.get("/totalregistration", protectsuperadmin, totalregistration)
.get("/userlist", protectsuperadmin, userlist)
.post("/changeuserpasswordsuperadmin", protectsuperadmin, changeuserpasswordsuperadmin)
.post("/banunbanuser", protectsuperadmin, banunbanuser)

module.exports = router