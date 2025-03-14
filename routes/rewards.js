const { monthlyclaimreward, spinnerclaimreward } = require('../controllers/rewards');
const { protectplayer } = require('../middleware/middleware');

const router = require('express').Router();

router
 .post("/claimmonthlyreward", protectplayer, monthlyclaimreward )
 .post("/claimspinnerreward", protectplayer, spinnerclaimreward )


module.exports = router;