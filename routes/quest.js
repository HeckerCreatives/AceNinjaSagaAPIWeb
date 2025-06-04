const { getdailyquest, editdailyquest } = require('../controllers/quest');
const { protectsuperadmin } = require('../middleware/middleware');

const router = require('express').Router();

router
 .get("/getdailyquest", protectsuperadmin, getdailyquest)
 .post("/editdailyquest", protectsuperadmin, editdailyquest);

module.exports = router;