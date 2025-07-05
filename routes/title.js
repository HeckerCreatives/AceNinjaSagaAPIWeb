const router = require('express').Router();
const { getTitles } = require('../controllers/title');
const { protectsuperadmin } = require('../middleware/middleware');

router
 .get('/gettitles', protectsuperadmin, getTitles)

module.exports = router;