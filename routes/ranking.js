const { getleaderboards, addmmr, getpvpleaderboards, getleaderboardssuperadmin } = require('../controllers/ranking');
const { protectplayer, protectsuperadmin } = require('../middleware/middleware');

const router = require('express').Router();

router
 .get("/getrankings", protectplayer, getleaderboards)
 .get("/getpvpleaderboards", protectsuperadmin, getpvpleaderboards)
 .post("/addmmr", protectplayer, addmmr)


 .get("/getrankingssuperadmin", protectsuperadmin, getleaderboards)
 .get("/getleaderboardssuperadmin", protectsuperadmin, getleaderboardssuperadmin)
module.exports = router;