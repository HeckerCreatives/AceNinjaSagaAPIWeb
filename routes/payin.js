const router = require("express").Router()
const { sendtopupplayer, deletepayinplayersuperadmin, getpayinhistorysuperadmin, getpayinhistoryplayer, getpayinhistoryplayerforsuperadmin, sendtopupplayerequestpayin, requestpayin, getusertotalpayin, getusertotalpayinsa } = require("../controllers/payin")
const { protectplayer, protectsuperadmin } = require("../middleware/middleware")

router

    //  #region USER

    .get("/getpayinhistoryuser", protectsuperadmin, getpayinhistoryplayer)
    .post("/requestpayin", protectplayer, requestpayin)
    .get("/getusertotalpayin", protectplayer, getusertotalpayin)

    //  #endregion
    
    //  #region SUPERADMIN
    .get("/getusertotalpayinsa", protectsuperadmin, getusertotalpayinsa)

    .get("/getpayinhistorysuperadmin", protectsuperadmin, getpayinhistorysuperadmin)
    .get("/getpayinhistoryplayerforsuperadmin", protectsuperadmin, getpayinhistoryplayerforsuperadmin)
    .post("/deletepayinplayersuperadmin", protectsuperadmin, deletepayinplayersuperadmin)
    .post("/sendtopupplayer", protectsuperadmin, sendtopupplayer)

    //  #endregion

module.exports = router;
