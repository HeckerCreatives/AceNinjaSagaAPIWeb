const Maintenance = require("../models/Maintenance")
const Staffusers = require("../models/Staffusers")
const Users = require("../models/Users")
const Rankings = require("../models/Ranking")
const RankTier = require("../models/RankTier")
const Season = require("../models/Season")
const Downloadlinks = require("../models/Downloadlinks")
const { default: mongoose } = require("mongoose")


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

    console.log("Updating player ranks based on MMR...");
    const rankTiers = await RankTier.find().sort({ requiredmmr: 1 }); // Sort ranks by required MMR

    if (rankTiers.length === 0) {
        console.log("No rank tiers found. Cannot update player ranks.");
        return;
    }

    for (const player of allPlayers) {
        let assignedRank = null; // Start with no rank

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
    }

    console.log("All player season ranks updated successfully!");


    //Download links
    const defaultLinks = [
        { link: "https://play.google.com/store/apps/details?id=com.example.app", title: "Playstore", type: "android" },
        { link: "https://apps.apple.com/us/app/example-app/id123456789", title: "Appstore", type: "ios" },
        { link: "https://store.steampowered.com/app/123456/ExampleGame", title: "Steam", type: "pc" }
    ];

    const existingDownloadLinks = await Downloadlinks.countDocuments();
    if (existingDownloadLinks > 0) {
        console.log("Download links already initialized.");
        return;
    } else {
        await Downloadlinks.insertMany(defaultLinks);

    }

   


    
    console.log("SERVER DATA INITIALIZED")
}