const { getleaderboards, addmmr, getpvpleaderboards, getleaderboardssuperadmin, getRankingHistory, selectRankingHistory } = require('../controllers/ranking');
const { protectplayer, protectsuperadmin } = require('../middleware/middleware');

const router = require('express').Router();

router
 .get("/getrankings", protectplayer, getleaderboards)
 .get("/getpvpleaderboards", protectsuperadmin, getpvpleaderboards)
 .post("/addmmr", protectplayer, addmmr)


 .get("/getrankingssuperadmin", protectsuperadmin, getleaderboards)
 .get("/getleaderboardssuperadmin", protectsuperadmin, getleaderboardssuperadmin)

 .get("/getrankinghistory", protectsuperadmin, getRankingHistory)
 .get("/selectrankinghistory", protectsuperadmin, selectRankingHistory)
module.exports = router;