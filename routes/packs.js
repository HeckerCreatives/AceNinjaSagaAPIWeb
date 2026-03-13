const router = require("express").Router();

const { getPackRewards, editpackrewards, editpack, createpack, deletepack, purchasevippack } = require("../controllers/packs");
const { protectplayer, protectsuperadmin } = require("../middleware/middleware");

router
 .get("/getpackrewardsplayer", protectplayer, getPackRewards)
 .get("/getpackrewards", protectsuperadmin, getPackRewards)
 .post("/createpack", protectsuperadmin, createpack)
 .post("/editpackreward", protectsuperadmin, editpackrewards)
 .post("/editpack", protectsuperadmin, editpack)
 .post("/deletepack", protectsuperadmin, deletepack)
 .post("/purchasevippack", protectplayer, purchasevippack)

module.exports = router;
