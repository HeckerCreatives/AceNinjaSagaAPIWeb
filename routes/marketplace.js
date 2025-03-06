const { getMarketItems, buyitem, sellitem, equipitem, unequipitem, listequippeditems } = require('../controllers/marketplace');
const { protectplayer, protectsuperadmin } = require('../middleware/middleware');

const router = require('express').Router();


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
 .get("/listequippeditemssuperadmin", protectsuperadmin, listequippeditems)
// #endregion
module.exports = router;