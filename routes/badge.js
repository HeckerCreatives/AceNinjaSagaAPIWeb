const router = require('express').Router();
const { getBadges } = require('../controllers/badge');
const { protectsuperadmin } = require('../middleware/middleware');

router
 .get('/getbadges', protectsuperadmin, getBadges);

module.exports = router;