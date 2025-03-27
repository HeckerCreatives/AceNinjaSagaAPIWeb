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

exports.initialize = async () => {
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

    const allPlayers = await Rankings.find();

    if (allPlayers.length === 0) {
        console.log("No players found.");
        return;
    }

    const rankTiers = await RankTier.find().sort({ requiredmmr: 1 }); // Sort ranks by required MMR

    if (rankTiers.length === 0) {
        console.log("No rank tiers found. Cannot update player ranks.");
        return;
    }

    for (const player of allPlayers) {
        let assignedRank = null; // Start with no rank

        if(player.rank === null || player.rank === undefined){
            for (const tier of rankTiers) {
                const tierMMR = parseInt(tier.requiredmmr, 10); // Ensure number comparison
                
                if (player.mmr >= tierMMR) {
                    assignedRank = tier; // Assign highest eligible rank
                } else {
                    break; // Stop once the player MMR is below a rank
                }
            }
            
            // Ensure unranked players get "Unranked"
            if (!assignedRank) {
                assignedRank = rankTiers.find(tier => tier.name === "Unranked");
            }
            
            // Update only if necessary
            if (
                !player.rank || 
                player.rank.toString() !== assignedRank._id.toString() || 
                !player.season || 
                player.season.toString() !== currentSeason._id.toString()
            ) {
                await Rankings.updateOne(
                    { _id: player._id },
                    { 
                        $set: { 
                            rank: assignedRank._id,
                            season: currentSeason._id 
                        } 
                    }
                );
            }
            console.log("All player season ranks updated successfully!");
        }
    }



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

   
    // initialize companions

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


    
    console.log("SERVER DATA INITIALIZED")
}