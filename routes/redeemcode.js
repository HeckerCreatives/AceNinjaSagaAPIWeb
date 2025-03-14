const { createcode, getcodes, claimcode } = require('../controllers/redeemcode');
const { protectsuperadmin } = require('../middleware/middleware');

const router = require('express').Router();

router
 .post("/createcode", protectsuperadmin, createcode)
 .get("/getcodes", protectsuperadmin, getcodes)
 .post("/claimcode", claimcode)

module.exports = router;