const router = require("express").Router();

const { getRankRewards, editrankrewards } = require("../controllers/rankrewards");
const { protectplayer, protectsuperadmin } = require("../middleware/middleware");


router
 .get("/getrankrewards", protectsuperadmin, getRankRewards)
 .post("/editrankreward", protectsuperadmin, editrankrewards)

module.exports = router;