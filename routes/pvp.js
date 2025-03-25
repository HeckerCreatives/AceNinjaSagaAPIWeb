const { pvpmatchresult, getpvphistory, getcharacterpvpstats, getpvphistorybyseason } = require('../controllers/pvp');
const { protectplayer, protectsuperadmin } = require('../middleware/middleware');

const router = require('express').Router();

router
 .get("/getpvphistory", protectplayer, getpvphistory )
 .get("/getpvphistorybyseason", protectsuperadmin, getpvphistorybyseason )
 .post("/pvpmatchresult", protectplayer, pvpmatchresult )
 .get("/getcharacterpvpstats", protectplayer, getcharacterpvpstats )


module.exports = router;