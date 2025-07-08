const { challengechapterhistory, challengechapterhistoryadmin, allchallengechapterhistory } = require("../controllers/chapter");
const { protectplayer, protectsuperadmin } = require("../middleware/middleware");

const router = require("express").Router();

router

// #region PLAYER ROUTES

.get("/challengehistory", protectplayer, challengechapterhistory)

// #endregion

// #region ADMIN ROUTES

.get("/challengehistoryadmin", protectsuperadmin, challengechapterhistoryadmin)
.get("/allchallengehistoryadmin", protectsuperadmin, allchallengechapterhistory)

// #endregion

module.exports = router;
