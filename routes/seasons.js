const { getseasons, createseason, deleteseasons, updateseason, getcurrentseason, getseasonforleaderboards, endseason } = require('../controllers/season');
const { protectplayer, protectsuperadmin } = require('../middleware/middleware');

const router = require('express').Router();

router
 .get("/getseasons", protectsuperadmin, getseasons )
 .get("/getcurrentseason", getcurrentseason )
 .get("/getseasonforleaderboards",protectsuperadmin, getseasonforleaderboards )
 .post("/createseasons", protectsuperadmin, createseason )
 .post("/deleteseasons", protectsuperadmin, deleteseasons )
 .post("/updateseasons", protectsuperadmin, updateseason )
 .post("/endseason", protectsuperadmin, endseason )


module.exports = router;