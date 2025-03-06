const { creatnews, getnews, editnews, deletenews } = require("../controllers/news")
const { protectsuperadmin } = require("../middleware/middleware")

const router = require("express").Router()


router
.post("/createnews", protectsuperadmin, creatnews)
.get("/getnews", getnews)
.post("/editnews", protectsuperadmin, editnews)
.get("/deletenews", protectsuperadmin, deletenews)

module.exports = router