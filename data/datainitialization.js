const { is } = require("date-fns/locale")

// #region WEAPONS
exports.weaponData = [
    {
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



