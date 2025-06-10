const router = require('express').Router();
const { gettotalsales } = require('../controllers/dashboard');
const { protectsuperadmin } = require('../middleware/middleware');


router
 .get("/gettotalsales", protectsuperadmin, gettotalsales);
 
module.exports = router;