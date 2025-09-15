const router = require("express").Router();

const { getChestRewards, editchestrewards, editchest } = require("../controllers/chest");
const { protectplayer, protectsuperadmin } = require("../middleware/middleware");

router
 .get("/getchestrewards", protectsuperadmin, getChestRewards)
 .post("/editchestreward", protectsuperadmin, editchestrewards)
 .post("/editchest", protectsuperadmin, editchest)

module.exports = router;
