const router = require("express").Router()
const { authlogin, register, logout, registerstaffuser } = require("../controllers/auth");
const { protectsuperadmin } = require("../middleware/middleware");
// const { protectsuperadmin } = require("../middleware/middleware")

router
.get("/login", authlogin)
.get("/logout", logout)
.post("/register", register)
.post("/registerstaffuser", protectsuperadmin, registerstaffuser)

module.exports = router;
