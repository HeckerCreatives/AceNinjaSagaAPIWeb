const { is } = require("date-fns/locale")
const { default: mongoose } = require("mongoose")

// #region WEAPONS
exports.weaponData = [
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495bc"),
        name: "Basic Sword",
        type: "weapon",
        inventorytype: "weapon",
        rarity: "basic",
        gender: "unisex",
        price: 500,
        currency: "coins",
        description: "Recover 20 health and energy every turn.",
        stats: {
            level: 2,
            damage: 50,
            defense: 0,
            speed: 0,
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495bd"),
        name: "Lizard",
        type: "weapon",
        inventorytype: "weapon",
        rarity: "basic",
        gender: "unisex",
        price: 2000,
        currency: "coins",
        description: "Each weapon attack poisons enemy for 3% max. health for 2 turns.",
        stats: {
            level: 5,
            damage: 70,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495be"),
        name: "War Hammer",
        type: "weapon",
        inventorytype: "weapon",
        rarity: "common",
        gender: "unisex",
        price: 5000,
        currency: "coins",
        description: "Reduce all damage taken by 150 points.",
        stats: {
            level: 8,
            damage: 100,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495bf"),
        name: "Katana",
        type: "weapon",
        inventorytype: "weapon",
        rarity: "legendary",
        gender: "unisex",
        price: 100,
        currency: "crystal",
        description: "Increase Max health by 300 and all damage by 150 points.",
        stats: {
            level: 14,
            damage: 120,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495c0"),
        name: "Water Sword",
        type: "weapon",
        inventorytype: "weapon",
        rarity: "common",
        gender: "unisex",
        currency: "coins",
        price: 10000,
        description: "Reduce skill energy consumption by 25%. Recover 100 energy each turn and reduce all damage taken by 100 points.",
        stats: {
            level: 19,
            damage: 150,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495c1"),
        name: "Ice Shuriken",
        type: "weapon",
        inventorytype: "weapon",
        rarity: "legendary",
        gender: "unisex",
        price: 100,
        currency: "crystal",
        description: "Recover 150 health and energy each turn. Reduce skill cooldown by 1 after each weapon attack.",
        stats: {
            level: 24,
            damage: 200,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495c2"),
        name: "Dragonglass",
        type: "weapon",
        inventorytype: "weapon",
        rarity: "common",
        gender: "unisex",
        price: 20000,
        currency: "coins",
        description: "Increase attack and magic damage by 40. Every time opponent attacks, their max. health will be reduced by 3%.",
        stats: {
            level: 28,
            damage: 200,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495c3"),
        name: "Scar",
        type: "weapon",
        inventorytype: "weapon",
        rarity: "rare",
        gender: "unisex",
        price: 50000,
        currency: "coins",
        description: "Increase critical chance by 10%. Recover 10% of max. health on every critical strike. Critical strikes have 10% chance to stun the opponent.",
        stats: {
            level: 33,
            damage: 200,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495c4"),
        name: "Torch",
        type: "weapon",
        inventorytype: "weapon",
        rarity: "rare",
        gender: "unisex",
        price: 100000,
        currency: "coins",
        description: "Increase all damage by 500 every 3 turns. Every weapon attack reduces target’s 5% max. health and has 35% chance to remove all buffs from the target.",
        stats: {
            level: 36,
            damage: 200,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495c5"),
        name: "Moonstone",
        type: "weapon",
        inventorytype: "weapon",
        rarity: "rare",
        gender: "unisex",
        price: 200,
        currency: "crystal",
        description: "Increase all damage by 500 every 3 turns. Every weapon attack reduces target’s 5% max. health and has 35% chance to remove all buffs from the target.",
        stats: {
            level: 40,
            damage: 250,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    }
]
// #endregion
// #region OUTFITS
exports.outfitData = [
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495c6"),
        name: "Male Basic Attire 1",
        type: "skins",
        inventorytype: "outfit",
        rarity: "basic",
        gender: "male",
        price: 5000,
        currency: "coins",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495c7"),
        name: "Male Basic Attire 2",
        type: "skins",
        inventorytype: "outfit",
        rarity: "basic",
        gender: "male",
        price: 5000,
        currency: "coins",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495c8"),
        name: "Male Basic Attire 3",
        type: "skins",
        inventorytype: "outfit",
        rarity: "basic",
        gender: "male",
        price: 5000,
        currency: "coins",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495c9"),
        name: "Male Basic Attire 4",
        type: "skins",
        inventorytype: "outfit",
        rarity: "basic",
        gender: "male",
        price: 5000,
        currency: "coins",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495ca"),
        name: "Male Basic Attire 5",
        type: "skins",
        inventorytype: "outfit",
        rarity: "basic",
        gender: "male",
        price: 5000,
        currency: "coins",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495cb"),
        name: "Male Basic Attire 6",
        type: "skins",
        inventorytype: "outfit",
        rarity: "basic",
        gender: "male",
        price: 5000,
        currency: "coins",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        name: "Gakuran",
        type: "skins",
        inventorytype: "outfit",
        rarity: "common",
        gender: "male",
        price: 100,
        currency: "crystal",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        name: "Tanto",
        type: "skins",
        inventorytype: "outfit",
        rarity: "common",
        gender: "male",
        price: 100,
        currency: "crystal",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        name: "Shinobi Suit",
        type: "skins",
        inventorytype: "outfit",
        rarity: "common",
        gender: "male",
        price: 100,
        currency: "crystal",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        name: "Uke",
        type: "skins",
        inventorytype: "outfit",
        rarity: "rare",
        gender: "male",
        price: 500,
        currency: "crystal",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        name: "Warrior Cloak",
        type: "skins",
        inventorytype: "outfit",
        rarity: "rare",
        gender: "male",
        price: 500,
        currency: "crystal",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495d1"),
        name: "Female Basic Attire 1",
        type: "skins",
        inventorytype: "outfit",
        rarity: "basic",
        gender: "female",
        price: 5000,
        currency: "coins",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495d2"),
        name: "Female Basic Attire 2",
        type: "skins",
        inventorytype: "outfit",
        rarity: "basic",
        gender: "female",
        price: 5000,
        currency: "coins",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495d3"),
        name: "Female Basic Attire 3",
        type: "skins",
        inventorytype: "outfit",
        rarity: "basic",
        gender: "female",
        price: 5000,
        currency: "coins",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495d4"),
        name: "Female Basic Attire 4",
        type: "skins",
        inventorytype: "outfit",
        rarity: "basic",
        gender: "female",
        price: 5000,
        currency: "coins",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495d5"),
        name: "Female Basic Attire 5",
        type: "skins",
        inventorytype: "outfit",
        rarity: "basic",
        gender: "female",
        price: 5000,
        currency: "coins",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495d6"),
        name: "Female Basic Attire 6",
        type: "skins",
        inventorytype: "outfit",
        rarity: "basic",
        gender: "female",
        price: 5000,
        currency: "coins",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
]
// #endregion
// #region HAIR
exports.hairData = [
    {
        name: "Basic Ninja Hairstyle 1",
        type: "skins",
        inventorytype: "hair",
        rarity: "basic",
        gender: "male",
        price: 2500,
        currency: "coins",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        name: "Basic Ninja Hairstyle 2",
        type: "skins",
        inventorytype: "hair",
        rarity: "basic",
        gender: "male",
        price: 2500,
        currency: "coins",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        name: "Basic Ninja Hairstyle 3",
        type: "skins",
        inventorytype: "hair",
        rarity: "basic",
        gender: "male",
        price: 2500,
        currency: "coins",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        name: "Basic Ninja Hairstyle 4",
        type: "skins",
        inventorytype: "hair",
        rarity: "basic",
        gender: "male",
        price: 2500,
        currency: "coins",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        name: "Basic Ninja Hairstyle 5",
        type: "skins",
        inventorytype: "hair",
        rarity: "basic",
        gender: "male",
        price: 2500,
        currency: "coins",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        name: "Basic Ninja Hairstyle 6",
        type: "skins",
        inventorytype: "hair",
        rarity: "basic",
        gender: "male",
        price: 2500,
        currency: "coins",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        name: "Gakuran Hairstyle",
        type: "skins",
        inventorytype: "hair",
        rarity: "common",
        gender: "male",
        price: 100,
        currency: "crystal",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        name: "Tanto Hairstyle",
        type: "skins",
        inventorytype: "hair",
        rarity: "common",
        gender: "male",
        price: 100,
        currency: "crystal",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        name: "Shinobi Hairstyle",
        type: "skins",
        inventorytype: "hair",
        rarity: "common",
        gender: "male",
        price: 100,
        currency: "crystal",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        name: "Uke Hairstyle",
        type: "skins",
        inventorytype: "hair",
        rarity: "rare",
        gender: "male",
        price: 250,
        currency: "crystal",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        name: "Warrior Hairstyle",
        type: "skins",
        inventorytype: "hair",
        rarity: "rare",
        gender: "male",
        price: 250,
        currency: "crystal",
        description: "N/A",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
]
// #endregion
// #region Crystal Packs
exports.crystalPackData = [
    {
        name: "Starter Crystal Pack",
        type: "crystalpacks",
        inventorytype: "crystalpacks",
        rarity: "basic",
        gender: "unisex",
        currency: "topupcredit",
        price: 20,
        isOpenable: true,
        isEquippable: false,
        crystals: 2000,
        imageUrl: "",
        description: "Best value for new players!",
    },
    {
        name: "Basic Crystal Pack",
        type: "crystalpacks",
        inventorytype: "crystalpacks",
        rarity: "common",
        gender: "unisex",
        currency: "topupcredit",
        price: 49,
        isOpenable: true,
        isEquippable: false,
        crystals: 5000,
        imageUrl: "",
        description: "Great value crystal pack!"
    },
    {
        name: "Advanced Crystal Pack",
        type: "crystalpacks",
        inventorytype: "crystalpacks",
        rarity: "common",
        gender: "unisex",
        currency: "topupcredit",
        price: 99,
        isOpenable: true,
        isEquippable: false,
        crystals: 11000,
        imageUrl: "",
        description: "Most popular crystal pack!",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        }
    },
    {
        name: "Elite Crystal Pack",
        type: "crystalpacks",
        inventorytype: "crystalpacks",
        rarity: "rare",
        gender: "unisex",
        currency: "topupcredit",
        price: 499,
        isOpenable: true,
        isEquippable: false,
        crystals: 60000,
        imageUrl: "",
        description: "Premium crystal value pack!",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        }
    },
    {
        name: "Master Crystal Pack",
        type: "crystalpacks",
        inventorytype: "crystalpacks",
        rarity: "rare",
        gender: "unisex",
        currency: "topupcredit",
        price: 999,
        isOpenable: true,
        isEquippable: false,
        crystals: 125000,
        imageUrl: "",
        description: "Ultimate crystal collection!",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        }
    },
    {
        name: "Legendary Crystal Pack",
        type: "crystalpacks",
        inventorytype: "crystalpacks",
        rarity: "legendary",
        gender: "unisex",
        currency: "topupcredit",
        price: 4999,
        isOpenable: true,
        isEquippable: false,
        crystals: 650000,
        imageUrl: "",
        description: "Legendary crystal bundle for serious players!",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        }
    }
]
// #endregion
// #region GOLD PACKS
exports.goldPackData = [
    {
        name: "Starter Gold Pack",
        type: "goldpacks",
        inventorytype: "goldpacks",
        rarity: "basic",
        gender: "unisex",
        currency: "crystal",
        price: 2000,
        coins: 200000,
        imageUrl: "",
        description: "Best value for new players!",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        isOpenable: true,
        isEquippable: false,

    },
    {
        name: "Basic Gold Pack",
        type: "goldpacks",
        inventorytype: "goldpacks",
        rarity: "common",
        gender: "unisex",
        currency: "crystal",
        price: 49000,
        coins: 5000000,
        imageUrl: "",
        description: "Great value gold pack!",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        isOpenable: true,
        isEquippable: false,
    },
    {
        name: "Advanced Gold Pack",
        type: "goldpacks",
        inventorytype: "goldpacks",
        rarity: "common",
        gender: "unisex",
        currency: "crystal",
        price: 99000,
        coins: 11000000,
        imageUrl: "",
        description: "Most popular gold pack!",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        isOpenable: true,
        isEquippable: false,
    },
    {
        name: "Elite Gold Pack",
        type: "goldpacks",
        inventorytype: "goldpacks",
        rarity: "rare",
        gender: "unisex",
        currency: "crystal",
        price: 499000,
        coins: 60000000,
        imageUrl: "",
        description: "Premium gold value pack!",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        isOpenable: true,
        isEquippable: false,
    },
    {
        name: "Master Gold Pack",
        type: "goldpacks",
        inventorytype: "goldpacks",
        rarity: "rare",
        gender: "unisex",
        currency: "crystal",
        price: 999000,
        coins: 125000000,
        imageUrl: "",
        description: "Ultimate gold collection!",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        isOpenable: true,
        isEquippable: false,
    },
    {
        name: "Legendary Gold Pack",
        type: "goldpacks",
        inventorytype: "goldpacks",
        rarity: "legendary",
        gender: "unisex",
        currency: "crystal",
        price: 4999000,
        coins: 650000000,
        imageUrl: "",
        description: "Legendary gold bundle for serious players!",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        isOpenable: true,
        isEquippable: false,
    }
]
// #endregion

// #region COMPANION
 exports.companiondata = [
            {
                _id: new mongoose.Types.ObjectId('682868aa3b00fa188878aa7e'),
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
                _id: new mongoose.Types.ObjectId('682868aa3b00fa188878aa7f'),
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
                _id: new mongoose.Types.ObjectId('682868aa3b00fa188878aa80'),
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
                _id: new mongoose.Types.ObjectId('682868aa3b00fa188878aa81'),
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
                _id: new mongoose.Types.ObjectId('682868aa3b00fa188878aa82'),
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
// #endregion

// #region RANKTIER
exports.ranktierdata = [
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
// #endregion

// #region REWARDS

exports.dailyexpdata = [
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
                ]
exports.dailyspindata = [
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
                ]
exports.weeklylogindata = [
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
                ]

exports.monthlylogindata = [
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
                ]
// #endregion

// #region BATTLEPASS

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
exports.battlepassData = battlepassData;

// #endregion

// #region SEASON

            const seasonData = [
                {
                    title: "Season 1",
                    duration: 90, // 90 days
                    isActive: "active",
                    startedAt: new Date()
                },
                {
                    title: "Season 2",
                    duration: 90,
                    isActive: "upcoming",
                    startedAt: new Date(new Date().setMonth(new Date().getMonth() + 3)) // Starts in 3 months
                }
            ]
exports.seasonData = seasonData;



const chapterlistdata = [
                    {
                        
                        name: "chapter1challenge1",
                        completed: false,
                        chapter: 101
                    },
                    {
                        
                        name: "chapter1challenge2",
                        completed: false,
                        chapter: 102
                    },
                    {
                        
                        name: "chapter1challenge3",
                        completed: false,
                        chapter: 103
                    },
                    {
                        
                        name: "chapter2challenge1",
                        completed: false,
                        chapter: 201
                    },
                    {
                        
                        name: "chapter2challenge2",
                        completed: false,
                        chapter: 202
                    },
                    {
                        
                        name: "chapter2challenge3",
                        completed: false,
                        chapter: 203
                    },
                    {
                        
                        name: "chapter3challenge1",
                        completed: false,
                        chapter: 301
                    },
                    {
                        
                        name: "chapter3challenge2",
                        completed: false,
                        chapter: 302
                    },
                    {
                        
                        name: "chapter3challenge3",
                        completed: false,
                        chapter: 303
                    },
                    {
                        
                        name: "chapter4challenge1",
                        completed: false,
                        chapter: 401
                    },
                    {
                        
                        name: "chapter4challenge2",
                        completed: false,
                        chapter: 402
                    },
                    {
                        
                        name: "chapter4challenge3",
                        completed: false,
                        chapter: 403
                    },
                    {
                        
                        name: "chapter5challenge1",
                        completed: false,
                        chapter: 501
                    },
                    {
                        
                        name: "chapter5challenge2",
                        completed: false,
                        chapter: 502
                    },
                    {
                        
                        name: "chapter5challenge3",
                        completed: false,
                        chapter: 503
                    },
                    {
                        
                        name: "chapter6challenge1",
                        completed: false,
                        chapter: 601
                    },
                    {
                        
                        name: "chapter6challenge2",
                        completed: false,
                        chapter: 602
                    },
                    {
                        
                        name: "chapter6challenge3",
                        completed: false,
                        chapter: 603
                    },
                    {
                        
                        name: "chapter7challenge1",
                        completed: false,
                        chapter: 701
                    },
                    {
                        
                        name: "chapter7challenge2",
                        completed: false,
                        chapter: 702
                    },
                    {
                        
                        name: "chapter7challenge3",
                        completed: false,
                        chapter: 703
                    },
                    {
                        
                        name: "chapter8challenge1",
                        completed: false,
                        chapter: 801
                    },
                    {
                        
                        name: "chapter8challenge2",
                        completed: false,
                        chapter: 802
                    },
                    {
                        
                        name: "chapter8challenge3",
                        completed: false,
                        chapter: 803
                    },
                    {
                        
                        name: "chapter9challenge1",
                        completed: false,
                        chapter: 901
                    },
                    {
                        
                        name: "chapter9challenge2",
                        completed: false,
                        chapter: 902
                    },
                    {
                        
                        name: "chapter9challenge3",
                        completed: false,
                        chapter: 903
                    },
                    {
                        
                        name: "chapter10challenge1",
                        completed: false,
                        chapter: 1001
                    },
                    {
                        
                        name: "chapter10challenge2",
                        completed: false,
                        chapter: 1002
                    },
                    {
                        
                        name: "chapter10challenge3",
                        completed: false,
                        chapter: 1003
                    },
                    {
                        
                        name: "chapter11challenge1",
                        completed: false,
                        chapter: 1101
                    },
                    {
                        
                        name: "chapter11challenge2",
                        completed: false,
                        chapter: 1102
                    },
                    {
                        
                        name: "chapter11challenge3",
                        completed: false,
                        chapter: 1103
                    },
                    {
                        
                        name: "chapter12challenge1",
                        completed: false,
                        chapter: 1201
                    },
                    {
                        
                        name: "chapter12challenge2",
                        completed: false,
                        chapter: 1202
                    },
                    {
                        
                        name: "chapter12challenge3",
                        completed: false,
                        chapter: 1203
                    },
                    {
                        
                        name: "chapter13challenge1",
                        completed: false,
                        chapter: 1301
                    },
                    {
                        
                        name: "chapter13challenge2",
                        completed: false,
                        chapter: 1302
                    },
                    {
                        
                        name: "chapter13challenge3",
                        completed: false,
                        chapter: 1303
                    },
                    {
                        
                        name: "chapter14challenge1",
                        completed: false,
                        chapter: 1401
                    },
                    {
                        
                        name: "chapter14challenge2",
                        completed: false,
                        chapter: 1402
                    },
                    {
                        
                        name: "chapter14challenge3",
                        completed: false,
                        chapter: 1403
                    },
                ]
exports.chapterlistdata = chapterlistdata;