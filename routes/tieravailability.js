const { getTierStatus, initializeTier, resetTier } = require("../controllers/tieravailability");
const { protectsuperadmin } = require("../middleware/middleware");

const router = require("express").Router();

router
    .get("/status", protectsuperadmin, getTierStatus)
    .post("/initialize", protectsuperadmin, initializeTier)
    .post("/reset", protectsuperadmin, resetTier);

module.exports = router;
