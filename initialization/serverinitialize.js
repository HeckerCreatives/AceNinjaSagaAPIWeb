const Maintenance = require("../models/Maintenance")
const Staffusers = require("../models/Staffusers")
const Users = require("../models/Users")
const Rankings = require("../models/Ranking")
const RankTier = require("../models/RankTier")
const Season = require("../models/Season")
const Downloadlinks = require("../models/Downloadlinks")
const { default: mongoose } = require("mongoose")
const { Companion } = require("../models/Companion")
const CharacterData = require("../models/Characterdata")
const { Market, Item, CharacterInventory } = require("../models/Market")
const { Skill } = require("../models/Skills")
const { hairData, weaponData, outfitData, crystalPackData, goldPackData } = require("../data/datainitialization")
const Characterwallet = require("../models/Characterwallet")
const { DailyExpSpin, DailySpin, WeeklyLogin, MonthlyLogin, CharacterDailySpin, CharacterMonthlyLogin, CharacterWeeklyLogin } = require("../models/Rewards")
const { CharacterChapter } = require("../models/Chapter")
const { BattlepassSeason, BattlepassProgress, BattlepassMissionProgress } = require("../models/Battlepass")

exports.initialize = async () => {

    // #region Initialize users
    const admin = await Staffusers.find({ auth: "superadmin"})
    .then(data => data)
    .catch(err => {
        console.log(`Error finding the admin data: ${err}`)
        return
    })

    if(admin.length <= 0 ){
        await Staffusers.create({ username: "aceninjasagaadmin", password: "KXiBP9gMaGoA", webtoken: "", status: "active", auth: "superadmin", email: "aceadmin@gmail.com"})
        .catch(err => {
            console.log(`Error saving admin data: ${err}`)
            return
        }) 
    }

    // #endregion


    const maintenanceList = await Maintenance.find()
    .then(data => data)
    .catch(err => {
        console.log(`Error finding maintenance data: ${err}`)
    })

    if (maintenanceList.length <= 0) {
        const maintenanceListData = ["fullgame", "market", "store", "battlepass", "quest", "dailyspin", "dailyxpspin", "weeklylogin", "monthlylogin", "chest", "pvp", "clan", "raidboss"];
        const maintenanceBulkWrite = maintenanceListData.map(maintenanceData => ({
            insertOne: {
                document: { type: maintenanceData, value: "0" }
            }
        }));


        await Maintenance.bulkWrite(maintenanceBulkWrite);
    }

    //ranks season
    const currentSeason = await Season.findOne({ isActive: "active" });

    if (!currentSeason) {
        console.log("No active season found. Cannot update player ranks.");
        return;
    } 

    // const allPlayers = await Rankings.find();

    // if (allPlayers.length === 0) {
    //     console.log("No players found.");
    //     return;
    // }

    // const rankTiers = await RankTier.find().sort({ requiredmmr: 1 }); // Sort ranks by required MMR

    // if (rankTiers.length === 0) {
    //     console.log("No rank tiers found. Cannot update player ranks.");
    //     return;
    // }

    // for (const player of allPlayers) {
    //     // Find the appropriate rank tier for the player based on their MMR
    //     const newRankTier = rankTiers.find(tier => player.mmr >= tier.requiredmmr);

    //     if (newRankTier) {
    //         player.rank = newRankTier._id; // Update player's rank to the new rank tier
    //         await player.save(); // Save the updated player data
    //     }

    //     console.log(`Updated rank for player ${player.owner.username} to ${newRankTier.name}`);
    // }



    //Download links
    const defaultLinks = [
        { link: "https://play.google.com/store/apps/details?id=com.example.app", title: "Playstore", type: "android" },
        { link: "https://apps.apple.com/us/app/example-app/id123456789", title: "Appstore", type: "ios" },
        { link: "https://store.steampowered.com/app/123456/ExampleGame", title: "Steam", type: "pc" }
    ];

    const existingDownloadLinks = await Downloadlinks.countDocuments();
    if (existingDownloadLinks < 0) {
        await Downloadlinks.insertMany(defaultLinks);
        console.log("Default download links added successfully");
    } 

   
    // #region initialize companions

    const companions = await Companion.find();

    if (companions.length === 0) {
        
        const companions = [
            {
                name: "Viper",
                levelrequirement: 5,
                price: 100000,
                currency: "coins",
                passivedescription: "Grant player immunity to poison effect. Each turn player recovers 50 health and energy.",
                activedescription: "Reduce opponents max. health by 10% and stun them for 1 turn. Can only be used once in combat.",
                passiveeffects: new Map([
                    ['health', 50],
                    ['energy', 50],
                    ['poisonimmunity', 100]
                ]),
                activeeffects: new Map([
                    ['maxhealthreduce', 10],
                    ['stun', 1]
                ]),
            },
            {
                name: "Terra",
                levelrequirement: 15,
                price: 100000,
                currency: "coins",
                passivedescription: "Grant player 20 armor and magic resist.",
                activedescription: "Heal player for 30% max health. Can only be used once in combat.",
                passiveeffects: new Map([
                    ['armor', 20],
                    ['magicresist', 20]
                ]),
                activeeffects: new Map([
                    ['healpercentage', 30]
                ]),
            },
            {
                name: "Gale",
                levelrequirement: 25,
                price: 100000,
                currency: "coins",
                passivedescription: "Grant player 10% critical chance and 15% bonus critical damage.",
                activedescription: "Deal 1000 damage to all the enemies. This skill can not be blocked or dodged. Can be used only once in combat.",
                passiveeffects: new Map([
                    ['critchance', 10],
                    ['critdamage', 15]
                ]),
                activeeffects: new Map([
                    ['damage', 1000],
                    ['cannotdodge', 100],
                    ['cannotblock', 100],
                    ['targetall', 100]
                ]),
            },
            {
                name: "Shade",
                levelrequirement: 35,
                price: 100000,
                currency: "coins",
                passivedescription: "Grant player 150 additional damage when above 50% max. health, and 150 damage reduction when below 50% max. health.",
                activedescription: "Remove all negative effects from the player and recover 500 energy.",
                passiveeffects: new Map([
                    ['conditionaldamage', 150],
                    ['healththreshold', 50],
                    ['damagereduction', 150]
                ]),
                activeeffects: new Map([
                    ['cleanse', 100],
                    ['energy', 500]
                ]),
            },
            {
                name: "Blaze",
                levelrequirement: 45,
                price: 100000,
                currency: "coins",
                passivedescription: "Grant player bonus 10 speed. Player's every damage attack reduces 2% max. health from the target.",
                activedescription: "Give player immunity to negative effects for 3 turns.",
                passiveeffects: new Map([
                    ['speed', 10],
                    ['maxhealthreduction', 2]
                ]),
                activeeffects: new Map([
                    ['immunity', 100],
                    ['immunityturns', 3]
                ]),
            }
        ];

        await Companion.insertMany(companions);

        console.log("Default companions added successfully");
    }


    // #region initialize items

    const items = await Item.find()
    .then(data => data)
    .catch(err => {
        console.log(`Error finding item data: ${err}`)
    })


    if (items.length <= 0) {

        const itemData = [
            ...hairData,
            ...weaponData,
            ...outfitData,
            ...crystalPackData,
            ...goldPackData
        ]

        const itemBulkWrite = itemData.map(item => ({
            insertOne: {
                document: item
            }
        }));

        await Item.bulkWrite(itemBulkWrite)
        .catch(err => {
            console.log(`Error saving item data: ${err}`)
            return
        })

    }

    // Basic Attack Path
    const attackskilltree = await Skill.find({ category: "Basic", path: "Attack" })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding skill data: ${err}`)
    })

    if (attackskilltree.length <= 0) {
    
        // initialize attack path

        const energy = await Skill.create({
            name: "Energy +40",
            category: "Basic",
            path: "Attack",
            type: "Stat",
            levelRequirement: 0,
            currency: "skillpoints",                
            spCost: 1,
            maxLevel: 39,
            effects: { "energy": 40 },
            prerequisites: []
        })

        const attack1 = await Skill.create({
            name: "Attack Damage +5",
            category: "Basic",
            path: "Attack",
            type: "Stat",
            levelRequirement: 10,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "attackdamage": 5 },
            prerequisites: [energy._id]
        })
        const attack2 = await Skill.create({
            name: "Attack Damage +5",
            category: "Basic",
            path: "Attack",
            type: "Stat",
            levelRequirement: 20,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "attackdamage": 5 },
            prerequisites: [attack1._id, energy._id]
        })

        const attack3 = await Skill.create({
            name: "Attack Damage +5",
            category: "Basic",
            path: "Attack",
            type: "Stat",
            levelRequirement: 30,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "attackdamage": 5 },
            prerequisites: [attack1._id, energy._id, attack2._id]
        })
        const attack4 = await Skill.create({
            name: "Attack Damage +5",
            category: "Basic",
            path: "Attack",
            type: "Stat",
            levelRequirement: 40,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "attackdamage": 5 },
            prerequisites: [attack1._id, energy._id, attack2._id, attack3._id]
        })

        const magic1 = await Skill.create({
            name: "Magic Damage +5",
            category: "Basic",
            path: "Attack",
            type: "Stat",
            levelRequirement: 10,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "magicdamage": 5 },
            prerequisites: [energy._id]
        })

        const magic2 = await Skill.create({
            name: "Magic Damage +5",
            category: "Basic",
            path: "Attack",
            type: "Stat",
            levelRequirement: 20,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "magicdamage": 5 },
            prerequisites: [energy._id, magic1._id]
        })

        const magic3 = await Skill.create({
            name: "Magic Damage +5",
            category: "Basic",
            path: "Attack",
            type: "Stat",
            levelRequirement: 30,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "magicdamage": 5 },
            prerequisites: [energy._id, magic1._id, magic2._id]
        })

        const magic4 = await Skill.create({
            name: "Magic Damage +5",
            category: "Basic",
            path: "Attack",
            type: "Stat",
            levelRequirement: 40,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "magicdamage": 5 },
            prerequisites: [energy._id, magic1._id, magic2._id, magic3._id]
        })

        await Skill.create({
            name: "Power Up",
            category: "Basic",
            path: "Attack",
            type: "Active",
            levelRequirement: 40,
            currency: "skillpoints",
            spCost: 7,
            maxLevel: 1,
            description: "Increase attack and magic damage by 70% for 3 turns. Gain 20% lifesteal and omnivamp while the skill is active, and damaging abilities gain 15% chance to stun the opponent for 1 turn",
            effects: { "attackdamage": 70, "magicdamage": 70, "stat_turn": 3, "lifesteal": 20, "omnivamp": 20, "stun": 15, "los_turn": 1, "damage": 0, "energy": 300, "cooldown": 14 },
            prerequisites: [energy._id, magic1._id, magic2._id, magic3._id, magic4._id, attack1._id, attack2._id, attack3._id, attack4._id]
        })

        console.log("Attack path initialized")

    }


    // Basic Defense Path
    const defskilltree = await Skill.find({ category: "Basic", path: "Defense" })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding skill data: ${err}`)
    })


    if (defskilltree.length <= 0) {
    
        // initialize defense path

        const health = await Skill.create({
            name: "Health +40",
            category: "Basic",
            path: "Defense",
            type: "Stat",
            levelRequirement: 0,
            currency: "skillpoints",                
            spCost: 1,
            maxLevel: 39,
            effects: { "health": 40 },
            prerequisites: []
        })

        const armor1 = await Skill.create({
            name: "Armor +5",
            category: "Basic",
            path: "Defense",
            type: "Stat",
            levelRequirement: 10,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "armor": 5 },
            prerequisites: [health._id]
        })
        const armor2 = await Skill.create({
            name: "Armor +5",
            category: "Basic",
            path: "Defense",
            type: "Stat",
            levelRequirement: 20,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "armor": 5 },
            prerequisites: [health._id, armor1._id]
        })

        const armor3 = await Skill.create({
            name: "Armor +5",
            category: "Basic",
            path: "Defense",
            type: "Stat",
            levelRequirement: 30,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "armor": 5 },
            prerequisites: [health._id, armor1._id, armor2._id]
        })
        const armor4 = await Skill.create({
            name: "Armor +5",
            category: "Basic",
            path: "Defense",
            type: "Stat",
            levelRequirement: 40,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "armor": 5 },
            prerequisites: [health._id, armor1._id, armor2._id, armor3._id]
        })

        const magicresist1 = await Skill.create({
            name: "Magic Resist +5",
            category: "Basic",
            path: "Defense",
            type: "Stat",
            levelRequirement: 10,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "magicresist": 5 },
            prerequisites: [health._id]
        })

        const magicresist2 = await Skill.create({
            name: "Magic Resist +5",
            category: "Basic",
            path: "Defense",
            type: "Stat",
            levelRequirement: 20,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "magicresist": 5 },
            prerequisites: [health._id, magicresist1._id]
        })

        const magicresist3 = await Skill.create({
            name: "Magic Resist +5",
            category: "Basic",
            path: "Defense",
            type: "Stat",
            levelRequirement: 30,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "magicresist": 5 },
            prerequisites: [health._id, magicresist1._id, magicresist2._id]
        })

        const magicresist4 = await Skill.create({
            name: "Magic Resist +5",
            category: "Basic",
            path: "Defense",
            type: "Stat",
            levelRequirement: 40,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "magicresist": 5 },
            prerequisites: [health._id, magicresist1._id, magicresist2._id, magicresist3._id]
        })

        await Skill.create({
            name: "Blood Shield",
            category: "Basic",
            path: "Defense",
            type: "Active",
            levelRequirement: 40,
            currency: "skillpoints",
            spCost: 7,
            maxLevel: 1,
            description: "Instantly recover 1500 health and gain 20 armor and magic resist for 3 turns.",
            effects: { "damage": 0, "energy": 300, "cooldown": 14, "health": 1500, "armor": 20, "magicresist": 20, "turns": 3 },
            prerequisites: [health._id , armor1._id, armor2._id, armor3._id, armor4._id, magicresist1._id, magicresist2._id, magicresist3._id, magicresist4._id]
        })

        console.log("Defense path initialized")

    }

    // Basic Utility Path
    const utilityskilltree = await Skill.find({ category: "Basic", path: "Utility" })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding skill data: ${err}`)
    })


    if (utilityskilltree.length <= 0) {
        
        // initialize utility path

        const speed = await Skill.create({
            name: "speed +1",
            category: "Basic",
            path: "Utility",
            type: "Stat",
            levelRequirement: 0,
            currency: "skillpoints",                
            spCost: 1,
            maxLevel: 39,
            effects: { "speed": 1 },
            prerequisites: []
        })

        const crit1 = await Skill.create({
            name: "Crit. Chance +1",
            category: "Basic",
            path: "Utility",
            type: "Stat",
            levelRequirement: 10,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "critchance": 1 },
            prerequisites: [speed._id]
        })

        const armorpen = await Skill.create({
            name: "Armor Penetration +1",
            category: "Basic",
            path: "Utility",
            type: "Stat",
            levelRequirement: 20,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "armorpen": 1 },
            prerequisites: [speed._id, crit1._id]
        })
        
        const lifesteal = await Skill.create({
            name: "Lifesteal +1",
            category: "Basic",
            path: "Utility",
            type: "Stat",
            levelRequirement: 30,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "lifesteal": 1 },
            prerequisites: [speed._id, crit1._id, armorpen._id]
        })

        const crit2 = await Skill.create({
            name: "Crit. Chance +1",
            category: "Basic",
            path: "Utility",
            type: "Stat",
            levelRequirement: 40,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "critchance": 1 },
            prerequisites: [speed._id, crit1._id, armorpen._id, lifesteal._id]
        })

        const tbd = await Skill.create({
            name: "tbd",
            category: "Basic",
            path: "Utility",
            type: "Stat",
            levelRequirement: 10,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "tbd": 1 },
            prerequisites: [speed._id]
        })

        const magicpen1 = await Skill.create({
            name: "Magic Penetration +1",
            category: "Basic",
            path: "Utility",
            type: "Stat",
            levelRequirement: 20,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "magicpen": 1 },
            prerequisites: [speed._id, tbd._id]
        })

        const omnivamp = await Skill.create({
            name: "Omnivamp +1",
            category: "Basic",
            path: "Utility",
            type: "Stat",
            levelRequirement: 30,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "omnivamp": 1 },
            prerequisites: [speed._id, tbd._id, magicpen1._id]
        })

        const tbd2 = await Skill.create({
            name: "tbd",
            category: "Basic",
            path: "Utility",
            type: "Stat",
            levelRequirement: 40,
            currency: "skillpoints",
            spCost: 4,
            maxLevel: 1,
            effects: { "tbd": 1 },
            prerequisites: [speed._id, tbd._id, magicpen1._id, omnivamp._id]
        })

        await Skill.create({
            name: "Sensory Boost",
            category: "Basic",
            path: "Utility",
            type: "Active",
            levelRequirement: 40,
            currency: "skillpoints",
            spCost: 7,
            maxLevel: 1,
            description: "Increase critical strike chance by 25% and critical damage by 40% for 3 turns. While this skill is active, critical strikes reduce all skill cooldown by 1.",
            effects: { "critchance": 25, "critdamage": 40, "cooldown": 14, "turns": 3, "damage": 0, "energy": 300 },
            prerequisites: [speed._id, crit1._id, crit2._id, armorpen._id, lifesteal._id, tbd._id, magicpen1._id, omnivamp._id, tbd2._id]
        })

        console.log("Utility path initialized")

    }

    // Special Skills
    const specialskills = await Skill.find({ category: "Special" })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding skill data: ${err}`)
    })

    if(specialskills.length <= 0){
        // initialize special skills

        await Skill.create({
            name: "Arrow Strike",
            category: "Special",
            type: "Active",
            currency: "coins",
            price: 1000,
            levelRequirement: 2,
            spCost: 0,
            maxLevel: 1,
            effects: { damage: 100, energy: 50, cooldown: 5 },
            prerequisites: []
        })

        await Skill.create({
            name: "Energy Blade",
            category: "Special",
            type: "Active",
            currency: "coins",
            price: 1000,
            levelRequirement: 4,
            spCost: 0,
            maxLevel: 1,
            effects: { damage: 120, energy: 60, cooldown: 5 },
            prerequisites: []
        })

        await Skill.create({
            name: "Spirit Aura",
            category: "Special",
            type: "Active",
            currency: "coins",
            price: 1000,
            levelRequirement: 6,
            spCost: 0,
            maxLevel: 1,
            description: "Coat the user with spirit aura. Recover 300 health and energy for 2 turns.",
            effects: { damage: 0, energy: 200, cooldown: 10, health: 150, energyrecovery: 150, turns: 2 },
            prerequisites: []
        })

        await Skill.create({
            name: "Silent Stab",
            category: "Special",
            type: "Active",
            currency: "coins",
            price: 1000,
            levelRequirement: 8,
            spCost: 0,
            maxLevel: 1,
            description: "Stab the opponent from behind. Reduce their max. health by 5%.",
            effects: { damage: 200, energy: 100, cooldown: 8, enemyhealth: 5 },
            prerequisites: []
        })

        await Skill.create({
            name: "Blazing Fire",
            category: "Special",
            type: "Active",
            currency: "coins",
            price: 1000,
            levelRequirement: 10,
            spCost: 0,
            maxLevel: 1,
            description: "Put opponent under the ring of fire. Reduce their max. health by 5% for 4 turns.",
            effects: { damage: 300, energy: 200, cooldown: 12, enemyhealth: 5, turns: 4 },
            prerequisites: []
        })

        await Skill.create({
            name: "Mystic Sound",
            category: "Special",
            type: "Active",
            currency: "coins",
            price: 1000,
            levelRequirement: 12,
            spCost: 0,
            maxLevel: 1,
            description: "Send the waves of mysterious sound across the battlefield to disorient the enemies. All opponents’ will be stunned for 2 turns. (Stunned opponent can not do any actions)",
            effects: { damage: 300, energy: 300, cooldown: 14, stun: 100, turns: 2 },
            prerequisites: []
        })

        await Skill.create({
            name: "Quick Slash",
            category: "Special",
            type: "Active",
            currency: "coins",
            price: 1000,
            levelRequirement: 14,
            spCost: 0,
            maxLevel: 1,
            description: "Slash the opponent with katana’s high speed and accuracy. Reduce their max. health by 10%.",
            effects: { damage: 500, energy: 300, cooldown: 12, enemyhealth: 10 },
            prerequisites: []
        })

        await Skill.create({
            name: "Rune Protection",
            category: "Special",
            type: "Active",
            currency: "coins",
            price: 1000,
            levelRequirement: 16,
            spCost: 0,
            maxLevel: 1,
            description: "Gain the power from antient runes. Increase armor and magic resist by 30.",
            effects: { damage: 0, energy: 300, cooldown: 14, armor: 30, magicresist: 30 },
            prerequisites: []
        })

        await Skill.create({
            name: "Chain Attack",
            category: "Special",
            type: "Active",
            currency: "coins",
            price: 1000,
            levelRequirement: 18,
            spCost: 0,
            maxLevel: 1,
            description: "Put chains around the opponent. Reduce their speed by 10 and reduce their attack and magic damage by 20.",
            effects: { damage: 500, energy: 300, cooldown: 14, speedreduct: 10, attackdamagereduct: 20, magicdamagereduct: 20 },
            prerequisites: []
        })

        await Skill.create({
            name: "Eagle Senses", 
            category: "Special",
            type: "Active",
            currency: "coins",
            price: 1000,
            levelRequirement: 20,
            spCost: 0,
            maxLevel: 1,
            description: "Gain eagle’s senses. Increase speed by 15 for 2 turns and reduce cooldown of all skills by 3 (excluding Path skills).",
            effects: { damage: 0, energy: 300, cooldown: 14, speed: 15, cooldownreduct: 3, turns: 2 },
            prerequisites: []
        })

        await Skill.create({
            name: "Rune Light",
            category: "Special",
            type: "Active",
            currency: "coins",
            price: 1000,
            levelRequirement: 22,
            spCost: 0,
            maxLevel: 1,
            description: "Summon ancient light from runes. Remove all buffs from the opponent.",
            effects: { damage: 400, energy: 400, cooldown: 14, buffremove: 100 },
            prerequisites: []
        })

        await Skill.create({
            name: "Golem Attack",
            category: "Special",
            type: "Active",
            currency: "coins",
            price: 1000,
            levelRequirement: 24,
            spCost: 0,
            maxLevel: 1,
            description: "Summon a golem to the battlefield to deal high damage to all opponents.",
            effects: { damage: 900, energy: 600, cooldown: 14 },
            prerequisites: []
        })

        await Skill.create({
            name: "Quick Shot",
            category: "Special",
            type: "Active",
            currency: "coins",
            price: 1000,
            levelRequirement: 26,
            spCost: 0,
            maxLevel: 1,
            description: "Quickly attack with dagger from the shadows. Apply 30% bleeding and 7% max. health poison to the opponent for 3 turns. (Bleeding opponent takes % more damage)",
            effects: { damage: 500, energy: 300, cooldown: 14, bleed: 30, poison: 7, turns: 3 },
            prerequisites: []
        })

        await Skill.create({
            name: "Fear Aura",
            category: "Special",
            type: "Active",
            currency: "coins",
            price: 1000,
            levelRequirement: 28,
            spCost: 0,
            maxLevel: 1,
            description: "Summon creature souls from the darkness. Fear the opponent for 2 turns. (Feared enemies randomly use any skill)",
            effects: { damage: 500, energy: 500, cooldown: 14, fear: 100, turns: 2 },
            prerequisites: []
        })

        await Skill.create({
            name: "Wind Strike",
            category: "Special",
            type: "Active",
            currency: "coins",
            price: 1000,
            levelRequirement: 30,
            spCost: 0,
            maxLevel: 1,
            description: "Send a concentrated blow of wind to the opponent, overcoming all obstacles. Reduce opponent’s armor and magic resist by 30 for 3 turns.",
            effects: { damage: 700, energy: 600, cooldown: 14, armorreduct: 30, magicreduct: 30, turns: 3 },
            prerequisites: []
        })

        await Skill.create({
            name: "Stone Skin",
            category: "Special",
            type: "Active",
            currency: "coins",
            price: 1000,
            levelRequirement: 32,
            spCost: 0,
            maxLevel: 1,
            description: "Coat the user’s skin with stone. Rebound all damage back to the opponent and user gains 800 health shield.",
            effects: { damage: 0, energy: 300, cooldown: 14, rebound: 100, shield: 800 },
            prerequisites: []
        })

        await Skill.create({
            name: "Heavy Fall",
            category: "Special",
            type: "Active",
            currency: "coins",
            price: 1000,
            levelRequirement: 34,
            spCost: 0,
            maxLevel: 1,
            description: "Rain down the fire from the sky to entire battlefield. Deal massive damage to all opponents.",
            effects: { damage: 1100, energy: 700, cooldown: 14 },
            prerequisites: []
        })

        await Skill.create({
            name: "Light Attack",
            category: "Special",
            type: "Active",
            currency: "coins",
            price: 1000,
            levelRequirement: 36,
            spCost: 0,
            maxLevel: 1,
            description: "Control light and shadows precisely. Remove all buffs from the opponent and reduce their attack damage by 50 for 2 turns.",
            effects: { damage: 400, energy: 400, cooldown: 14, buffremove: 100, attackdamagereduct: 50, turns: 2 },
            prerequisites: []
        })

        await Skill.create({
            name: "Stone Rain",
            category: "Special",
            type: "Active",
            currency: "coins",
            price: 1000,
            levelRequirement: 38,
            spCost: 0,
            maxLevel: 1,
            description: "Roll down the massive stones from the mountain. Slow the opponent by 10 for 3 turns and instantly reduce their max. health by 15%.",
            effects: { damage: 700, energy: 400, cooldown: 14, speedreduct: 10, enemyhealth: 15, turns: 3 },
            prerequisites: []
        })

        await Skill.create({
            name: "Nature Energy",
            category: "Special",
            type: "Active",
            currency: "coins",
            price: 1000,
            levelRequirement: 40,
            spCost: 0,
            maxLevel: 1,
            description: "Absorb the energy from nature to greatly increase stats. Increase all damage by 30, critical chance by 15%, armor and magic resist by 15, and gain 20% lifesteal and omnivamp.",
            effects: { damage: 0, energy: 900, cooldown: 16, attackdamage: 30, magicdamage: 30, critchance: 15, armor: 15, magicresist: 15, lifesteal: 20, omnivamp: 20 },
            prerequisites: []
        })


        console.log("Special skills initialized")
    }

    // Secret Passive Skills
    const passivesecretskills = await Skill.find({ category: "Secret", type: "Passive" })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding skill data: ${err}`)
    })

    if(passivesecretskills.length <= 0){
        // initialize secret passive skills
        await Skill.create({
            name: "Divine Energy",
            category: "Secret",
            type: "Passive",
            currency: "coins",
            price: 500,
            levelRequirement: 8,
            spCost: 0,
            maxLevel: 1,
            description: "Increase attack and magic damage by 15. Gain 15% chance to deal extra 150 damage that turn.",
            effects: { 
                attackdamage: 15, 
                magicdamage: 15,
                extradamagechance: 15,
                extradamage: 150
            },
            prerequisites: []
        });
    
        
        await Skill.create({
            name: "Swiftness",
            category: "Secret",
            type: "Passive",
            currency: "coins",
            price: 500,
            levelRequirement: 14,
            spCost: 0,
            maxLevel: 1,
            description: "Gain 5 speed and 10 armor and magic penetration.",
            effects: { 
                speed: 5,
                armorpen: 10,
                magicpen: 10
            },
            prerequisites: []
        });
        await Skill.create({
            name: "Resilience",
            category: "Secret",
            type: "Passive",
            currency: "coins",
            price: 500,
            levelRequirement: 20,
            spCost: 0,
            maxLevel: 1,
            description: "Recover 100 health and energy every turn. Increase heal and shield power by 15%.",
            effects: { 
                healthrecover: 100,
                energyrecover: 100,
                healpower: 15,
                shieldpower: 15
            },
            prerequisites: []
        });
        await Skill.create({
            name: "Shield Glory",
            category: "Secret",
            type: "Passive",
            currency: "coins",
            price: 500,
            levelRequirement: 28,
            spCost: 0,
            maxLevel: 1,
            description: "Increase armor and magic resist by 15. Gain 10% chance to block all damage from the opponents that turn.",
            effects: { 
                armor: 15, 
                magicresist: 15,
                blockchance: 10
            },
            prerequisites: []
        });
        
        await Skill.create({
            name: "Ascension",
            category: "Secret",
            type: "Passive",
            currency: "coins",
            price: 500,
            levelRequirement: 40,
            spCost: 0,
            maxLevel: 1,
            description: "Increase max. health and energy by 15%. Gain 10% critical chance and bonus 15% critical damage. First time in combat when health drops below 50%, player gains 600 shield.",
            effects: { 
                maxhealth: 15,
                maxenergy: 15,
                critchance: 10,
                critdamage: 15,
                shield: 600,
                shieldthreshold: 50
            },
            prerequisites: []
        });
        
    
        console.log("Secret passive skills initialized");
    }

    // Secret Damage and Buff Skills
    const damagesecretskills = await Skill.find({ category: "Secret", type: "Active" })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding damage skill data: ${err}`)
    })

    if(damagesecretskills.length <= 0){
        // initialize secret damage skills
        await Skill.create({
            name: "Frozen Arrow",
            category: "Secret",
            type: "Active",
            currency: "coins",
            price: 500,
            levelRequirement: 2,
            spCost: 0,
            maxLevel: 1,
            description: "Send the frozen arrow to target direction. Apply 30% bleeding to the opponent for 2 turns. (Bleeding opponent takes % more damage)",
            effects: { 
                damage: 150,
                energy: 100,
                cooldown: 5,
                bleed: 30,
                turns: 2
            },
            prerequisites: []
        });

        await Skill.create({
            name: "Fire Blast",
            category: "Secret",
            type: "Active",
            currency: "coins",
            price: 500,
            levelRequirement: 4,
            spCost: 0,
            maxLevel: 1,
            description: "Concentrate fiery attack to one spot. Burn the opponent for 5% max. health and reduce their speed by 5 for 2 turns.",
            effects: { 
                damage: 200,
                energy: 150,
                cooldown: 7,
                enemyhealth: 5,
                speedreduct: 5,
                turns: 2
            },
            prerequisites: []
        });

        await Skill.create({
            name: "Fear of Shadows",
            category: "Secret",
            type: "Active",
            currency: "coins",
            price: 500,
            levelRequirement: 6,
            spCost: 0,
            maxLevel: 1,
            description: "Send shadow creatures around the opponent. Put them under fear for 1 turn and reduce their max. health by 10%. (Feared enemies randomly use any skill)",
            effects: { 
                damage: 250,
                energy: 150,
                cooldown: 12,
                fear: 100,
                enemyhealth: 10,
                turns: 1
            },
            prerequisites: []
        });

        await Skill.create({
            name: "Icy Breath",
            category: "Secret",
            type: "Active",
            currency: "coins",
            price: 500,
            levelRequirement: 12,
            spCost: 0,
            maxLevel: 1,
            description: "Send the huge blow of icy air towards the opponent. Freeze them and reduce their speed by 10 for 2 turns. (Frozen enemies can only recover energy)",
            effects: { 
                damage: 350,
                energy: 200,
                cooldown: 12,
                freeze: 100,
                speedreduct: 10,
                turns: 2
            },
            prerequisites: []
        });

        await Skill.create({
            name: "World Breaker",
            category: "Secret",
            type: "Active",
            currency: "coins",
            price: 500,
            levelRequirement: 16,
            spCost: 0,
            maxLevel: 1,
            description: "Attack with the massive force that destroys everything in its path. Remove all positive status from the opponent and reduce 5% max. health and energy.",
            effects: { 
                damage: 300,
                energy: 250,
                cooldown: 14,
                buffremove: 100,
                enemyhealth: 5,
                energyreduct: 5
            },
            prerequisites: []
        });

        await Skill.create({
            name: "Quicksand",
            category: "Secret",
            type: "Active",
            currency: "coins",
            price: 500,
            levelRequirement: 22,
            spCost: 0,
            maxLevel: 1,
            description: "Drawn opponent in the quicksand. Slow their speed by 10 and reduce their armor and magic resist by 20 for 3 turns.",
            effects: { 
                damage: 500,
                energy: 250,
                cooldown: 12,
                speedreduct: 10,
                armorreduct: 20,
                magicreduct: 20,
                turns: 3
            },
            prerequisites: []
        });

        await Skill.create({
            name: "Parasite",
            category: "Secret",
            type: "Active",
            currency: "coins",
            price: 500,
            levelRequirement: 24,
            spCost: 0,
            maxLevel: 1,
            description: "Attack opponent with parasites that grow inside their body. Use one skill from opponent's skill set and put it under cooldown (excluding Path skills.)",
            effects: { 
                damage: 500,
                energy: 250,
                cooldown: 12,
                skillsteal: 100
            },
            prerequisites: []
        });

        await Skill.create({
            name: "Deadly Venom",
            category: "Secret",
            type: "Active",
            currency: "coins",
            price: 500,
            levelRequirement: 30,
            spCost: 0,
            maxLevel: 1,
            description: "Summon swarm of spiders on the battlefield. Apply 7% poison to all enemies and reduce their attack and magic damage by 50 for 2 turns.",
            effects: { 
                damage: 600,
                energy: 300,
                cooldown: 14,
                poison: 7,
                attackdamagereduct: 50,
                magicdamagereduct: 50,
                turns: 2
            },
            prerequisites: []
        });

        await Skill.create({
            name: "Warriors Wrath",
            category: "Secret",
            type: "Active",
            currency: "coins",
            price: 500,
            levelRequirement: 32,
            spCost: 0,
            maxLevel: 1,
            description: "Severe the blood flow of the opponent with a heavy attack. User removes all negative status and blocks opponent's healing for 3 turns.",
            effects: { 
                damage: 600,
                energy: 250,
                cooldown: 14,
                debuffremove: 100,
                healblock: 100,
                turns: 3
            },
            prerequisites: []
        });

        await Skill.create({
            name: "Dark Binding",
            category: "Secret",
            type: "Active",
            currency: "coins",
            price: 500,
            levelRequirement: 34,
            spCost: 0,
            maxLevel: 1,
            description: "Use dark energy to bind the soul of the opponent to the shadow realm. Remove one random buff from the opponent and stun them for 1 turns.",
            effects: { 
                damage: 500,
                energy: 500,
                cooldown: 16,
                buffremove: 1,
                stun: 100,
                turns: 1
            },
            prerequisites: []
        });

        await Skill.create({
            name: "Lightning Strike",
            category: "Secret",
            type: "Active",
            currency: "coins",
            price: 500,
            levelRequirement: 36,
            spCost: 0,
            maxLevel: 1,
            description: "Send the devastating lightning strike to the battlefield. Instantly reduce all enemies' max. health by 15% and reduce their move speed by 20 for 2 turns.",
            effects: { 
                damage: 700,
                energy: 500,
                cooldown: 16,
                enemyhealth: 15,
                speedreduct: 20,
                turns: 2
            },
            prerequisites: []
        });

        console.log("Secret damage skills initialized");


        // secret buff skills

        await Skill.create({
            name: "Time Dilation",
            category: "Secret",
            type: "Active",
            currency: "coins",
            price: 500,
            levelRequirement: 10,
            spCost: 0,
            maxLevel: 1,
            description: "Gain the ability to briefly control time. Reduce all skill cooldowns by 4 (excluding Path skills).",
            effects: { 
                damage: 0,
                energy: 200,
                cooldown: 14,
                cooldownreduct: 4
            },
            prerequisites: []
        });

        await Skill.create({
            name: "Spirit Power",
            category: "Secret",
            type: "Active",
            currency: "coins",
            price: 500,
            levelRequirement: 18,
            spCost: 0,
            maxLevel: 1,
            description: "Gain power from the spirit world. Recover 300 health and energy and can not be affected by any negative status for 3 turns.",
            effects: { 
                damage: 0,
                energy: 300,
                cooldown: 14,
                health: 300,
                energyrecover: 300,
                immunestatus: 100,
                turns: 3
            },
            prerequisites: []
        });

        await Skill.create({
            name: "Fire Rune",
            category: "Secret",
            type: "Active",
            currency: "coins",
            price: 500,
            levelRequirement: 26,
            spCost: 0,
            maxLevel: 1,
            description: "Gain the fire power from runes. Increase attack and magic damage by 55 for 3 turns.",
            effects: { 
                damage: 0,
                energy: 300,
                cooldown: 14,
                attackdamage: 55,
                magicdamage: 55,
                turns: 3
            },
            prerequisites: []
        });

        await Skill.create({
            name: "Berserk",
            category: "Secret",
            type: "Active",
            currency: "coins",
            price: 500,
            levelRequirement: 38,
            spCost: 0,
            maxLevel: 1,
            description: "Get enraged to gain massive power. Gain 10 move speed and 25 attack and magic damage for 3 turns. This buff can not be dispersed. After the buff duration, reduce user's attack and magic damage by 30 for 2 turns.",
            effects: { 
                damage: 0,
                energy: 500,
                cooldown: 16,
                speed: 10,
                attackdamage: 25,
                magicdamage: 25,
                turns: 3,
                undispellable: 100,
                attackdamagereduct: 30,
                magicdamagereduct: 30,
                turns: 2
            },
            prerequisites: []
        });

        console.log("Secret buff skills initialized");
    }


    // PVP Skills
    const pvpskills = await Skill.find({ category: "PvP" })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding PVP skill data: ${err}`)
    })

    if(pvpskills.length <= 0){
    
        await Skill.create({
            name: "Gods Clash",
            category: "PvP",
            type: "Active",
            currency: "coins",
            price: 0,
            levelRequirement: 20,
            spCost: 0,
            maxLevel: 1,
            description: "Unleash the fury of the gods to devastate the battlefield. Recover 100% of the damage done by this skill as health. This skill always critically strikes.",
            effects: { 
                damage: 900,
                energy: 400,
                cooldown: 14,
                lifesteal: 100,
                guaranteedcrit: 100
            },
            prerequisites: []
        });

    console.log("PVP skills initialized");
    }

    const skilldeals = await Skill.find({ category: "Deals" })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding Deals skill data: ${err}`)
    })

    if(skilldeals.length <= 0){
        const galeforce = await Skill.create({
            name: "Gale Force",
            category: "Deals",
            type: "Passive",
            currency: "coins", // New currency type
            price: 0,
            levelRequirement: 1,
            spCost: 0,
            maxLevel: 1,
            description: "Gain 15% chance to resist all lock effects (stun, freeze, fear) and recover 150 health each turn.",
            effects: { 
                lockresist: 15,
                healthrecover: 150
            },
            prerequisites: []
        });

        const soulshackle = await Skill.create({
            name: "Soul Shackle",
            category: "Deals",
            type: "Active",
            currency: "coins",
            price: 0,
            levelRequirement: 1,
            spCost: 0,
            maxLevel: 1,
            description: "Reach into the opponent's soul and mind. Absorb 2 random buffs from the opponent and reduce all their skill cooldowns by 1 (excluding Path skills).",
            effects: { 
                damage: 450,
                energy: 400,
                cooldown: 12,
                buffsteal: 2,
                cooldownreduct: 1
            },
            prerequisites: []
        });

        const celestialbarrage = await Skill.create({
            name: "Celestial Barrage",
            category: "Deals",
            type: "Active",
            currency: "coins",
            price: 0,
            levelRequirement: 1,
            spCost: 0,
            maxLevel: 1,
            description: "Call down the rain of Starfire from heavens. Reduce all opponents max. health by 20%.",
            effects: { 
                damage: 500,
                energy: 500,
                cooldown: 18,
                enemyhealth: 20
            },
            prerequisites: []
        });


        const skillitems = [
            {
                name: "Gale Force",
                price: 500,
                currency: "coins",
                type: "skills",
                skill: galeforce._id,
                inventorytype: "skills",
                gender: "unisex",
                description: "Gain 15% chance to resist all lock effects (stun, freeze, fear) and recover 150 health each turn.",
                rarity: "common",
                imageUrl: "",
                isOpenable: false
            },
            {
                name: "Soul Shackle",
                price: 500,
                currency: "coins",
                type: "skills",
                skill: soulshackle._id,
                inventorytype: "skills",
                gender: "unisex",
                description: "Reach into the opponent's soul and mind. Absorb 2 random buffs from the opponent and reduce all their skill cooldowns by 1 (excluding Path skills).",
                rarity: "common",
                imageUrl: "",
                isOpenable: false
            },
            {
                name: "Celestial Barrage",
                price: 500,
                currency: "coins",
                type: "skills",
                skill: celestialbarrage._id,
                inventorytype: "skills",
                gender: "unisex",
                description: "Call down the rain of Starfire from heavens. Reduce all opponents max. health by 20%.",
                rarity: "common",
                imageUrl: "",
                isOpenable: false
            }
        ]

        await Item.insertMany(skillitems)
        .then(() => {
            console.log("Skill items created successfully!");
        })
        .catch((error) => {
            console.error("Error creating skill items:", error);
        });

        console.log("Deals skills initialized");
    }
        
    // Clan Skills
    const clanskills = await Skill.find({ category: "Clan" })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding Clan skill data: ${err}`)
    })

    if(clanskills.length <= 0){
    await Skill.create({
        name: "Alchemist Soul",
        category: "Clan",
        type: "Passive",
        currency: "coins",
        price: 0,
        levelRequirement: 20,
        spCost: 0,
        maxLevel: 1,
        description: "Recover 100 energy each turn. Gain immunity to poison effects.",
        effects: { 
            energyrecover: 100,
            poisonimmune: 100
        },
        prerequisites: []
    });

    await Skill.create({
        name: "Advanced Alchemist Soul",
        category: "Clan",
        type: "Passive",
        currency: "coins",
        price: 0,
        levelRequirement: 20,
        spCost: 0,
        maxLevel: 1,
        description: "Recover 100 health and energy each turn. Gain immunity to burn and poison effects.",
        effects: { 
            healthrecover: 100,
            energyrecover: 100,
            burnimmune: 100,
            poisonimmune: 100
        },
        prerequisites: []
    });

    console.log("Clan skills initialized");
    }

    // Raid Boss Skills
    const raidskills = await Skill.find({ category: "Raid" })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding Raid skill data: ${err}`)
    })

    if(raidskills.length <= 0){
    await Skill.create([
        {
            name: "Lava Burst",
            category: "Raid",
            type: "Active",
            currency: "coins",
            price: 0,
            levelRequirement: 20,
            spCost: 0,
            maxLevel: 1,
            description: "Summon the giant volcanic eruption on the battlefield. Burn all targets to reduce their health by 10% for 2 turns.",
            effects: { 
                damage: 900,
                energy: 400,
                cooldown: 14,
                enemyhealth: 10,
                turns: 2
            },
            prerequisites: []
        },
        {
            name: "High Tide",
            category: "Raid",
            type: "Active",
            currency: "coins",
            price: 0,
            levelRequirement: 20,
            spCost: 0,
            maxLevel: 1,
            description: "Send huge waves towards the opponent to disorient them. Reduce their critical chance, all damage, armor, magic resist, and speed by 15 for 3 turns.",
            effects: { 
                damage: 500,
                energy: 400,
                cooldown: 16,
                critchancereduct: 15,
                attackdamagereduct: 15,
                magicdamagereduct: 15,
                armorreduct: 15,
                magicreduct: 15,
                speedreduct: 15,
                turns: 3
            },
            prerequisites: []
        },
        {
            name: "Frenzy",
            category: "Raid",
            type: "Active",
            currency: "coins",
            price: 0,
            levelRequirement: 20,
            spCost: 0,
            maxLevel: 1,
            description: "When your health drops below 40% activate the frenzy state to gain massively increased stats. Gain 50 attack and magic damage and increase critical chance by 20% for 3 turns. This skill can not be dispersed but can not be used if user above 40% max. health.",
            effects: { 
                damage: 0,
                energy: 0,
                cooldown: 16,
                attackdamage: 50,
                magicdamage: 50,
                critchance: 20,
                turns: 3,
                healththreshold: 40,
                undispellable: 100
            },
            prerequisites: []
        },
        {
            name: "Leaf Dance",
            category: "Raid",
            type: "Active",
            currency: "coins",
            price: 0,
            levelRequirement: 20,
            spCost: 0,
            maxLevel: 1,
            description: "Emerge from stealth and attack the opponent without sound. Stun them for 2 turns and reduce their max. health by 10%.",
            effects: { 
                damage: 600,
                energy: 300,
                cooldown: 14,
                stun: 100,
                enemyhealth: 10,
                turns: 2
            },
            prerequisites: []
        },
        {
            name: "Soul's Eye",
            category: "Raid",
            type: "Active",
            currency: "coins",
            price: 0,
            levelRequirement: 20,
            spCost: 0,
            maxLevel: 1,
            description: "Ascend with the power of pure soul. Recover 400 health and energy and can not be affected by any negative status for 3 turns.",
            effects: { 
                damage: 0,
                energy: 400,
                cooldown: 14,
                health: 400,
                energyrecover: 400,
                immunestatus: 100,
                turns: 3
            },
            prerequisites: []
        }
    ]);

    console.log("Raid skills initialized");
    }

    // Mage Path
    const mageskills = await Skill.find({ category: "Path", path: "Mage" })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding Mage skill data: ${err}`)
    });

    if(mageskills.length <= 0) {
        // Initialize energy reserves (base passive)
        const energyReserves = await Skill.create({
            name: "Energy Reserves",
            category: "Path",
            path: "Mage",
            type: "Passive",
            levelRequirement: 20,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Increase max. energy by 35%. Energy cost of all magic damage abilities are reduced by 20%. When energy is below 25% gain bonus 20 magic damage.",
            effects: { 
                maxenergy: 35,
                energycostreduce: 20,
                magicdamage: 20,
                energythreshold: 25
            },
            prerequisites: []
        });
        
        // First branch - Arcane skills
        const mysticShield = await Skill.create({
            name: "Mystic Shield",
            category: "Path",
            path: "Mage",
            type: "Active",
            levelRequirement: 25,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Conjure a protective barrier that grants user Debuff Resist and Damage Rebound for 3 turns. (Debuff Resist = user can not be affected by any negative status. Damage Rebound = reflect all damage back to an opponent.",
            effects: {
                damage: 0,
                energy: 300,
                cooldown: 16,
                immunestatus: 100,
                rebound: 100,
                turns: 3
            },
            prerequisites: [energyReserves._id]
        });
        const arcaneBlast = await Skill.create({
            name: "Arcane Blast",
            category: "Path",
            path: "Mage",
            type: "Active",
            levelRequirement: 25,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Fire a concentrated blast of energy, dealing high damage and silence an opponent for 2 turns. (Silenced opponents can not use Path skills)",
            effects: {
                damage: 900,
                energy: 600,
                cooldown: 14,
                silence: 100,
                turns: 2
            },
            prerequisites: [energyReserves._id]
        });
        // Second branch - Fire skills
        const essenceFire = await Skill.create({
            name: "Essence of Fire",
            category: "Path",
            path: "Mage",
            type: "Passive",
            levelRequirement: 30,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Increase magic damage by 25. Grant immunity to burn. All magic damage skills have 15% change to ignite an opponent. (Ignite = Burn opponent for 7% max. health for 2 turns. This effect can be stacked)",
            effects: {
                magicdamage: 25,
                burnimmune: 100,
                ignitechance: 15,
                ignitedamage: 7,
                igniteturns: 2
            },
            prerequisites: [energyReserves._id, arcaneBlast._id, mysticShield._id]                       
        });
        
        const arcaneBarrage = await Skill.create({
            name: "Arcane Barrage",
            category: "Path",
            path: "Mage",
            type: "Active",
            levelRequirement: 30,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Unleash a rapid series of arcane missiles at all opponents. Deal high damage and reduce their max. health by 10%.",
            effects: {
                damage: 900,
                energy: 700,
                cooldown: 16,
                enemyhealth: 10
            },
            prerequisites: [energyReserves._id, arcaneBlast._id, mysticShield._id, essenceFire._id]                       
        });


        
        const crystalSpikes = await Skill.create({
            name: "Crystal Spikes",
            category: "Path",
            path: "Mage",
            type: "Active",
            levelRequirement: 30,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Summon sharp crystal spikes at the opponent's location. Freeze the opponent for 1 turn. This skill can be used frequently.",
            effects: {
                damage: 500,
                energy: 400,
                cooldown: 6,
                freeze: 100,
                turns: 1
            },
            prerequisites: [energyReserves._id, arcaneBlast._id, mysticShield._id, essenceFire._id]                       
        });

        const inferno = await Skill.create({
            name: "Inferno",
            category: "Path",
            path: "Mage",
            type: "Active",
            levelRequirement: 35,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Summon a raging inferno at the targeted location. Burn opponent for 5% max. health for 2 turns and remove all buffs.",
            effects: {
                damage: 400,
                energy: 500,
                cooldown: 14,
                enemyhealth: 5,
                buffremove: 100,
                turns: 2
            },
            prerequisites: [energyReserves._id, arcaneBlast._id, mysticShield._id, essenceFire._id]                       
        });

        

        const iceFlow = await Skill.create({
            name: "Ice Flow",
            category: "Path",
            path: "Mage",
            type: "Active",
            levelRequirement: 35,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Conjure the power of ice. Increase magic damage by 70 and magic penetration by 35.",
            effects: {
                damage: 0,
                energy: 300,
                cooldown: 14,
                magicdamage: 70,
                magicpen: 35
            },
            prerequisites: [energyReserves._id, arcaneBlast._id, mysticShield._id, essenceFire._id]                       
        });

        // Third branch - Ice skills
        const frozenHeart = await Skill.create({
            name: "Frozen Heart",
            category: "Path",
            path: "Mage",
            type: "Passive",
            levelRequirement: 40,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Regenerate 200 energy each turn. All magic damage skills have 15% chance to freeze enemy for 1 turn. (Frozen enemies can only recover energy)",
            effects: {
                energyrecover: 200,
                freezechance: 15,
                freezeturns: 1
            },
            prerequisites: [energyReserves._id, arcaneBlast._id, mysticShield._id, essenceFire._id, inferno._id, iceFlow._id]                       
        });


        await Skill.create({
            name: "Frost Nova",
            category: "Path",
            path: "Mage",
            type: "Active",
            levelRequirement: 40,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Sacrifice 50% of your max. energy to release the burst of frozen energy. Deal massive damage to the opponent, reduce their speed by 20, and heal for 120% of damage done with this skill.",
            effects: {
                damage: 1400,
                energysacrifice: 50,
                cooldown: 16,
                speedreduct: 20,
                lifesteal: 120
            },
            prerequisites: [energyReserves._id, arcaneBlast._id, mysticShield._id, essenceFire._id, inferno._id, iceFlow._id, frozenHeart._id]                       
        });

        await Skill.create({
            name: "Frost Siphon",
            category: "Path",
            path: "Mage",
            type: "Active",
            currency: "crystal",
            price: 100,
            spCost: 0,
            levelRequirement: 40,
            maxLevel: 1,
            description: "Use the power of ice to drain 40% current energy from the opponent. If drained energy is more than 800, become awakened: increase magic damage by 25, speed by 10, armor and magic resist by 20 for 2 turns. (Can not be dispersed)",
            effects: {
                damage: 600,
                energy: 700,
                cooldown: 14,
                energydrain: 40,
                awakenthreshold: 800,
                magicdamage: 25,
                speed: 10,
                armor: 20,
                magicresist: 20,
                turns: 2,
                undispellable: 100
            },
            prerequisites: [energyReserves._id, arcaneBlast._id, mysticShield._id, essenceFire._id, inferno._id, iceFlow._id, frozenHeart._id]                       
        });

        console.log("Mage path initialized");
    }

    // Samurai Path
    const samuraiskills = await Skill.find({ category: "Path", path: "Samurai" })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding Samurai skill data: ${err}`)
    });

    if(samuraiskills.length <= 0) {
        // Initialize base passive
        const swordMastery = await Skill.create({
            name: "Sword Mastery",
            category: "Path",
            path: "Samurai",
            type: "Passive",
            levelRequirement: 20,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Increase attack damage and armor penetration by 20.",
            effects: { 
                attackdamage: 20,
                armorpen: 20
            },
            prerequisites: []
        });

        // Level 25 skills
        const samuraiFury = await Skill.create({
            name: "Samurai's Fury",
            category: "Path",
            path: "Samurai",
            type: "Active",
            levelRequirement: 25,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Attack with brute force to weaken the opponent. Reduce opponent's all damage by 50, and reduce their current energy by 20%",
            effects: {
                damage: 500,
                energy: 500,
                cooldown: 14,
                attackdamagereduct: 50,
                magicdamagereduct: 50,
                energyreduct: 20
            },
            prerequisites: [swordMastery._id]
        });

        const heavensEdge = await Skill.create({
            name: "Heaven's Edge",
            category: "Path",
            path: "Samurai",
            type: "Active",
            levelRequirement: 25,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Summon the power from heaven. Reduce opponent's max. health by 15% and apply 30% bleeding. (Bleeding opponent takes % more damage)",
            effects: {
                damage: 600,
                energy: 500,
                cooldown: 14,
                enemyhealth: 15,
                bleed: 30
            },
            prerequisites: [swordMastery._id]
        });

        // Level 30 skills
        const warriorsHonor = await Skill.create({
            name: "Warrior's Honor",
            category: "Path",
            path: "Samurai",
            type: "Passive",
            levelRequirement: 30,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Increase armor and heal and shield power by 20.",
            effects: {
                armor: 20,
                healpower: 20,
                shieldpower: 20
            },
            prerequisites: [swordMastery._id, samuraiFury._id, heavensEdge._id]
        });

        const guardianStance = await Skill.create({
            name: "Guardian Stance",
            category: "Path",
            path: "Samurai",
            type: "Active",
            levelRequirement: 30,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Field your sword with fine mastery. Block opponent's all attack damage skills for 3 turns and gain a shield that blocks 1000 damage.",
            effects: {
                damage: 0,
                energy: 300,
                cooldown: 16,
                attackblock: 100,
                shield: 1000,
                turns: 3
            },
            prerequisites: [swordMastery._id, samuraiFury._id, heavensEdge._id, warriorsHonor._id]
        });

        const windCutter = await Skill.create({
            name: "Wind Cutter",
            category: "Path",
            path: "Samurai",
            type: "Active",
            levelRequirement: 30,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Slash your opponent with ultra fast speed and leave them defenseless. Remove all positive buffs from the target and slow their movement speed by 20 for 2 turns.",
            effects: {
                damage: 400,
                energy: 400,
                cooldown: 16,
                buffremove: 100,
                speedreduct: 20,
                turns: 2
            },
            prerequisites: [swordMastery._id, samuraiFury._id, heavensEdge._id, warriorsHonor._id, guardianStance._id]
        });

        // Level 35 skills
        const tempestStrike = await Skill.create({
            name: "Tempest Strike",
            category: "Path",
            path: "Samurai",
            type: "Active",
            levelRequirement: 35,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Attack opponent continuously with your daggers to deal massive damage. Heal 50% of the damage done with this skill and put their one random skill in +5 cooldown.",
            effects: {
                damage: 1000,
                energy: 1000,
                cooldown: 16,
                lifesteal: 50,
                cooldownincrease: 5
            },
            prerequisites: [swordMastery._id, samuraiFury._id, heavensEdge._id, warriorsHonor._id]
        });

        const stoneSkin = await Skill.create({
            name: "Stone Skin",
            category: "Path",
            path: "Samurai",
            type: "Active",
            levelRequirement: 35,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Coat skin with stone to greatly increase your defenses. Increase armor by 70 and regenerate 800 health for 3 turns.",
            effects: {
                damage: 0,
                energy: 300,
                cooldown: 14,
                armor: 70,
                health: 800,
                turns: 3
            },
            prerequisites: [swordMastery._id, samuraiFury._id, heavensEdge._id, warriorsHonor._id]
        });

        // Level 40 skills
        const unyieldingSpirit = await Skill.create({
            name: "Unyielding Spirit",
            category: "Path",
            path: "Samurai",
            type: "Passive",
            levelRequirement: 40,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "When you would reduce to 0 health for the first time you will not die and get a chance to attack your opponent for one last time. If the attack kills the opponent, you win. (When Unyielding Spirit is active, you can not heal or apply shields)",
            effects: {
                deathdefiance: 100,
                laststand: 100,
                healblock: 100
            },
            prerequisites: [swordMastery._id, samuraiFury._id, heavensEdge._id, warriorsHonor._id, tempestStrike._id, stoneSkin._id]
        });
        const ironWill = await Skill.create({
            name: "Iron Will",
            category: "Path",
            path: "Samurai",
            type: "Active",
            levelRequirement: 40,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Pin down your opponent with your sword. Stun them for 2 turns. (Stunned opponent can not do any actions)",
            effects: {
                damage: 400,
                energy: 500,
                cooldown: 16,
                stun: 100,
                turns: 2
            },
            prerequisites: [swordMastery._id, samuraiFury._id, heavensEdge._id, warriorsHonor._id, tempestStrike._id, stoneSkin._id, unyieldingSpirit._id]
        });


        await Skill.create({
            name: "Dragon Slash",
            category: "Path",
            path: "Samurai",
            type: "Active",
            levelRequirement: 40,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Channel the spirit of a dragon to deliver a powerful slash with the katana. Deal massive damage to all enemies and have 50% chance to apply 10% burn for 3 turns. (Burn = reduce % max. health from the target)",
            effects: {
                damage: 1200,
                energy: 1000,
                cooldown: 16,
                burnchance: 50,
                burn: 10,
                turns: 3
            },
            prerequisites: [swordMastery._id, samuraiFury._id, heavensEdge._id, warriorsHonor._id, tempestStrike._id, stoneSkin._id, unyieldingSpirit._id]
        });

        console.log("Samurai path initialized");
    }

    // Scholar Path
    const scholarskills = await Skill.find({ category: "Path", path: "Scholar" })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding Scholar skill data: ${err}`)
    });

    if(scholarskills.length <= 0) {
    // Base passive
    const geneTherapy = await Skill.create({
        name: "Gene Therapy",
        category: "Path",
        path: "Scholar",
        type: "Passive",
        levelRequirement: 20,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Recover 150 health each turn. Increase all damage by 15%, and every 5 turns gain 250 health shield.",
        effects: { 
            healthrecover: 150,
            damagebonus: 15,
            shield: 250,
            shieldturns: 5
        },
        prerequisites: []
    });

    // Level 25 skills
    const scrollWisdom = await Skill.create({
        name: "Scroll of Wisdom",
        category: "Path",
        path: "Scholar",
        type: "Active",
        levelRequirement: 25,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Open a magic scroll that enhances user's knowledge of the battlefield. Reduce cooldown of all Path skills by 5.",
        effects: {
            damage: 0,
            energy: 300,
            cooldown: 14,
            cooldownreduct: 5
        },
        prerequisites: [geneTherapy._id]
    });

    const smartBinding = await Skill.create({
        name: "Smart Binding",
        category: "Path",
        path: "Scholar",
        type: "Active",
        levelRequirement: 25,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Summon spectral traps that bind opponent in place, slowing their speed by 15 and stunning for 2 turns. (Stunned opponent can not do any action)",
        effects: {
            damage: 400,
            energy: 800,
            cooldown: 16,
            speedreduct: 15,
            stun: 100,
            turns: 2
        },
        prerequisites: [geneTherapy._id]
    });

    // Level 30 skills
    const mindsEye = await Skill.create({
        name: "Mind's Eye",
        category: "Path",
        path: "Scholar",
        type: "Passive",
        levelRequirement: 30,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Gain 15% chance to resist any lock effects – stun, freeze, fear. Gain 10% chance to block all damage.",
        effects: {
            lockresist: 15,
            blockchance: 10
        },
        prerequisites: [geneTherapy._id, scrollWisdom._id, smartBinding._id]
    });

    const mindWrap = await Skill.create({
        name: "Mind Wrap",
        category: "Path",
        path: "Scholar",
        type: "Active",
        levelRequirement: 30,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Disrupts opponent's mind, causing them to flee the battlefield. The affected opponents takes 20% increased damage and skips 1 turn.",
        effects: {
            damage: 500,
            energy: 400,
            cooldown: 14,
            damagetaken: 20,
            skipturns: 1
        },
        prerequisites: [geneTherapy._id, scrollWisdom._id, smartBinding._id, mindsEye._id]
    });

    const healthPotion = await Skill.create({
        name: "Health Potion",
        category: "Path",
        path: "Scholar",
        type: "Active",
        levelRequirement: 30,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Drink the special potion. Remove all negative effects and recover 1000 health.",
        effects: {
            damage: 0,
            energy: 300,
            cooldown: 16,
            debuffremove: 100,
            health: 1000
        },
        prerequisites: [geneTherapy._id, scrollWisdom._id, smartBinding._id, mindsEye._id]
    });

    // Level 35 skills
    const poisonQuill = await Skill.create({
        name: "Poison Quill",
        category: "Path",
        path: "Scholar",
        type: "Active",
        levelRequirement: 35,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Summon a poisoned quill that writes ancient symbols on opponent's skin. Reduces opponent's armor and magic resist by 25 and applies 5% poison for 3 turns.",
        effects: {
            damage: 700,
            energy: 500,
            cooldown: 14,
            armorreduct: 25,
            magicreduct: 25,
            poison: 5,
            turns: 3
        },
        prerequisites: [geneTherapy._id, scrollWisdom._id, smartBinding._id, mindsEye._id]
    });

    const sagesResolve = await Skill.create({
        name: "Sage's Resolve",
        category: "Path",
        path: "Scholar",
        type: "Active",
        levelRequirement: 35,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Use ancient knowledge on battlefield. Recover 400 health and energy for 3 turns and increase speed by 15 for the duration.",
        effects: {
            damage: 0,
            energy: 300,
            cooldown: 16,
            healthrecover: 400,
            energyrecover: 400,
            speed: 15,
            turns: 3
        },
        prerequisites: [geneTherapy._id, scrollWisdom._id, smartBinding._id, mindsEye._id]
    });

    // Level 40 skills
    const runeMastery = await Skill.create({
        name: "Rune Mastery",
        category: "Path",
        path: "Scholar",
        type: "Passive",
        levelRequirement: 40,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Gain 15% chance to instantly reset the cooldown of any skill after casting it. Increase energy regeneration by 25%.",
        effects: {
            resetcdchance: 15,
            energyregenbonus: 25
        },
        prerequisites: [geneTherapy._id, scrollWisdom._id, smartBinding._id, mindsEye._id, poisonQuill._id, sagesResolve._id]
    });

    const scholarsTouch = await Skill.create({
        name: "Scholar's Touch",
        category: "Path",
        path: "Scholar",
        type: "Active",
        levelRequirement: 40,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Alter the flow of life in opponent's body. Remove all buffs and drain 20% of the current health from the opponent.",
        effects: {
            damage: 400,
            energy: 500,
            cooldown: 14,
            buffremove: 100,
            healthdrain: 20
        },
        prerequisites: [geneTherapy._id, scrollWisdom._id, smartBinding._id, mindsEye._id, poisonQuill._id, sagesResolve._id, runeMastery._id]
    });

    await Skill.create({
        name: "Cerebral Pulse",
        category: "Path",
        path: "Scholar",
        type: "Active",
        levelRequirement: 40,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Release the pulse of psychic energy all around the battlefield. Deal massive damage to all enemies, increase all skill cooldown by 1 (excluding Path skills) and instantly reduce 10% max. health.",
        effects: {
            damage: 1000,
            energy: 800,
            cooldown: 16,
            cooldownincrease: 1,
            enemyhealth: 10
        },
        prerequisites: [geneTherapy._id, scrollWisdom._id, smartBinding._id, mindsEye._id, poisonQuill._id, sagesResolve._id, runeMastery._id]
    });

    console.log("Scholar path initialized");
    }
    
    // Rogue Path
    const rogueskills = await Skill.find({ category: "Path", path: "Rogue" })
    .then(data => data)
    .catch(err => {
        console.log(`Error finding Rogue skill data: ${err}`)
    });

    if(rogueskills.length <= 0) {
    // Base passive
    const adrenalineRush = await Skill.create({
        name: "Adrenaline Rush",
        category: "Path",
        path: "Rogue",
        type: "Passive",
        levelRequirement: 20,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Increase speed by 10. Gain 15% critical chance and 30% bonus critical damage.",
        effects: { 
            speed: 10,
            critchance: 15,
            critdamage: 30
        },
        prerequisites: []
    });

    // Level 25 skills
    const tremorSense = await Skill.create({
        name: "Tremor Sense",
        category: "Path",
        path: "Rogue",
        type: "Active",
        levelRequirement: 25,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Gain an enhanced understanding of the battlefield through sound waves. Reduce all skill cooldown by 3 (excluding Path skills). Increase armor and magic resist by 15 for 3 turns.",
        effects: {
            damage: 0,
            energy: 300,
            cooldown: 14,
            cooldownreduct: 3,
            armor: 15,
            magicresist: 15,
            turns: 3
        },
        prerequisites: [adrenalineRush._id]
    });

    const arrowStrike = await Skill.create({
        name: "Arrow Strike",
        category: "Path",
        path: "Rogue",
        type: "Active",
        levelRequirement: 25,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Shoot a valley of arrows to all opponents. Reduce their max. health instantly by 10% and apply 30% bleeding for 3 turns.",
        effects: {
            damage: 600,
            energy: 400,
            cooldown: 14,
            enemyhealth: 10,
            bleed: 30,
            turns: 3
        },
        prerequisites: [adrenalineRush._id]
    });

    // Level 30 skills
    const assassinsReflexes = await Skill.create({
        name: "Assassin's Reflexes",
        category: "Path",
        path: "Rogue",
        type: "Passive",
        levelRequirement: 30,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Gain 15% chance to counterattack the same skill opponent used on that turn (Does not apply to Path skills). Always critically strike if opponent is stunned, frozen or feared.",
        effects: {
            counterchance: 15,
            guaranteedcrit: 100
        },
        prerequisites: [adrenalineRush._id, tremorSense._id, arrowStrike._id]
    });

    const deadlyPrecision = await Skill.create({
        name: "Deadly Precision",
        category: "Path",
        path: "Rogue",
        type: "Active",
        levelRequirement: 30,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Coat yourself in hard armor and light your weapon on fire. Gain 100% critical chance, increase attack damage by 30 and gain 1000 health shield for the next turn.",
        effects: {
            damage: 0,
            energy: 300,
            cooldown: 14,
            critchance: 100,
            attackdamage: 30,
            shield: 1000,
            turns: 1
        },
        prerequisites: [adrenalineRush._id, tremorSense._id, arrowStrike._id, assassinsReflexes._id]
    });

    const lethalStrike = await Skill.create({
        name: "Lethal Strike",
        category: "Path",
        path: "Rogue",
        type: "Active",
        levelRequirement: 30,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Attack an opponent from the behind with stealth blade. This attack always critically strikes, deals high damage and can be used frequently.",
        effects: {
            damage: 800,
            energy: 600,
            cooldown: 6,
            guaranteedcrit: 100
        },
        prerequisites: [adrenalineRush._id, tremorSense._id, arrowStrike._id, assassinsReflexes._id]
    });

    // Level 35 skills
    const bloodSacrifice = await Skill.create({
        name: "Blood Sacrifice",
        category: "Path",
        path: "Rogue",
        type: "Active",
        levelRequirement: 35,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Sacrifice 15% max. health to fear the opponent for 2 turns and reduce their armor and magic resist by 20.",
        effects: {
            damage: 500,
            energy: 500,
            cooldown: 16,
            healthsacrifice: 15,
            fear: 100,
            armorreduct: 20,
            magicreduct: 20,
            turns: 2
        },
        prerequisites: [adrenalineRush._id, tremorSense._id, arrowStrike._id, assassinsReflexes._id]
    });

    const shadowStrike = await Skill.create({
        name: "Shadow Strike",
        category: "Path",
        path: "Rogue",
        type: "Active",
        levelRequirement: 35,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Strike your opponent with poisoned arrow from the shadows. Remove all buffs and apply 7% poison for 2 turns.",
        effects: {
            damage: 400,
            energy: 600,
            cooldown: 14,
            buffremove: 100,
            poison: 7,
            turns: 2
        },
        prerequisites: [adrenalineRush._id, tremorSense._id, arrowStrike._id, assassinsReflexes._id]
    });

    // Level 40 skills
    const silentKiller = await Skill.create({
        name: "Silent Killer",
        category: "Path",
        path: "Rogue",
        type: "Passive",
        levelRequirement: 40,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Gain 1 stack for each damage skill used against an opponent (Max. 10 stacks). Each stack increases the attack damage by 3. At max. stacks recover 20% max. health and energy and reduce Path cooldowns by 3. Additionally, increase critical chance by 15% and gain 15% chance to dodge all attacks for the rest of the combat.",
        effects: {
            maxstacks: 10,
            stackdamage: 3,
            healthrecover: 20,
            energyrecover: 20,
            cooldownreduct: 3,
            critchance: 15,
            dodgechance: 15
        },
        prerequisites: [adrenalineRush._id, tremorSense._id, arrowStrike._id, assassinsReflexes._id, bloodSacrifice._id, shadowStrike._id]
    });

    const eyeOfRaven = await Skill.create({
        name: "Eye of Raven",
        category: "Path",
        path: "Rogue",
        type: "Active",
        levelRequirement: 40,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Gain the senses and agility of a raven. Dodge all opponent's skills and increase speed by 10 for 3 turns.",
        effects: {
            damage: 0,
            energy: 300,
            cooldown: 18,
            dodgechance: 100,
            speed: 10,
            turns: 3
        },
        prerequisites: [adrenalineRush._id, tremorSense._id, arrowStrike._id, assassinsReflexes._id, bloodSacrifice._id, shadowStrike._id, silentKiller._id]
    });

    await Skill.create({
        name: "Eviscerate",
        category: "Path",
        path: "Rogue",
        type: "Active",
        levelRequirement: 40,
            currency: "crystal",
            price: 100,
            spCost: 0,
        maxLevel: 1,
        description: "Attack with such a brute force to dismember the opponent's organs. Deal massive damage and instantly reduce 15% of opponent's max. health. After using this skill, user's health will be reduced by 150 for 3 turns.",
        effects: {
            damage: 1100,
            energy: 1000,
            cooldown: 16,
            enemyhealth: 15,
            healthreduct: 150,
            turns: 3
        },
        prerequisites: [adrenalineRush._id, tremorSense._id, arrowStrike._id, assassinsReflexes._id, bloodSacrifice._id, shadowStrike._id, silentKiller._id]
    });

    console.log("Rogue path initialized");
    }

    // Dark Path
    const darkskills = await Skill.find({ category: "Path", path: "Dark" })
        .then(data => data)
        .catch(err => {
            console.log(`Error finding Dark skill data: ${err}`)
        });

    if(darkskills.length <= 0) {
        // Base passive
        const darkPact = await Skill.create({
            name: "Dark Pact",
            category: "Path",
            path: "Dark",
            type: "Passive",
            levelRequirement: 20,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Increase magic damage and magic penetration by 30. Using Path skills reduce user's max. health by 5%.",
            effects: { 
                magicdamage: 30,
                magicpen: 30,
                healthreduct: 5
            },
            prerequisites: []
        });

        // Level 25 skills
        const darkSlash = await Skill.create({
            name: "Dark Slash",
            category: "Path",
            path: "Dark",
            type: "Active",
            levelRequirement: 25,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "A powerful attack infused with dark energy. Remove all buffs from target and reduce their max. energy by 25%.",
            effects: {
                damage: 400,
                energy: 400,
                cooldown: 14,
                buffremove: 100,
                energyreduct: 25
            },
            prerequisites: [darkPact._id]
        });

        const necroticTouch = await Skill.create({
            name: "Necrotic Touch",
            category: "Path",
            path: "Dark",
            type: "Active",
            levelRequirement: 25,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Capture opponent inside a coffin for 3 turns. During this time opponent's healing is blocked and they can not use any skills (Path skills excluded).",
            effects: {
                damage: 600,
                energy: 500,
                cooldown: 16,
                healblock: 100,
                silence: 100,
                turns: 3
            },
            prerequisites: [darkPact._id]
        });

        // Level 30 skills
        const voidWalker = await Skill.create({
            name: "Void Walker",
            category: "Path",
            path: "Dark",
            type: "Passive",
            levelRequirement: 30,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Increase the duration of all buffs by 1 turn. Become immune to burn and fear effects.",
            effects: {
                buffduration: 1,
                burnimmune: 100,
                fearimmune: 100
            },
            prerequisites: [darkPact._id, darkSlash._id, necroticTouch._id]
        });

        const blackout = await Skill.create({
            name: "Blackout",
            category: "Path",
            path: "Dark",
            type: "Active",
            levelRequirement: 30,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Envelop the battlefield in darkness. Reduce all opponents' attack damage by 100 and silence them for 3 turns. (Silenced opponents can not use Path skills)",
            effects: {
                damage: 700,
                energy: 500,
                cooldown: 14,
                attackdamagereduct: 100,
                silence: 100,
                turns: 3
            },
            prerequisites: [darkPact._id, darkSlash._id, necroticTouch._id, voidWalker._id]
        });

        const hauntingVeil = await Skill.create({
            name: "Haunting Veil",
            category: "Path",
            path: "Dark",
            type: "Active",
            levelRequirement: 30,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Haunt an opponent with their worst nightmares. Apply Fear to the opponent for 2 turns. (Feared enemies randomly use any skill).",
            effects: {
                damage: 500,
                energy: 600,
                cooldown: 14,
                fear: 100,
                turns: 2
            },
            prerequisites: [darkPact._id, darkSlash._id, necroticTouch._id, voidWalker._id]
        });

        // Level 35 skills
        const shadowflame = await Skill.create({
            name: "Shadowflame",
            category: "Path",
            path: "Dark",
            type: "Active",
            levelRequirement: 35,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Unleash a fiery blast of dark energy. Gain Debuff Resist and recover 600 health for 3 turns.",
            effects: {
                damage: 0,
                energy: 300,
                cooldown: 16,
                immunestatus: 100,
                health: 600,
                turns: 3
            },
            prerequisites: [darkPact._id, darkSlash._id, necroticTouch._id, voidWalker._id]
        });

        const abyssalStrike = await Skill.create({
            name: "Abyssal Strike",
            category: "Path",
            path: "Dark",
            type: "Active",
            levelRequirement: 35,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Call upon the power of the abyss to strike the opponent. This skill deals high damage, always critically strikes and has 20% chance to stun the opponent for 2 turns. (Stunned opponent can not do any actions)",
            effects: {
                damage: 1000,
                energy: 700,
                cooldown: 14,
                guaranteedcrit: 100,
                stunchance: 20,
                stun: 100,
                turns: 2
            },
            prerequisites: [darkPact._id, darkSlash._id, necroticTouch._id, voidWalker._id]
        });

        // Level 40 skills
        const soulReaper = await Skill.create({
            name: "Soul Reaper",
            category: "Path",
            path: "Dark",
            type: "Passive",
            levelRequirement: 40,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Gain 30% omnivamp. Every 5 turns, user's attack fear an opponent for 1 turn. (Feared enemies randomly use any skill)",
            effects: {
                omnivamp: 30,
                fearturns: 5,
                fear: 100,
                fearduration: 1
            },
            prerequisites: [darkPact._id, darkSlash._id, necroticTouch._id, voidWalker._id, shadowflame._id, abyssalStrike._id]
        });

        const soulDrain = await Skill.create({
            name: "Soul Drain",
            category: "Path",
            path: "Dark",
            type: "Active",
            levelRequirement: 40,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Absorb the soul of the opponent. Drain their 20% current health and energy, and 7 speed. This skill does high damage but can only be used once in battle.",
            effects: {
                damage: 900,
                energy: 1000,
                cooldown: 999,
                healthdrain: 20,
                energydrain: 20,
                speedreduct: 7
            },
            prerequisites: [darkPact._id, darkSlash._id, necroticTouch._id, voidWalker._id, shadowflame._id, abyssalStrike._id, soulReaper._id]
        });

        await Skill.create({
            name: "Death's Embrace",
            category: "Path",
            path: "Dark",
            type: "Active",
            levelRequirement: 40,
            currency: "crystal",
            price: 100,
            spCost: 0,
            maxLevel: 1,
            description: "Sacrifice 20% max. health and energy to turn into a Frenzy state for 3 turns. During Frenzy user gains 700 health shield, 15 armor and magic resist, 15% critical chance, 15 magic damage and 15% omnivamp.",
            effects: {
                damage: 0,
                energy: 0,
                cooldown: 16,
                healthsacrifice: 20,
                energysacrifice: 20,
                shield: 700,
                armor: 15,
                magicresist: 15,
                critchance: 15,
                magicdamage: 15,
                omnivamp: 15,
                turns: 3
            },
            prerequisites: [darkPact._id, darkSlash._id, necroticTouch._id, voidWalker._id, shadowflame._id, abyssalStrike._id, soulReaper._id]
        });

        console.log("Dark path initialized");
    }
    

    // get all skills with max level to 5 and set to 1

    const skills = await Skill.find({ maxLevel: 5 });

    if (skills.length > 0) {
        for (const skill of skills) {
            skill.maxLevel = 1;
            await skill.save();
            
            console.log(`Skill ${skill.name} max level updated to 1`);
        }
    }


    const allCharacters = await CharacterData.find({});


    if (allCharacters.length > 0) {
        for (const character of allCharacters) {
            
            const checktopupcreditwallet = await Characterwallet.findOne({ owner: character._id, type: "topupcredit" })


            if (!checktopupcreditwallet) {
                await Characterwallet.create({ owner: character._id, type: "topupcredit", amount: 0 });

                console.log(`Topup credit wallet created for character ${character.username}`);
            }
            const inventoryListData = ["goldpacks", "crystalpacks", "chests", "freebie"];

            const checkifisininventorylistdata = await CharacterInventory.findOne({ owner: character._id, type: { $in: inventoryListData } });
            
            if (!checkifisininventorylistdata) {
            const inventoryBulkWrite = inventoryListData.map(inventoryData => ({
                insertOne: {
                    document: { owner: character._id, type: inventoryData }
                }
            }));

            await CharacterInventory.bulkWrite(inventoryBulkWrite);

            console.log(`Inventory list data created for character ${character.username}`);
            }

            const checkmonthlylogin = await CharacterMonthlyLogin.findOne({ owner: character._id });

            if (!checkmonthlylogin) {
            
                const daysArray = [];
                for (let i = 1; i <= 28; i++) {
                    daysArray.push({ day: i, loggedIn: false, missed: false, claimed: false });
                }

                await CharacterMonthlyLogin.create({
                    owner: character._id,
                    days: daysArray,
                    totalLoggedIn: 0,
                    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000)
                });

                // await CharacterWeeklyLogin.create({
                //     owner: character._id,
                //     daily: {
                //         day1: false,
                //         day2: false, 
                //         day3: false,
                //         day4: false,
                //         day5: false,
                //         day6: false,
                //         day7: false,
                //     },
                //     currentDay: "day1",
                //     lastClaimed: new Date(Date.now() - 24*60*60*1000)
                // })
        
                // await CharacterDailySpin.create({
                //     owner: character._id,
                //     spin: false,
                //     expspin: false,
                // })

                console.log(`Monthly login, Weekly login and Daily Spin created for character ${character.username}`);
            }

            // initialize chapter challenge per user

            const checkcharacterchapter = await CharacterChapter.findOne({ owner: character._id });

            if (!checkcharacterchapter) {
                const chapterlist = [
                    {
                        owner: character._id,
                        name: "chapter1challenge1",
                        completed: false,
                        chapter: 101
                    },
                    {
                        owner: character._id,
                        name: "chapter1challenge2",
                        completed: false,
                        chapter: 102
                    },
                    {
                        owner: character._id,
                        name: "chapter1challenge3",
                        completed: false,
                        chapter: 103
                    },
                    {
                        owner: character._id,
                        name: "chapter2challenge1",
                        completed: false,
                        chapter: 201
                    },
                    {
                        owner: character._id,
                        name: "chapter2challenge2",
                        completed: false,
                        chapter: 202
                    },
                    {
                        owner: character._id,
                        name: "chapter2challenge3",
                        completed: false,
                        chapter: 203
                    },
                    {
                        owner: character._id,
                        name: "chapter3challenge1",
                        completed: false,
                        chapter: 301
                    },
                    {
                        owner: character._id,
                        name: "chapter3challenge2",
                        completed: false,
                        chapter: 302
                    },
                    {
                        owner: character._id,
                        name: "chapter3challenge3",
                        completed: false,
                        chapter: 303
                    },
                    {
                        owner: character._id,
                        name: "chapter4challenge1",
                        completed: false,
                        chapter: 401
                    },
                    {
                        owner: character._id,
                        name: "chapter4challenge2",
                        completed: false,
                        chapter: 402
                    },
                    {
                        owner: character._id,
                        name: "chapter4challenge3",
                        completed: false,
                        chapter: 403
                    },
                    {
                        owner: character._id,
                        name: "chapter5challenge1",
                        completed: false,
                        chapter: 501
                    },
                    {
                        owner: character._id,
                        name: "chapter5challenge2",
                        completed: false,
                        chapter: 502
                    },
                    {
                        owner: character._id,
                        name: "chapter5challenge3",
                        completed: false,
                        chapter: 503
                    },
                    {
                        owner: character._id,
                        name: "chapter6challenge1",
                        completed: false,
                        chapter: 601
                    },
                    {
                        owner: character._id,
                        name: "chapter6challenge2",
                        completed: false,
                        chapter: 602
                    },
                    {
                        owner: character._id,
                        name: "chapter6challenge3",
                        completed: false,
                        chapter: 603
                    },
                    {
                        owner: character._id,
                        name: "chapter7challenge1",
                        completed: false,
                        chapter: 701
                    },
                    {
                        owner: character._id,
                        name: "chapter7challenge2",
                        completed: false,
                        chapter: 702
                    },
                    {
                        owner: character._id,
                        name: "chapter7challenge3",
                        completed: false,
                        chapter: 703
                    },
                    {
                        owner: character._id,
                        name: "chapter8challenge1",
                        completed: false,
                        chapter: 801
                    },
                    {
                        owner: character._id,
                        name: "chapter8challenge2",
                        completed: false,
                        chapter: 802
                    },
                    {
                        owner: character._id,
                        name: "chapter8challenge3",
                        completed: false,
                        chapter: 803
                    },
                    {
                        owner: character._id,
                        name: "chapter9challenge1",
                        completed: false,
                        chapter: 901
                    },
                    {
                        owner: character._id,
                        name: "chapter9challenge2",
                        completed: false,
                        chapter: 902
                    },
                    {
                        owner: character._id,
                        name: "chapter9challenge3",
                        completed: false,
                        chapter: 903
                    },
                    {
                        owner: character._id,
                        name: "chapter10challenge1",
                        completed: false,
                        chapter: 1001
                    },
                    {
                        owner: character._id,
                        name: "chapter10challenge2",
                        completed: false,
                        chapter: 1002
                    },
                    {
                        owner: character._id,
                        name: "chapter10challenge3",
                        completed: false,
                        chapter: 1003
                    },
                    {
                        owner: character._id,
                        name: "chapter11challenge1",
                        completed: false,
                        chapter: 1101
                    },
                    {
                        owner: character._id,
                        name: "chapter11challenge2",
                        completed: false,
                        chapter: 1102
                    },
                    {
                        owner: character._id,
                        name: "chapter11challenge3",
                        completed: false,
                        chapter: 1103
                    },
                    {
                        owner: character._id,
                        name: "chapter12challenge1",
                        completed: false,
                        chapter: 1201
                    },
                    {
                        owner: character._id,
                        name: "chapter12challenge2",
                        completed: false,
                        chapter: 1202
                    },
                    {
                        owner: character._id,
                        name: "chapter12challenge3",
                        completed: false,
                        chapter: 1203
                    },
                    {
                        owner: character._id,
                        name: "chapter13challenge1",
                        completed: false,
                        chapter: 1301
                    },
                    {
                        owner: character._id,
                        name: "chapter13challenge2",
                        completed: false,
                        chapter: 1302
                    },
                    {
                        owner: character._id,
                        name: "chapter13challenge3",
                        completed: false,
                        chapter: 1303
                    },
                    {
                        owner: character._id,
                        name: "chapter14challenge1",
                        completed: false,
                        chapter: 1401
                    },
                    {
                        owner: character._id,
                        name: "chapter14challenge2",
                        completed: false,
                        chapter: 1402
                    },
                    {
                        owner: character._id,
                        name: "chapter14challenge3",
                        completed: false,
                        chapter: 1403
                    },
                ]

                await CharacterChapter.insertMany(chapterlist)
                console.log(`Chapter challenge created for character ${character.username}`);
            }
        }
    }

    const market = await Market.find()
    .then(data => data)
    .catch(err => {
        console.log(`Error finding market data: ${err}`)
    })

    if (market.length <= 0) {
        try {
            // Fetch all items again to ensure we have the latest data
            const availableItems = await Item.find();
            
            if (!availableItems || availableItems.length === 0) {
                console.log("No items available to create market");
                return;
            }

            // Create initial market with all available items
            const newMarket = await Market.create({
                items: availableItems,
                marketType: "market",
                lastUpdated: new Date()
            });


            await Market.create({ marketType: "shop", items: [] });

            if (newMarket) {
                console.log("Market initialized successfully with", availableItems.length, "items");
            }
        } catch (err) {
            console.log(`Error creating market: ${err}`);
            return;
        }
    } 

    // initialize rank tiers 

    const ranktierz = [
    {  
        name: "Rookie",
        requiredmmr: 0,
        icon: ""
    },
    {
        name: "Veteran",
        requiredmmr: 1800,
        icon: ""
    },
    {
        name: "Elder",
        requiredmmr: 3600,
        icon: ""
    },
    {
        name: "Ronin",
        requiredmmr: 5400,
        icon: ""
    },
    {
        name: "Shogun",
        requiredmmr: 7200,
        icon: ""
    },
    {
        name: "Ace",
        requiredmmr: 9000,
        icon: ""
    }
    ]

    const ranktiers = await RankTier.find({})
    .then(data => data)
    .catch(err => {
        console.log(`Error finding rank tiers: ${err}`)
    })

    if (ranktiers.length <= 0) {
        for (const rank of ranktierz) {
            await RankTier.create(rank)
            console.log(`Rank tier ${rank.name} created`)
        }
    }


            // initialize daily spin, exp spin, weekly login, monthly login, and rewards data

            const dailyexpspin = await DailyExpSpin.find()
            if(dailyexpspin.length <= 0) {
                const dailyExpBulkWrite = [
                {
                    slot: 1,
                    type: "exp",
                    amount: 5000,
                    chance: 30
                },
                {
                    slot: 2,
                    type: "exp", 
                    amount: 7500,
                    chance: 25
                },
                {
                    slot: 3,
                    type: "exp",
                    amount: 10000,
                    chance: 15
                },
                {
                    slot: 4,
                    type: "exp",
                    amount: 12500,
                    chance: 10
                },
                {
                    slot: 5,
                    type: "exp",
                    amount: 15000,
                    chance: 8
                },
                {
                    slot: 6,
                    type: "exp",
                    amount: 20000,
                    chance: 6
                },
                {
                    slot: 7,
                    type: "exp",
                    amount: 25000,
                    chance: 4
                },
                {
                    slot: 8,
                    type: "exp",
                    amount: 30000,
                    chance: 2
                }
                ].map(spin => ({
                insertOne: {
                    document: spin
                }
                }));
    
                await DailyExpSpin.bulkWrite(dailyExpBulkWrite)
                .catch(err => {
                console.log(`Error saving daily spin data: ${err}`)
                return
                })
    
                console.log("Daily Exp Spin initialized")
            }
            const dailyspin = await DailySpin.find()
            if(dailyspin.length <= 0) {
                const dailySpinBulkWrite = [
                {
                    slot: 1,
                    type: "coins",
                    amount: 1000,
                    chance: 30
                },
                {
                    slot: 2,
                    type: "coins",
                    amount: 2000, 
                    chance: 25
                },
                {
                    slot: 3,
                    type: "coins",
                    amount: 3000,
                    chance: 15
                },
                {
                    slot: 4,
                    type: "coins",
                    amount: 4000,
                    chance: 10
                },
                {
                    slot: 5,
                    type: "crystal",
                    amount: 50,
                    chance: 8
                },
                {
                    slot: 6,
                    type: "crystal",
                    amount: 100,
                    chance: 6
                },
                {
                    slot: 7,
                    type: "crystal", 
                    amount: 150,
                    chance: 4
                },
                {
                    slot: 8,
                    type: "crystal",
                    amount: 200,
                    chance: 2
                }
                ].map(spin => ({
                insertOne: {
                    document: spin
                }
                }));
    
                await DailySpin.bulkWrite(dailySpinBulkWrite)
                .catch(err => {
                console.log(`Error saving daily spin data: ${err}`)
                return
                })
    
                console.log("Daily Spin initialized")
            }
    
            const weeklylogin = await WeeklyLogin.find()
            if(weeklylogin.length <= 0) {
                const weeklyLoginBulkWrite = [
                {
                    day: "day1",
                    type: "exp",
                    amount: 10000
                },
                {
                    day: "day2", 
                    type: "coins",
                    amount: 5000
                },
                {
                    day: "day3",
                    type: "exp",
                    amount: 15000
                },
                {
                    day: "day4",
                    type: "coins",
                    amount: 7500
                },
                {
                    day: "day5",
                    type: "crystal",
                    amount: 100
                },
                {
                    day: "day6",
                    type: "exp",
                    amount: 20000
                },
                {
                    day: "day7",
                    type: "crystal",
                    amount: 200
                }
                ].map(login => ({
                insertOne: {
                    document: login
                }
                }));
    
                await WeeklyLogin.bulkWrite(weeklyLoginBulkWrite)
                .catch(err => {
                console.log(`Error saving weekly login data: ${err}`)
                return
                })
    
                console.log("Weekly Login initialized")
            }
    
            const monthlylogin = await MonthlyLogin.find()
            if(monthlylogin.length <= 0) {
                const monthlyLoginBulkWrite = [
                    {
                        day: "day1",
                        type: "exp", 
                        amount: 20000
                    },
                    {
                        day: "day5",
                        type: "crystal",
                        amount: 500
                    },
                    {
                        day: "day10",
                        type: "coins",
                        amount: 50000
                    },
                    {
                        day: "day15",
                        type: "crystal",
                        amount: 100
                    },
                    {
                        day: "day20",
                        type: "coins",
                        amount: 100000
                    },
                    {
                        day: "day25",
                        type: "exp",
                        amount: 50000
                    },
                ].map(login => ({
                    insertOne: {
                        document: login
                    }
                }));
    
                await MonthlyLogin.bulkWrite(monthlyLoginBulkWrite)
                .catch(err => {
                    console.log(`Error saving monthly login data: ${err}`)
                    return
                })
    
                console.log("Monthly Login initialized")
            }
    
    

        

        // initialize battlepass data

        const battlepass = await BattlepassSeason.find({})

        if (battlepass.length <= 0) {
            
            const battlepassData = [
            {
                seasonName: "Battlepass Season 1", 
                tierCount: 50,
                premiumCost: 1000,
                currency: "crystal",
                status: "active",
                freeMissions: [
                {
                    missionName: "Win 3 PvP Matches",
                    description: "Win 3 matches in PvP mode.",
                    xpReward: 500,
                    requirements: { wins: 3 },
                    daily: false
                },
                {
                    missionName: "Complete 5 Daily Quests",
                    description: "Complete 5 daily quests.",
                    xpReward: 700,
                    requirements: { dailyQuests: 5 },
                    daily: false
                },
                {
                    missionName: "Defeat 10 Enemies",
                    description: "Defeat 10 enemies in any mode.",
                    xpReward: 300,
                    requirements: { enemiesDefeated: 10 },
                    daily: true
                }
                ],
                premiumMissions: [
                {
                    missionName: "Win 10 PvP Matches",
                    description: "Win 10 matches in PvP mode.", 
                    xpReward: 1000,
                    requirements: { wins: 10 },
                    daily: false
                },
                {
                    missionName: "Spend 500 Crystals",
                    description: "Spend 500 crystals in the shop.",
                    xpReward: 1200,
                    requirements: { crystalsSpent: 500 },
                    daily: false
                },
                {
                    missionName: "Complete 3 Raids",
                    description: "Complete 3 raid battles.",
                    xpReward: 800,
                    requirements: { raidsCompleted: 3 },
                    daily: true
                }
                ],
                tiers: [
                    {
                        tierNumber: 1,
                        freeReward: { type: "coins", amount: 500 },
                        premiumReward: { type: "coins", amount: 1000 },
                        xpRequired: 1000
                    },
                    {
                        tierNumber: 2, 
                        freeReward: { type: "exp", amount: 1000 },
                        premiumReward: { type: "exp", amount: 2000 },
                        xpRequired: 2000
                    },
                    {
                        tierNumber: 3,
                        freeReward: { type: "crystal", amount: 25 },
                        premiumReward: { type: "crystal", amount: 50 },
                        xpRequired: 3000
                    },
                    {
                        tierNumber: 4,
                        freeReward: { type: "coins", amount: 1000 },
                        premiumReward: { type: "coins", amount: 2000 },
                        xpRequired: 4000
                    },
                    {
                        tierNumber: 5,
                        freeReward: { type: "exp", amount: 1500 },
                        premiumReward: { type: "exp", amount: 3000 },
                        xpRequired: 5000
                    },
                    {
                        tierNumber: 6,
                        freeReward: { type: "crystal", amount: 35 },
                        premiumReward: { type: "crystal", amount: 70 },
                        xpRequired: 6000
                    },
                    {
                        tierNumber: 7,
                        freeReward: { type: "coins", amount: 1500 },
                        premiumReward: { type: "coins", amount: 3000 },
                        xpRequired: 7000
                    },
                    {
                        tierNumber: 8,
                        freeReward: { type: "exp", amount: 2000 },
                        premiumReward: { type: "exp", amount: 4000 },
                        xpRequired: 8000
                    },
                    {
                        tierNumber: 9,
                        freeReward: { type: "crystal", amount: 50 },
                        premiumReward: { type: "crystal", amount: 100 },
                        xpRequired: 9000
                    },
                    {
                        tierNumber: 10,
                        freeReward: { type: "coins", amount: 2000 },
                        premiumReward: { type: "coins", amount: 4000 },
                        xpRequired: 10000
                    },
                    {
                        tierNumber: 11,
                        freeReward: { type: "exp", amount: 2500 },
                        premiumReward: { type: "exp", amount: 5000 },
                        xpRequired: 11000
                    },
                    {
                        tierNumber: 12,
                        freeReward: { type: "crystal", amount: 60 },
                        premiumReward: { type: "crystal", amount: 120 },
                        xpRequired: 12000
                    },
                    {
                        tierNumber: 13,
                        freeReward: { type: "coins", amount: 2500 },
                        premiumReward: { type: "coins", amount: 5000 },
                        xpRequired: 13000
                    },
                    {
                        tierNumber: 14,
                        freeReward: { type: "exp", amount: 3000 },
                        premiumReward: { type: "exp", amount: 6000 },
                        xpRequired: 14000
                    },
                    {
                        tierNumber: 15,
                        freeReward: { type: "crystal", amount: 75 },
                        premiumReward: { type: "crystal", amount: 150 },
                        xpRequired: 15000
                    },
                    {
                        tierNumber: 16,
                        freeReward: { type: "coins", amount: 3000 },
                        premiumReward: { type: "coins", amount: 6000 },
                        xpRequired: 16000
                    },
                    {
                        tierNumber: 17,
                        freeReward: { type: "exp", amount: 3500 },
                        premiumReward: { type: "exp", amount: 7000 },
                        xpRequired: 17000
                    },
                    {
                        tierNumber: 18,
                        freeReward: { type: "crystal", amount: 85 },
                        premiumReward: { type: "crystal", amount: 170 },
                        xpRequired: 18000
                    },
                    {
                        tierNumber: 19,
                        freeReward: { type: "coins", amount: 3500 },
                        premiumReward: { type: "coins", amount: 7000 },
                        xpRequired: 19000
                    },
                    {
                        tierNumber: 20,
                        freeReward: { type: "exp", amount: 4000 },
                        premiumReward: { type: "exp", amount: 8000 },
                        xpRequired: 20000
                    },
                    {
                        tierNumber: 21,
                        freeReward: { type: "crystal", amount: 100 },
                        premiumReward: { type: "crystal", amount: 200 },
                        xpRequired: 21000
                    },
                    {
                        tierNumber: 22,
                        freeReward: { type: "coins", amount: 4000 },
                        premiumReward: { type: "coins", amount: 8000 },
                        xpRequired: 22000
                    },
                    {
                        tierNumber: 23,
                        freeReward: { type: "exp", amount: 4500 },
                        premiumReward: { type: "exp", amount: 9000 },
                        xpRequired: 23000
                    },
                    {
                        tierNumber: 24,
                        freeReward: { type: "crystal", amount: 110 },
                        premiumReward: { type: "crystal", amount: 220 },
                        xpRequired: 24000
                    },
                    {
                        tierNumber: 25,
                        freeReward: { type: "coins", amount: 4500 },
                        premiumReward: { type: "coins", amount: 9000 },
                        xpRequired: 25000
                    },
                    {
                        tierNumber: 26,
                        freeReward: { type: "exp", amount: 5000 },
                        premiumReward: { type: "exp", amount: 10000 },
                        xpRequired: 26000
                    },
                    {
                        tierNumber: 27,
                        freeReward: { type: "crystal", amount: 125 },
                        premiumReward: { type: "crystal", amount: 250 },
                        xpRequired: 27000
                    },
                    {
                        tierNumber: 28,
                        freeReward: { type: "coins", amount: 5000 },
                        premiumReward: { type: "coins", amount: 10000 },
                        xpRequired: 28000
                    },
                    {
                        tierNumber: 29,
                        freeReward: { type: "exp", amount: 5500 },
                        premiumReward: { type: "exp", amount: 11000 },
                        xpRequired: 29000
                    },
                    {
                        tierNumber: 30,
                        freeReward: { type: "crystal", amount: 135 },
                        premiumReward: { type: "crystal", amount: 270 },
                        xpRequired: 30000
                    },
                    {
                        tierNumber: 31,
                        freeReward: { type: "coins", amount: 5500 },
                        premiumReward: { type: "coins", amount: 11000 },
                        xpRequired: 31000
                    },
                    {
                        tierNumber: 32,
                        freeReward: { type: "exp", amount: 6000 },
                        premiumReward: { type: "exp", amount: 12000 },
                        xpRequired: 32000
                    },
                    {
                        tierNumber: 33,
                        freeReward: { type: "crystal", amount: 150 },
                        premiumReward: { type: "crystal", amount: 300 },
                        xpRequired: 33000
                    },
                    {
                        tierNumber: 34,
                        freeReward: { type: "coins", amount: 6000 },
                        premiumReward: { type: "coins", amount: 12000 },
                        xpRequired: 34000
                    },
                    {
                        tierNumber: 35,
                        freeReward: { type: "exp", amount: 6500 },
                        premiumReward: { type: "exp", amount: 13000 },
                        xpRequired: 35000
                    },
                    {
                        tierNumber: 36,
                        freeReward: { type: "crystal", amount: 160 },
                        premiumReward: { type: "crystal", amount: 320 },
                        xpRequired: 36000
                    },
                    {
                        tierNumber: 37,
                        freeReward: { type: "coins", amount: 6500 },
                        premiumReward: { type: "coins", amount: 13000 },
                        xpRequired: 37000
                    },
                    {
                        tierNumber: 38,
                        freeReward: { type: "exp", amount: 7000 },
                        premiumReward: { type: "exp", amount: 14000 },
                        xpRequired: 38000
                    },
                    {
                        tierNumber: 39,
                        freeReward: { type: "crystal", amount: 175 },
                        premiumReward: { type: "crystal", amount: 350 },
                        xpRequired: 39000
                    },
                    {
                        tierNumber: 40,
                        freeReward: { type: "coins", amount: 7000 },
                        premiumReward: { type: "coins", amount: 14000 },
                        xpRequired: 40000
                    },
                    {
                        tierNumber: 41,
                        freeReward: { type: "exp", amount: 7500 },
                        premiumReward: { type: "exp", amount: 15000 },
                        xpRequired: 41000
                    },
                    {
                        tierNumber: 42,
                        freeReward: { type: "crystal", amount: 185 },
                        premiumReward: { type: "crystal", amount: 370 },
                        xpRequired: 42000
                    },
                    {
                        tierNumber: 43,
                        freeReward: { type: "coins", amount: 7500 },
                        premiumReward: { type: "coins", amount: 15000 },
                        xpRequired: 43000
                    },
                    {
                        tierNumber: 44,
                        freeReward: { type: "exp", amount: 8000 },
                        premiumReward: { type: "exp", amount: 16000 },
                        xpRequired: 44000
                    },
                    {
                        tierNumber: 45,
                        freeReward: { type: "crystal", amount: 200 },
                        premiumReward: { type: "crystal", amount: 400 },
                        xpRequired: 45000
                    },
                    {
                        tierNumber: 46,
                        freeReward: { type: "coins", amount: 8000 },
                        premiumReward: { type: "coins", amount: 16000 },
                        xpRequired: 46000
                    },
                    {
                        tierNumber: 47,
                        freeReward: { type: "exp", amount: 8500 },
                        premiumReward: { type: "exp", amount: 17000 },
                        xpRequired: 47000
                    },
                    {
                        tierNumber: 48,
                        freeReward: { type: "crystal", amount: 210 },
                        premiumReward: { type: "crystal", amount: 420 },
                        xpRequired: 48000
                    },
                    {
                        tierNumber: 49,
                        freeReward: { type: "coins", amount: 8500 },
                        premiumReward: { type: "coins", amount: 17000 },
                        xpRequired: 49000
                    },
                    {
                        tierNumber: 50,
                        freeReward: { type: "crystal", amount: 250 },
                        premiumReward: { type: "crystal", amount: 500 },
                        xpRequired: 50000
                    }
                ],
                startDate: new Date(),
                // end date 2 months from now
                endDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),            
            }
            ]

            await BattlepassSeason.insertMany(battlepassData)
            console.log("Battlepass data initialized")
        }


        // Initialize battlepass progress and missions for each user
        for (const character of allCharacters) {
            // Initialize battlepass progress
            const battlepassProgress = await BattlepassProgress.find({ owner: character._id })
            if (battlepassProgress.length <= 0) {
            await BattlepassProgress.create({
                owner: character._id,
                season: battlepass[0]._id, 
                currentTier: 1,
                currentXP: 0,
                hasPremium: false,
                claimedRewards: []
            })
            console.log(`Battlepass progress created for character ${character.username}`)
            }

            // Initialize missions for the user
            if (battlepass && battlepass[0]) {
            // Initialize free missions
            for (const mission of battlepass[0].freeMissions) {
                await BattlepassMissionProgress.findOneAndUpdate(
                {
                    owner: character._id,
                    season: battlepass[0]._id,
                    missionName: mission.missionName,
                    type: "free"
                },
                {
                    $setOnInsert: {
                    missionId: new mongoose.Types.ObjectId(),
                    progress: 0,
                    isCompleted: false,
                    isLocked: false,
                    daily: mission.daily,
                    lastUpdated: new Date()
                    }
                },
                {
                    upsert: true,
                    new: true
                }
                );
            }

            // Initialize premium missions
            for (const mission of battlepass[0].premiumMissions) {
                await BattlepassMissionProgress.findOneAndUpdate(
                {
                    owner: character._id,
                    season: battlepass[0]._id,
                    missionName: mission.missionName,
                    type: "premium"
                },
                {
                    $setOnInsert: {
                    missionId: new mongoose.Types.ObjectId(),
                    progress: 0,
                    isCompleted: false,
                    isLocked: true, // Premium missions start locked
                    daily: mission.daily,
                    lastUpdated: new Date()
                    }
                },
                {
                    upsert: true,
                    new: true
                }
                );
            }
            }
        }

    console.log("SERVER DATA INITIALIZED")
}
