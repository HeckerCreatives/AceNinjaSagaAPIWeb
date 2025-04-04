const { createcode, getcodes, claimcode, deletecode, updatecode, redeemanalytics } = require('../controllers/redeemcode');
const { protectsuperadmin } = require('../middleware/middleware');

const router = require('express').Router();

router
 .post("/createcode", protectsuperadmin, createcode)
 .get("/getcodes", protectsuperadmin, getcodes)
 .post("/deletecode", protectsuperadmin, deletecode)
 .post("/updatecode", protectsuperadmin, updatecode)
 .post("/claimcode", claimcode)
 .get("/redeemcodeanalytics", protectsuperadmin, redeemanalytics)

module.exports = router;