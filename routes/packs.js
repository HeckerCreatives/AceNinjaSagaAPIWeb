const router = require("express").Router();

const { getPackRewards, editpackrewards, editpack, createpack, deletepack } = require("../controllers/packs");
const { protectplayer, protectsuperadmin } = require("../middleware/middleware");

router
 .get("/getpackrewards", protectsuperadmin, getPackRewards)
 .post("/createpack", protectsuperadmin, createpack)
 .post("/editpackreward", protectsuperadmin, editpackrewards)
 .post("/editpack", protectsuperadmin, editpack)
 .post("/deletepack", protectsuperadmin, deletepack)

module.exports = router;
