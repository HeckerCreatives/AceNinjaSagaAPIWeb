const { sendmessage, getcontactslist } = require("../controllers/contactus");

const router = require("express").Router();


router
 .post("/sendmessage", sendmessage)
 .get("/getcontactusmessagelist", getcontactslist)

module.exports = router;