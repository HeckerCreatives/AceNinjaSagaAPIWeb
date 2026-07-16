const router = require("express").Router();
const { getSteamSales, getAndroidSales, getIOSSales, getSalesSummary, getSteamReport } = require("../controllers/sales");
const { protectsuperadmin } = require("../middleware/middleware");

router
    .get("/steam", protectsuperadmin, getSteamSales)
    .get("/android", protectsuperadmin, getAndroidSales)
    .get("/ios", protectsuperadmin, getIOSSales)
    .get("/summary", protectsuperadmin, getSalesSummary)
    .get("/steam-report", protectsuperadmin, getSteamReport);

module.exports = router;
