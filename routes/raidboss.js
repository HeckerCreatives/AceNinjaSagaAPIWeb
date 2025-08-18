const router = require("express").Router()
const { 
    createRaidboss, 
    getRaidbosses, 
    updateRaidboss, 
    deleteRaidboss, 
    awardRaidbossRewards, 
    setActiveRaidboss, 
    manualResetRaidboss, 
    // getRaidbossStats 
} = require("../controllers/raidboss")
const { protectplayer, protectsuperadmin } = require("../middleware/middleware")

// Super Admin Routes - CRUD and Management
router
    .get("/getraidbosses", protectsuperadmin, getRaidbosses)
    .post("/createraidboss", protectsuperadmin, createRaidboss)
    .post("/updateraidboss", protectsuperadmin, updateRaidboss)
    .post("/deleteraidboss", protectsuperadmin, deleteRaidboss)
    .post("/setactiveraidboss", protectsuperadmin, setActiveRaidboss)
    .post("/manualresetraidboss", protectsuperadmin, manualResetRaidboss)

    // .get("/getraidbossstats", protectsuperadmin, getRaidbossStats)
    
module.exports = router
