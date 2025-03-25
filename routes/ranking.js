const { getleaderboards, addmmr, getpvpleaderboards } = require('../controllers/ranking');
const { protectplayer, protectsuperadmin } = require('../middleware/middleware');

const router = require('express').Router();

router
 .get("/getrankings", protectplayer, getleaderboards)
 .get("/getpvpleaderboards", protectsuperadmin, getpvpleaderboards)
 .post("/addmmr", protectplayer, addmmr)


 .get("/getrankingssuperadmin", protectsuperadmin, getleaderboards)

module.exports = router;