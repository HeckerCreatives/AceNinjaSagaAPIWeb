const { is } = require("date-fns/locale")
const { default: mongoose } = require("mongoose")

// #region WEAPONS
exports.weaponData = [
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495bc"),
        name: "Basic Sword",
        type: "skins",
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
        type: "skins",
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
        type: "skins",
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
        type: "skins",
        inventorytype: "weapon",
        rarity: "legendary",
        gender: "unisex",
        currency: "crystal",
        price: 100,
        description: "Increase max. health by 300 and all damage by 150 points.",
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
        type: "skins",
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
        type: "skins",
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
        type: "skins",
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
        type: "skins",
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
        type: "skins",
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
        type: "skins",
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
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749600"),
        name: "Fire Blade",
        type: "skins",
        inventorytype: "weapon",
        rarity: "legendary",
        gender: "unisex",
        price: 1000,
        currency: "crystal",
        description: "Burn opponent's 3% max. health every time they attack. Increase magic damage by 10.",
        stats: {
            level: 20,
            damage: 200,
            defense: 0,
            speed: 0
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749601"),
        name: "Lightning Blade",
        type: "skins",
        inventorytype: "weapon",
        rarity: "legendary",
        gender: "unisex",
        price: 1000,
        currency: "crystal",
        description: "Increase speed by 5. Increase magic damage by 15.",
        stats: {
            level: 20,
            damage: 300,
            defense: 0,
            speed: 5
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749602"),
        name: "Ancient Spear",
        type: "skins",
        inventorytype: "weapon",
        rarity: "rare",
        gender: "unisex",
        price: 1000,
        currency: "crystal",
        description: "Increases user's armor and magic resist by 15 and max. health by 300, but reduces speed by 5.",
        stats: {
            level: 10,
            damage: 200,
            defense: 15,
            speed: -5
        },
        imageUrl: ""
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749603"),
        name: "God's Axe",
        type: "skins",
        inventorytype: "weapon",
        rarity: "legendary",
        gender: "unisex",
        price: 1000,
        currency: "crystal",
        description: "When equipped user is immune to stun, fear, freeze, poison and burn effects.",
        stats: {
            level: 20,
            damage: 300,
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495e0"),
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495e1"),
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495e2"),
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495e3"),
        name: "Male Fashion Attire 4",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495e4"),
        name: "Male Fashion Attire 5",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495e5"),
        name: "Male Fashion Attire 6",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495e6"),
        name: "Male Fashion Attire 7",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495e7"),
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495e8"),
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495e9"),
        name: "Male Drip Attire 3",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495f0"),
        name: "Male Drip Attire 4",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495f1"),
        name: "Male Drip Attire 5",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495f2"),
        name: "Male Drip Attire 6",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495f3"),
        name: "Male Epic Attire 1",
        type: "skins",
        inventorytype: "outfit",
        rarity: "legendary",
        gender: "male",
        price: 1000,
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495f4"),
        name: "Male Epic Attire 2",
        type: "skins",
        inventorytype: "outfit",
        rarity: "legendary",
        gender: "male",
        price: 1000,
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495f5"),
        name: "Male Epic Attire 3",
        type: "skins",
        inventorytype: "outfit",
        rarity: "legendary",
        gender: "male",
        price: 1000,
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495f6"),
        name: "Male Epic Attire 4",
        type: "skins",
        inventorytype: "outfit",
        rarity: "legendary",
        gender: "male",
        price: 1000,
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495f7"),
        name: "Male Epic Attire 5",
        type: "skins",
        inventorytype: "outfit",
        rarity: "legendary",
        gender: "male",
        price: 1000,
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495f8"),
        name: "Male Epic Attire 6",
        type: "skins",
        inventorytype: "outfit",
        rarity: "legendary",
        gender: "male",
        price: 1000,
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
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495d7"),
        name: "Silken Shroud",
        type: "skins",
        inventorytype: "outfit",
        rarity: "common",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495d8"),
        name: "Shinobi Suit",
        type: "skins",
        inventorytype: "outfit",
        rarity: "common",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f20427495d9"),
        name: "Nightshade Armor",
        type: "skins",
        inventorytype: "outfit",
        rarity: "common",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749500"),
        name: "Female Fashion Attire 4",
        type: "skins",
        inventorytype: "outfit",
        rarity: "common",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749501"),
        name: "Female Fashion Attire 5",
        type: "skins",
        inventorytype: "outfit",
        rarity: "common",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749502"),
        name: "Female Fashion Attire 6",
        type: "skins",
        inventorytype: "outfit",
        rarity: "common",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749503"),
        name: "Female Fashion Attire 7",
        type: "skins",
        inventorytype: "outfit",
        rarity: "common",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749504"),
        name: "Warrior Princess",
        type: "skins",
        inventorytype: "outfit",
        rarity: "rare",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749505"),
        name: "Moonlight Cloak",
        type: "skins",
        inventorytype: "outfit",
        rarity: "rare",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749506"),
        name: "Female Drip Attire 3",
        type: "skins",
        inventorytype: "outfit",
        rarity: "rare",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749507"),
        name: "Female Drip Attire 4",
        type: "skins",
        inventorytype: "outfit",
        rarity: "rare",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749508"),
        name: "Female Drip Attire 5",
        type: "skins",
        inventorytype: "outfit",
        rarity: "rare",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749509"),
        name: "Female Drip Attire 6",
        type: "skins",
        inventorytype: "outfit",
        rarity: "rare",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749510"),
        name: "Female Epic Attire 1",
        type: "skins",
        inventorytype: "outfit",
        rarity: "legendary",
        gender: "female",
        price: 1000,
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749511"),
        name: "Female Epic Attire 2",
        type: "skins",
        inventorytype: "outfit",
        rarity: "legendary",
        gender: "female",
        price: 1000,
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749512"),
        name: "Female Epic Attire 3",
        type: "skins",
        inventorytype: "outfit",
        rarity: "legendary",
        gender: "female",
        price: 1000,
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749513"),
        name: "Female Epic Attire 4",
        type: "skins",
        inventorytype: "outfit",
        rarity: "legendary",
        gender: "female",
        price: 1000,
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749514"),
        name: "Female Epic Attire 5",
        type: "skins",
        inventorytype: "outfit",
        rarity: "legendary",
        gender: "female",
        price: 1000,
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749515"),
        name: "Female Epic Attire 6",
        type: "skins",
        inventorytype: "outfit",
        rarity: "legendary",
        gender: "female",
        price: 1000,
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
// #region HAIR
exports.hairData = [
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749516"),
        name: "Male Basic Ninja Hairstyle 1",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749517"),
        name: "Male Basic Ninja Hairstyle 2",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749518"),
        name: "Male Basic Ninja Hairstyle 3",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749519"),
        name: "Male Basic Ninja Hairstyle 4",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749520"),
        name: "Male Basic Ninja Hairstyle 5",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749521"),
        name: "Male Basic Ninja Hairstyle 6",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749522"),
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749523"),
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749524"),
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749525"),
        name: "Male Fashion Hairstyle 4",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749526"),
        name: "Male Fashion Hairstyle 5",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749527"),
        name: "Male Fashion Hairstyle 6",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749528"),
        name: "Male Fashion Hairstyle 7",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749529"),
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749530"),
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
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749531"),
        name: "Male Drip Hairstyle 3",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749532"),
        name: "Male Drip Hairstyle 4",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749533"),
        name: "Male Drip Hairstyle 5",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749534"),
        name: "Male Drip Hairstyle 6",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749535"),
        name: "Male Epic Hairstyle 1",
        type: "skins",
        inventorytype: "hair",
        rarity: "legendary",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749536"),
        name: "Male Epic Hairstyle 2",
        type: "skins",
        inventorytype: "hair",
        rarity: "legendary",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749537"),
        name: "Male Epic Hairstyle 3",
        type: "skins",
        inventorytype: "hair",
        rarity: "legendary",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749538"),
        name: "Male Epic Hairstyle 4",
        type: "skins",
        inventorytype: "hair",
        rarity: "legendary",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749539"),
        name: "Male Epic Hairstyle 5",
        type: "skins",
        inventorytype: "hair",
        rarity: "legendary",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749540"),
        name: "Male Epic Hairstyle 6",
        type: "skins",
        inventorytype: "hair",
        rarity: "legendary",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749541"),
        name: "Female Basic Ninja Hairstyle 1",
        type: "skins",
        inventorytype: "hair",
        rarity: "basic",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749542"),
        name: "Female Basic Ninja Hairstyle 2",
        type: "skins",
        inventorytype: "hair",
        rarity: "basic",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749543"),
        name: "Female Basic Ninja Hairstyle 3",
        type: "skins",
        inventorytype: "hair",
        rarity: "basic",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749544"),
        name: "Female Basic Ninja Hairstyle 4",
        type: "skins",
        inventorytype: "hair",
        rarity: "basic",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749545"),
        name: "Female Basic Ninja Hairstyle 5",
        type: "skins",
        inventorytype: "hair",
        rarity: "basic",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749546"),
        name: "Female Basic Ninja Hairstyle 6",
        type: "skins",
        inventorytype: "hair",
        rarity: "basic",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749547"),
        name: "Silken Hairstyle",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749548"),
        name: "Shinobi Hairstyle",
        type: "skins",
        inventorytype: "hair",
        rarity: "common",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749549"),
        name: "Nightshade Hairstyle",
        type: "skins",
        inventorytype: "hair",
        rarity: "common",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749550"),
        name: "Female Fashion Hairstyle 4",
        type: "skins",
        inventorytype: "hair",
        rarity: "common",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749551"),
        name: "Female Fashion Hairstyle 5",
        type: "skins",
        inventorytype: "hair",
        rarity: "common",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749552"),
        name: "Female Fashion Hairstyle 6",
        type: "skins",
        inventorytype: "hair",
        rarity: "common",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749952"),
        name: "Female Fashion Hairstyle 7",
        type: "skins",
        inventorytype: "hair",
        rarity: "common",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749553"),
        name: "Warrior Hairstyle",
        type: "skins",
        inventorytype: "hair",
        rarity: "rare",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749554"),
        name: "Moonlight Hairstyle",
        type: "skins",
        inventorytype: "hair",
        rarity: "rare",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749555"),
        name: "Female Drip Hairstyle 3",
        type: "skins",
        inventorytype: "hair",
        rarity: "rare",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749556"),
        name: "Female Drip Hairstyle 4",
        type: "skins",
        inventorytype: "hair",
        rarity: "rare",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749557"),
        name: "Female Drip Hairstyle 5",
        type: "skins",
        inventorytype: "hair",
        rarity: "rare",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749558"),
        name: "Female Drip Hairstyle 6",
        type: "skins",
        inventorytype: "hair",
        rarity: "rare",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749559"),
        name: "Female Epic Hairstyle 1",
        type: "skins",
        inventorytype: "hair",
        rarity: "legendary",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749560"),
        name: "Female Epic Hairstyle 2",
        type: "skins",
        inventorytype: "hair",
        rarity: "legendary",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749561"),
        name: "Female Epic Hairstyle 3",
        type: "skins",
        inventorytype: "hair",
        rarity: "legendary",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749562"),
        name: "Female Epic Hairstyle 4",
        type: "skins",
        inventorytype: "hair",
        rarity: "legendary",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749563"),
        name: "Female Epic Hairstyle 5",
        type: "skins",
        inventorytype: "hair",
        rarity: "legendary",
        gender: "female",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749564"),
        name: "Female Epic Hairstyle 6",
        type: "skins",
        inventorytype: "hair",
        rarity: "legendary",
        gender: "female",
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
]
// #endregion
// #region Crystal Packs
exports.crystalPackData = [
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749565"),
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749566"),
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749567"),
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749568"),
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749569"),
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749570"),
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749580"),
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749581"),
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749582"),
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749583"),
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749584"),
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749585"),
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
// #region TOPUPCREDITS
exports.topupcreditdata = [
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749591"),
        name: "Starter Credit Pack",
        type: "topupcredit",
        inventorytype: "topupcredit",
        rarity: "basic", 
        gender: "unisex",
        price: 20,
        currency: "usd",
        topupcredit: 20,
        imageUrl: "",
        description: "Best value for new players!",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        isOpenable: false,
        isEquippable: false
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749592"),
        name: "Basic Credit Pack",
        type: "topupcredit",
        inventorytype: "topupcredit", 
        rarity: "common",
        gender: "unisex",
        price: 49,
        currency: "usd",
        topupcredit: 49,
        imageUrl: "",
        description: "Great value credit pack!",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        isOpenable: false,
        isEquippable: false
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749593"),
        name: "Advanced Credit Pack",
        type: "topupcredit",
        inventorytype: "topupcredit",
        rarity: "common",
        gender: "unisex", 
        price: 99,
        currency: "usd",
        topupcredit: 99,
        imageUrl: "",
        description: "Most popular credit pack!",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        isOpenable: false,
        isEquippable: false
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749594"),
        name: "Elite Credit Pack",
        type: "topupcredit",
        inventorytype: "topupcredit",
        rarity: "rare",
        gender: "unisex",
        price: 499,
        currency: "usd",
        topupcredit: 499,
        imageUrl: "",
        description: "Premium credit value pack!",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        isOpenable: false,
        isEquippable: false
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749595"),
        name: "Master Credit Pack",
        type: "topupcredit",
        inventorytype: "topupcredit",
        rarity: "rare",
        gender: "unisex",
        price: 999,
        currency: "usd",
        topupcredit: 999,
        imageUrl: "",
        description: "Ultimate credit collection!",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        isOpenable: false,
        isEquippable: false
    },
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749596"),
        name: "Legendary Credit Pack",
        type: "topupcredit",
        inventorytype: "topupcredit",
        rarity: "legendary",
        gender: "unisex",
        price: 4999,
        currency: "usd",
        topupcredit: 4999,
        imageUrl: "",
        description: "Legendary credit bundle for serious players!",
        stats: {
            level: 1,
            damage: 0,
            defense: 0,
            speed: 0
        },
        isOpenable: false,
        isEquippable: false
    }
]
// #endregion
// #region FREEBIES
exports.freebiesdata = [
    {
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749597"),
        name: "Freebie Crystal Pack",
        type: "freebie",
        inventorytype: "freebie",
        rarity: "basic",
        price: 0,
        currency: "crystal",
        crystals: 100,
        imageUrl: "",
        description: "Free crystal pack for all players!",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749598"),
        name: "Freebie Gold Pack",
        type: "freebie",
        inventorytype: "freebie",
        rarity: "basic",
        price: 0,
        currency: "crystal",
        coins: 10000,
        imageUrl: "",
        description: "Free gold pack for all players!",
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
        _id: new mongoose.Types.ObjectId("6828695886cc0f2042749599"),
        name: "Freebie Exp Pack",
        type: "freebie",
        inventorytype: "freebie",
        rarity: "basic",
        price: 0,
        currency: "crystal",
        exp: 500,
        imageUrl: "",
        description: "Free exp pack for all players!",
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
        _id: new mongoose.Types.ObjectId("684ce1f4c61e8f1dd3ba04fa"),
        name: "Rookie",
        requiredmmr: 0,
        icon: ""
    },
    {
        _id: new mongoose.Types.ObjectId("684ce1f4c61e8f1dd3ba04fc"),
        name: "Veteran",
        requiredmmr: 1800,
        icon: ""
    },
    {
        _id: new mongoose.Types.ObjectId("684ce1f4c61e8f1dd3ba04fe"),
        name: "Elder",
        requiredmmr: 3600,
        icon: ""
    },
    {
        _id: new mongoose.Types.ObjectId("684ce1f4c61e8f1dd3ba0500"),
        name: "Ronin",
        requiredmmr: 5400,
        icon: ""
    },
    {
        _id: new mongoose.Types.ObjectId("684ce1f4c61e8f1dd3ba0502"),
        name: "Shogun",
        requiredmmr: 7200,
        icon: ""
    },
    {
        _id: new mongoose.Types.ObjectId("684ce1f4c61e8f1dd3ba0504"),
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
                title: "Battlepass", 
                season: 1,
                tierCount: 50,
                premiumCost: 1000,
                currency: "crystal",
                status: "active",
                freeMissions: [
                    {
                        missionName: "Win Multiple PvP Matches",
                        description: "Win matches in PvP mode.",
                        xpReward: 250,
                        requirements: { pvpwins: 3 },
                        daily: true,
                    },
                    {
                        missionName: "Defeat Enemies",
                        description: "Defeat enemies in any mode.",
                        xpReward: 250,
                        requirements: { enemiesdefeated: 5 },
                        daily: true,
                    },
                    {
                        missionName: "Claim Daily Quests",
                        description: "Claim daily quests.",
                        xpReward: 250,
                        requirements: { dailyquests: 2 },
                        daily: true,
                    },
                    {
                        missionName: "Use Skills",
                        description: "Use any skill in battle.",
                        xpReward: 250,
                        requirements: { skillsused: 10 },
                        daily: true,
                    },
                    {
                        missionName: "Deal Total Damage",
                        description: "Deal damage in battles.",
                        xpReward: 250,
                        requirements: { totaldamage: 5000 },
                        daily: true,
                    },
                ],
                premiumMissions: [
                    {
                        missionName: "Win PvP Matches",
                        description: "Win matches in PvP mode.",
                        xpReward: 500,
                        requirements: { pvpwins: 3 },
                        daily: true,
                    },
                    {
                        missionName: "Claim Daily Quests",
                        description: "Claim daily quests.",
                        xpReward: 500,
                        requirements: { dailyquests: 5 },
                        daily: true,
                    },
                    {
                        missionName: "Use Skills",
                        description: "Use any skill in battle.",
                        xpReward: 500,
                        requirements: { skillsused: 25 },
                        daily: true,
                    },
                    {
                        missionName: "Participate in PvP",
                        description: "Join PvP matches.",
                        xpReward: 500,
                        requirements: { pvpparticipated: 3 },
                        daily: true,
                    },
                    {
                        missionName: "Deal Total Damage",
                        description: "Deal damage in battles.",
                        xpReward: 500,
                        requirements: { totaldamage: 15000 },
                        daily: true,
                    },
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
// #endregion
// #region CHAPTERS


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
                    {
                        
                        name: "chapter15challenge1",
                        completed: false,
                        chapter: 1501
                    },
                    {
                        
                        name: "chapter15challenge2",
                        completed: false,
                        chapter: 1502
                    },
                    {
                        
                        name: "chapter15challenge3",
                        completed: false,
                        chapter: 1503
                    },
                    {
                        
                        name: "chapter16challenge1",
                        completed: false,
                        chapter: 1601
                    },
                    {
                        
                        name: "chapter16challenge2",
                        completed: false,
                        chapter: 1602
                    },
                    {
                        
                        name: "chapter16challenge3",
                        completed: false,
                        chapter: 1603
                    },
                ]
exports.chapterlistdata = chapterlistdata;

// #endregion
// #region QUESTMISSIONS
const questmissionsdata = [
                        {
                        missionName: "Participate in PvP",
                        description: "Join a PvP match.",
                        xpReward: 100,
                        requirements: { pvpparticipated: 1 },
                        daily: true,
                    },
                    {
                        missionName: "Participate in Raid",
                        description: "Join a raid battle.",
                        xpReward: 100,
                        requirements: { raidparticipated: 1 },
                        daily: true,
                    },
                    {
                        missionName: "Daily Spin",
                        description: "Use the daily spin.",
                        xpReward: 100,
                        requirements: { dailyspin: 1 },
                        daily: true,
                    },
                    {
                        missionName: "Daily Login",
                        description: "Claim your daily login reward.",
                        xpReward: 100,
                        requirements: { dailyloginclaimed: 1 },
                        daily: true,
                    },
                    {
                        missionName: "Story Challenge",
                        description: "Complete a story chapter challenge.",
                        xpReward: 100,
                        requirements: { storychapters: 1 },
                        daily: true,
                    },
                    {
                        missionName: "Defeat Enemies",
                        description: "Defeat enemies in any mode.",
                        xpReward: 100,
                        requirements: { enemiesdefeated: 15 },
                        daily: true,
                    },
                    {
                        missionName: "Deal Damage",
                        description: "Deal damage in battles.",
                        xpReward: 100,
                        requirements: { totaldamage: 15000 },
                        daily: true,
                    },
                    {
                        missionName: "Make Friends",
                        description: "Add a new friend.",
                        xpReward: 100,
                        requirements: { friendsadded: 1 },
                        daily: true,
                    },
                    {
                        missionName: "Self Healing",
                        description: "Heal yourself in battle.",
                        xpReward: 100,
                        requirements: { selfheal: 3000 },
                        daily: true,
                    },
                    {
                        missionName: "Win PvP Matches",
                        description: "Win matches in PvP mode.",
                        xpReward: 100,
                        requirements: { pvpwins: 5 },
                        daily: true,
                    },
]

exports.questmissionsdata = questmissionsdata;

// #endregion

// #region TITLES AND BADGES

const titlesdata = [
    {
        index: 1,
        title: "Ace",
        description: "You are an Ace Ninja, mastering the art of ninjutsu."
    },
    {
        index: 2,
        title: "Clan God",
        description: "You are a revered leader of your clan, guiding them to greatness."
    },
    {
        index: 3,
        title: "Final Boss",
        description: "You are the ultimate challenge, feared by all who dare to face you."
    },
    {
        index: 4,
        title: "GOAT",
        description: "You are the Greatest of All Time, unmatched in skill and prowess."
    },
    {
        index: 5,
        title: "Mastermind",
        description: "You are a strategic genius, always one step ahead of your opponents."
    },
    {
        index: 6,
        title: "Player DIFF",
        description: "You are the difference maker in every match, leading your team to victory."
    },
    {
        index: 7,
        title: "Stylish",
        description: "You are known for your stylish moves and flashy techniques."
    },
    {
        index: 8,
        title: "Unkillable",
        description: "You are a force of nature, nearly impossible to defeat in battle."
    },
    {
        index: 9,
        title: "VIP",
        description: "You are a Very Important Player, enjoying exclusive perks and privileges."
    },
    {
        index: 10,
        title: "Void Walker",
        description: "You traverse the void, mastering the balance between light and darkness."
    }
]

exports.titlesdata = titlesdata;

const badgesdata = [
    {
        index: 1,
        title: "VIP",
        description: "You are a Very Important Player, enjoying exclusive perks and privileges."
    },
    {
        index: 2,
        title: "Raid Boss",
        description: "You are a formidable opponent in raid battles, feared by all challengers."
    },
    {
        index: 3,
        title: "Clan Season 1 Champion",
        description: "You led your clan to victory in the first season, proving your dominance."
    },
    {
        index: 4,
        title: "PVP",
        description: "You are a skilled PvP player, dominating the arena with your prowess."
    },
    {
        index: 5,
        title: "Season 1",
        description: "You participated in the first season, marking your place in history."
    },
    {
        index: 6,
        title: "Shadow Badge",
        description: "You are a master of stealth, moving unseen and unheard in the shadows."
    },
    {
        index: 7,
        title: "Samurai",
        description: "You are a skilled samurai, wielding your sword with precision and honor."
    },
    {
        index: 8,
        title: "Dark Path",
        description: "You have chosen the path of darkness, embracing its power and mystery."
    },
    {
        index: 9,
        title: "Ninja",
        description: "You are a master ninja, skilled in the art of stealth and combat."
    },
    {
        index: 10,
        title: "Ace",
        description: "You are an Ace Ninja, mastering the art of ninjutsu and combat."
    }
]


exports.badgesdata = badgesdata;