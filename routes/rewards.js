const { getdailyspinsa, getdailyexpspinsa, getmonthlyloginsa, getweeklyloginsa } = require('../controllers/rewards');
const { protectplayer, protectsuperadmin } = require('../middleware/middleware');

const router = require('express').Router();

router
.get("/getdailyspinsa", protectsuperadmin, getdailyspinsa)
.get("/getdailyexpspinsa", protectsuperadmin, getdailyexpspinsa)
.get("/getmonthlyloginsa", protectsuperadmin, getmonthlyloginsa)
.get("/getweeklyloginsa", protectsuperadmin, getweeklyloginsa)
 

module.exports = router;