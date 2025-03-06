const { getSkills, getcharacterSkills, getSkillsWithCharacter, acquirespbasedskills, acquirebuybasedskills, equipskill, unequipskill, getequippedskills } = require('../controllers/skills');
const { protectplayer, protectsuperadmin } = require('../middleware/middleware');

const router = require('express').Router();


router

// #region USER
.get("/getskills", protectplayer, getSkills)
.get("/getskillswithcharacter", protectplayer, getSkillsWithCharacter)
.get("/getcharacterskills", protectplayer, getcharacterSkills)
.post("/acquirespbasedskills", protectplayer, acquirespbasedskills)
.post("/acquirebuybasedskills", protectplayer, acquirebuybasedskills)
.post("/equipskill", protectplayer, equipskill)
.post("/unequipskill", protectplayer, unequipskill)
.get("/getequippedskills", protectplayer, getequippedskills)
// #endregion

// #region SUPERADMIN
.get("/getskillswithcharactersuperadmin", protectsuperadmin, getSkillsWithCharacter)
// #endregion


module.exports = router;