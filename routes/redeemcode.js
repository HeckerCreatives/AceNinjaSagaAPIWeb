const { createcode, getcodes, claimcode, deletecode, updatecode } = require('../controllers/redeemcode');
const { protectsuperadmin } = require('../middleware/middleware');

const router = require('express').Router();

router
 .post("/createcode", protectsuperadmin, createcode)
 .get("/getcodes", protectsuperadmin, getcodes)
 .get("/deletecode", protectsuperadmin, deletecode)
 .post("/updatecode", protectsuperadmin, updatecode)
 .post("/claimcode", claimcode)

module.exports = router;