// const { createTransaction, completeTransaction, monitorTransaction, getusertransactions } = require("../controllers/Transaction")
// const { createorder, completeorder } = require("../controllers/Transaction")
const { gettopupmarketcredits, completeorder, gettopuphistory, gettopuphistorysa } = require("../controllers/Transaction")
const { protectplayer, protectsuperadmin } = require("../middleware/middleware")
const router = require("express").Router()

router
//  .post("/createorder", protectplayer, createorder)
//  .post("/completeorder", protectplayer, completeorder)
//  .post("/createtransaction", protectplayer, createTransaction)
//  .post("/completetransaction", protectplayer, completeTransaction)
//  .get("/monitortransaction", protectplayer, monitorTransaction)
//  .get("/getusertransaction", getusertransactions)
.get("/gettopupmarketcredits", protectplayer, gettopupmarketcredits)
 .post("/completeorder", protectplayer, completeorder)
 .get("/gettopuphistory", protectplayer, gettopuphistory)
 .get("/gettopuphistory", protectsuperadmin, gettopuphistorysa)

module.exports = router