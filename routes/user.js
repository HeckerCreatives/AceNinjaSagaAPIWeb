const router = require("express").Router()


const { totalregistration, userlist } = require("../controllers/user")


router
.get("/totalregistration", totalregistration)
.get("/userlist", userlist)


module.exports = router