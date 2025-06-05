const { getMarketItems, buyitem, sellitem, equipitem, unequipitem, listequippeditems, createItem, deleteItem, updateItem, grantplayeritemsuperadmin, getstoreitemlist, addstoreitems } = require('../controllers/marketplace');
const { protectplayer, protectsuperadmin } = require('../middleware/middleware');

const router = require('express').Router();

const upload = require("../middleware/uploadpics");
const uploadMarketImage = upload.single("imageUrl");

router
 // #region USER
 .get("/getmarketitems", protectplayer, getMarketItems)
 .post("/buyitem", protectplayer, buyitem)
 .post("/sellitem", protectplayer, sellitem)
 .post("/equipitem", protectplayer, equipitem)
 .post("/unequipitem", protectplayer, unequipitem)
 .get("/listequippeditems", protectplayer, listequippeditems)
// #endregion

// #region SUPERADMIN
 .post("/grantplayeritemsuperadmin", protectsuperadmin, grantplayeritemsuperadmin)
 .get("/listequippeditemssuperadmin", protectsuperadmin, listequippeditems)
 .get("/getmarketitemsadmin", protectsuperadmin, getMarketItems)
 .post("/createitems", protectsuperadmin,function (req, res, next) {
    uploadMarketImage(req, res, function(err){
        if(err) {
            return res.status(400).send({ message: "failed", data: err.message})
        }

        next()
    })
 }, createItem)
 .post("/deleteitem", protectsuperadmin, deleteItem)
 .post("/updateitem", protectsuperadmin,function (req, res, next) {
    uploadMarketImage(req, res, function(err){
        if(err) {
            return res.status(400).send({ message: "failed", data: err.message})
        }

        next()
    })
 }, updateItem)

 .get("/getstoreitemlist", protectsuperadmin, getstoreitemlist)
 .post("/addstoreitems", protectsuperadmin, addstoreitems)

// #endregion
module.exports = router;