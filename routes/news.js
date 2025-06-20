const router = require("express").Router()
const { createnews, getnews, editnews, deletenews, getitemnews, createitemnews, edititemnews, deleteitemnews } = require("../controllers/news")
const { protectsuperadmin } = require("../middleware/middleware")

const upload = require("../middleware/uploadpics")
const uploadimg = upload.single("url")

router
.post("/createnews", protectsuperadmin,function (req, res, next) {
    uploadimg(req, res, function(err){
        if(err) {
            return res.status(400).send({ message: "failed", data: err.message})
        }

        next()
    })
 }, createnews)
 .get("/getnews", getnews)
 .get("/getnewssa", protectsuperadmin, getnews)
.post("/editnews", protectsuperadmin,function (req, res, next) {
    uploadimg(req, res, function(err){
        if(err) {
            return res.status(400).send({ message: "failed", data: err.message})
        }

        next()
    })
 }, editnews)
.post("/deletenews", protectsuperadmin, deletenews)

.get("/getitemnews", protectsuperadmin, getitemnews)
.post("/createitemnews", protectsuperadmin, createitemnews)
.post("/edititemnews", protectsuperadmin, edititemnews)
.post("/deleteitemnews", protectsuperadmin, deleteitemnews)

module.exports = router