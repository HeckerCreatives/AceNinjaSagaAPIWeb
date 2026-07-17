const router = require("express").Router()
const { authlogin, register, logout, registerstaffuser } = require("../controllers/auth");
const { protectsuperadmin } = require("../middleware/middleware");
const { authLimiter } = require("../middleware/security");

router
.get("/login", authLimiter, authlogin)   // legacy GET (kept for compatibility)
.post("/login", authLimiter, authlogin)  // preferred: credentials in POST body
.get("/logout", logout)
.post("/register", authLimiter, register)
.post("/registerstaffuser", protectsuperadmin, registerstaffuser)

module.exports = router;
