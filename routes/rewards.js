const { getdailyspinsa, getdailyexpspinsa, getmonthlyloginsa, getweeklyloginsa, editdailyspin, editdailyexpspin, editmonthlylogin, editweeklylogin } = require('../controllers/rewards');
const { protectplayer, protectsuperadmin } = require('../middleware/middleware');

const router = require('express').Router();

router
.get("/getdailyspinsa", protectsuperadmin, getdailyspinsa)
.get("/getdailyexpspinsa", protectsuperadmin, getdailyexpspinsa)
.get("/getmonthlyloginsa", protectsuperadmin, getmonthlyloginsa)
.get("/getweeklyloginsa", protectsuperadmin, getweeklyloginsa)
.post("/editdailyspin", protectsuperadmin, editdailyspin)
.post("/editdailyexpspin", protectsuperadmin, editdailyexpspin)
.post("/editmonthlylogin", protectsuperadmin, editmonthlylogin)
.post("/editweeklylogin", protectsuperadmin, editweeklylogin)

module.exports = router;