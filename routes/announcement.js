const { getannouncement, createannouncement, editannouncement, deleteannouncement} = require("../controllers/announcement")
const { protectsuperadmin } = require("../middleware/middleware")


const upload = require("../middleware/uploadpics")

const uploadimg = upload.single("url")


const router = require("express").Router()



router
.get("/getannouncement", getannouncement)
.post("/createannouncement", protectsuperadmin, function (req, res, next){
    uploadimg(req, res, function(err){
        if(err){
            return res.status(400).send({ message: "failed", data: err.message })
        }
        next()
    })
}, createannouncement)
.post("/deleteannouncement", protectsuperadmin, deleteannouncement)
.post("/updateannouncement", protectsuperadmin,  function (req, res, next){
    uploadimg(req, res, function(err){
        if(err){
            return res.status(400).send({ message: "failed", data: err.message })
        }
        next()
    })
}, editannouncement)

module.exports = router