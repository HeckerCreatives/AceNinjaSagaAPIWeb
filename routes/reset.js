const router = require('express').Router();
const { getbattlepassquests, resetpassquest, getresethistory, getquests, resetquest, resetallpassquests, resetallquests, resetallweeklylogin, resetallmonthlylogin, resetallfreebies } = require('../controllers/reset');
const { protectsuperadmin } = require('../middleware/middleware');

router
 .get('/battlepassquests', protectsuperadmin, getbattlepassquests)
 .post('/resetpassquest', protectsuperadmin, resetpassquest)
 .post('/resetallpassquests', protectsuperadmin, resetallpassquests)
 .get('/quests', protectsuperadmin, getquests)
 .post('/resetquest', protectsuperadmin, resetquest)
 .post('/resetallquests', protectsuperadmin, resetallquests)
 .get('/getresethistory', protectsuperadmin, getresethistory)
 .post('/resetallweekylogin', protectsuperadmin, resetallweeklylogin)
 .post('/resetallmonthlylogin', protectsuperadmin, resetallmonthlylogin)
 .post('/resetallfreebies', protectsuperadmin, resetallfreebies)
module.exports = router;