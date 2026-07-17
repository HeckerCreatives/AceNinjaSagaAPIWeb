const { default: mongoose } = require("mongoose")
const Users = require("../models/Users")
const CharacterData = require("../models/Characterdata")
const CharacterStats = require("../models/Characterstats")
const Characterwallet = require("../models/Characterwallet")
const TierAvailability = require("../models/TierAvailability")
const RankTier = require("../models/RankTier")
const Season = require("../models/Season")
const PvpStats = require("../models/PvpStats")
const RaidbossFight = require("../models/Raidbossfight")
const { Rankings } = require("../models/Ranking")
const { Item, CharacterInventory } = require("../models/Market")
const { CharacterSkillTree } = require("../models/Skills")
const { Companion, CharacterCompanionUnlocked } = require("../models/Companion")
const { CharacterChapter } = require("../models/Chapter")
const { BattlepassSeason, BattlepassProgress, BattlepassMissionProgress } = require("../models/Battlepass")
const { QuestDetails, QuestProgress } = require("../models/Quest")
const { CharacterMonthlyLogin, CharacterWeeklyLogin, CharacterDailySpin } = require("../models/Rewards")
const { chapterlistdata } = require("../data/datainitialization")
const { gethairname } = require("../utils/bundle")
const { getLevelBasedStats } = require("../utils/character")

// Developer & founder accounts. Custom IDs 1-9 are the platinum VIP tier —
// the rarest character IDs in the game, shown on the website user dashboard.
const DEV_ACCOUNTS = [
    { username: "devaccount1", password: "dev123456", customid: 1, charactername: "ErardCane", gender: 0 },
    { username: "devaccount2", password: "dev123456", customid: 2, charactername: "Guja", gender: 0 },
    { username: "devaccount3", password: "dev123456", customid: 3, charactername: "Ganielle", gender: 0 },
    { username: "devaccount4", password: "dev123456", customid: 4, charactername: "BellaMona", gender: 1 },
    { username: "devaccount5", password: "dev123456", customid: 5, charactername: "Concierge", gender: 1 },
    { username: "devaccount6", password: "dev123456", customid: 6, charactername: "PrinceSeiker", gender: 1 },
    { username: "devaccount7", password: "dev123456", customid: 7, charactername: "Yato", gender: 1 },
    { username: "devaccount8", password: "dev123456", customid: 8, charactername: "Claymist", gender: 1 },
    { username: "devaccount9", password: "dev123456", customid: 9, charactername: "YahiCakes", gender: 1 },
]

// Same option pools the in-game character creation screen randomizes across:
// 6 basic attires (outfit 0-5), 6 basic ninja hairstyles (hair-001..hair-006),
// 5 eyes, 5 face details, and 5 skin colors per gender.
const randomInt = (max) => Math.floor(Math.random() * max)

const randomizeAppearance = () => ({
    outfit: randomInt(6),
    hair: `hair-00${randomInt(6) + 1}`,
    eyes: randomInt(5),
    facedetails: randomInt(5),
    color: randomInt(5),
})

exports.initializeDevAccounts = async () => {
    try {
        const rookietier = await RankTier.findOne({ name: "Rookie" })
        const currentseason = await Season.findOne({ isActive: "active" })
        const allCompanions = await Companion.find().lean()
        const questdetails = await QuestDetails.find().lean()

        const currentdate = new Date()
        let battlepassSeason = await BattlepassSeason.findOne({
            startDate: { $lte: currentdate },
            endDate: { $gte: currentdate }
        }).lean()
        if (!battlepassSeason) {
            battlepassSeason = await BattlepassSeason.findOne().lean()
        }

        for (const account of DEV_ACCOUNTS) {
            const existinguser = await Users.findOne({ username: account.username })
            if (existinguser) {
                continue
            }

            const existingcharacter = await CharacterData.findOne({
                $or: [
                    { customid: account.customid },
                    { username: { $regex: new RegExp('^' + account.charactername + '$', 'i') } }
                ],
                status: { $ne: "deleted" }
            })
            if (existingcharacter) {
                console.log(`[Dev Accounts] Skipping ${account.username}: custom ID ${account.customid} or character name ${account.charactername} already taken.`)
                continue
            }

            // Create the user account (password hashed by the Users pre-save hook)
            const user = await Users.create({
                username: account.username,
                password: account.password,
                email: `${account.username}@aceninjapath.com`,
                status: "active",
                webtoken: "",
                gametoken: "",
                bandate: "",
                banreason: "",
                auth: "player",
                slotsunlocked: [1]
            })

            // Randomize the character skin the same way the in-game creator does
            const appearance = randomizeAppearance()

            const searchgender = account.gender === 0 ? `Male Basic Attire ${appearance.outfit + 1}` : `Female Basic Attire ${appearance.outfit + 1}`
            const outfititem = await Item.findOne({ name: searchgender })
            const hairitem = await Item.findOne({ name: gethairname(appearance.hair, account.gender) })

            if (!outfititem || !hairitem) {
                console.log(`[Dev Accounts] Skipping ${account.username}: outfit/hair items not initialized yet.`)
                await Users.deleteOne({ _id: user._id })
                continue
            }

            const character = await CharacterData.create({
                owner: user._id,
                customid: account.customid, // platinum-tier founder ID (1-9)
                username: account.charactername,
                gender: account.gender,
                outfit: appearance.outfit,
                hair: appearance.hair,
                eyes: appearance.eyes,
                facedetails: appearance.facedetails,
                color: appearance.color,
                title: 0,
                experience: 0,
                level: 1,
                badge: 0,
                itemindex: 1,
                slotIndex: 1,
                vipTier: "platinum"
            })

            const characterId = character._id

            await CharacterStats.create({
                owner: characterId,
                ...getLevelBasedStats(1)
            })

            if (rookietier && currentseason) {
                await Rankings.create({
                    owner: characterId,
                    mmr: 0,
                    rank: rookietier._id,
                    season: currentseason._id
                })
            }

            await CharacterSkillTree.create({
                owner: characterId,
                skillPoints: 0,
                skills: [],
                unlockedSkills: []
            })

            const walletListData = ["coins", "crystal", "topupcredit"]
            await Characterwallet.bulkWrite(walletListData.map(walletData => ({
                insertOne: {
                    document: { owner: characterId, type: walletData, amount: "0" }
                }
            })))

            const inventoryListData = ["weapon", "outfit", "hair", "face", "eyes", "skincolor", "skins", "goldpacks", "crystalpacks", "chests", "freebie", "packs"]
            await CharacterInventory.bulkWrite(inventoryListData.map(inventoryData => ({
                insertOne: {
                    document: { owner: characterId, type: inventoryData }
                }
            })))

            await CharacterInventory.findOneAndUpdate(
                { owner: characterId, type: "outfit" },
                {
                    $push: {
                        items: {
                            item: outfititem._id,
                            quantity: 1,
                            isEquipped: true,
                            acquiredAt: new Date()
                        }
                    }
                }
            )

            await CharacterInventory.findOneAndUpdate(
                { owner: characterId, type: "hair" },
                {
                    $push: {
                        items: {
                            item: hairitem._id,
                            quantity: 1,
                            isEquipped: true,
                            acquiredAt: new Date()
                        }
                    }
                }
            )

            const chapterlist = chapterlistdata.map(chapter => ({
                owner: characterId,
                name: chapter.name,
                completed: chapter.completed,
                chapter: chapter.chapter
            }))
            await CharacterChapter.insertMany(chapterlist)

            if (battlepassSeason) {
                await BattlepassProgress.create({
                    owner: characterId,
                    season: battlepassSeason._id,
                    currentTier: 1,
                    currentXP: 0,
                    hasPremium: false,
                    claimedRewards: []
                })

                for (const mission of battlepassSeason.freeMissions) {
                    const requirementType = Object.keys(mission.requirements)[0]

                    await BattlepassMissionProgress.create({
                        owner: characterId,
                        season: battlepassSeason._id,
                        missionName: mission.missionName,
                        requirementtype: requirementType,
                        type: "free",
                        missionId: new mongoose.Types.ObjectId(mission._id),
                        progress: 0,
                        isCompleted: false,
                        isLocked: false,
                        daily: mission.daily,
                        lastUpdated: new Date()
                    })
                }

                for (const mission of battlepassSeason.premiumMissions) {
                    const requirementType = Object.keys(mission.requirements)[0]

                    await BattlepassMissionProgress.create({
                        owner: characterId,
                        season: battlepassSeason._id,
                        missionName: mission.missionName,
                        type: "premium",
                        missionId: new mongoose.Types.ObjectId(mission._id),
                        requirementtype: requirementType,
                        progress: 0,
                        isCompleted: false,
                        isLocked: true, // Premium missions start locked
                        daily: mission.daily,
                        lastUpdated: new Date()
                    })
                }
            }

            for (const mission of questdetails) {
                const requirementType = Object.keys(mission.requirements)[0]

                await QuestProgress.create({
                    owner: characterId,
                    quest: new mongoose.Types.ObjectId(mission._id),
                    requirementtype: requirementType,
                    progress: 0,
                    isCompleted: false,
                    daily: mission.daily,
                    lastUpdated: new Date()
                })
            }

            const daysArray = []
            for (let i = 1; i <= 28; i++) {
                daysArray.push({ day: i, loggedIn: false, missed: false, claimed: false })
            }

            await CharacterMonthlyLogin.create({
                owner: characterId,
                days: daysArray,
                totalLoggedIn: 0,
                lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000),
                currentDay: new Date().getDate()
            })

            const now = new Date()
            const dayOfWeek = now.getDay()
            const dayNumber = dayOfWeek === 0 ? 7 : dayOfWeek

            await CharacterWeeklyLogin.create({
                owner: characterId,
                daily: {
                    day1: false,
                    day2: false,
                    day3: false,
                    day4: false,
                    day5: false,
                    day6: false,
                    day7: false,
                },
                currentDay: `day${dayNumber}`,
                lastClaimed: new Date(Date.now() - 24 * 60 * 60 * 1000)
            })

            await CharacterDailySpin.create({
                owner: characterId,
                spin: true,
                expspin: true,
            })

            if (allCompanions.length > 0) {
                await CharacterCompanionUnlocked.bulkWrite(allCompanions.map(companion => ({
                    insertOne: {
                        document: {
                            owner: characterId,
                            companion: companion._id,
                            isLocked: companion.name === "Blaze" || companion.name === "Shade" ? true : false,
                        }
                    }
                })))
            }

            await PvpStats.create({
                owner: characterId,
                win: 0,
                lose: 0,
                totalMatches: 0,
                winRate: 0,
                rank: new mongoose.Types.ObjectId("684ce1f4c61e8f1dd3ba04fa") // Default rank ID, adjust as necessary
            })

            await RaidbossFight.create({
                owner: new mongoose.Types.ObjectId(characterId),
                status: "notdone"
            })

            // Claim the platinum founder ID in the VIP tier availability ledger
            await TierAvailability.findOneAndUpdate(
                { tier: "platinum" },
                {
                    $pull: { available: account.customid },
                    $addToSet: { taken: account.customid }
                }
            )

            await Users.findOneAndUpdate(
                { _id: user._id },
                {
                    $push: {
                        vipHistory: {
                            characterId: characterId,
                            oldCustomId: account.customid,
                            newCustomId: account.customid,
                            tier: "platinum",
                            transactionId: `founder_seed_${account.customid}`,
                            purchaseDate: new Date()
                        }
                    }
                }
            )

            console.log(`[Dev Accounts] Founder account ${account.username} created — character ${account.charactername} with platinum ID #${account.customid}`)
        }
    } catch (error) {
        console.log(`Error initializing dev accounts: ${error}`)
    }
}
