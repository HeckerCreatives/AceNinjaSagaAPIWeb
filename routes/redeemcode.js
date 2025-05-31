const { createcode, getcodes, claimcode, deletecode, updatecode, redeemanalytics, getredeemedcodeshistory } = require('../controllers/redeemcode');
const { protectsuperadmin } = require('../middleware/middleware');

const router = require('express').Router();

router
 .post("/createcode", protectsuperadmin, createcode)
 .get("/getcodes", protectsuperadmin, getcodes)
 .post("/deletecode", protectsuperadmin, deletecode)
 .post("/updatecode", protectsuperadmin, updatecode)
 .post("/claimcode", claimcode)
 .get("/redeemcodeanalytics", protectsuperadmin, redeemanalytics)
 .get("/getredeemedcodeshistory", protectsuperadmin, getredeemedcodeshistory)
module.exports = router;