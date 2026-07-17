const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

// Users + character data + sales records (Transactions/Payins). Game content
// (items, skills, seasons, quests, battlepass seasons, titles, badges,
// staff users, analytics, etc.) is NOT touched by this script.
const Users = require('../models/Users');
const Characterdata = require('../models/Characterdata');
const Characterstats = require('../models/Characterstats');
const Charactertitle = require('../models/Charactertitles');
const Characterbadge = require('../models/Characterbadges');
const Characterwallet = require('../models/Characterwallet');
const Counter = require('../models/Counter');
const TierAvailability = require('../models/TierAvailability');
const PvpStats = require('../models/PvpStats');
const PvP = require('../models/Pvp');
const Friends = require('../models/Friends');
const Mail = require('../models/Mail');
const Reset = require('../models/Reset');
const Resethistory = require('../models/Resethistory');
const RaidbossFight = require('../models/Raidbossfight');
const { CharacterInventory } = require('../models/Market');
const { CharacterSkillTree } = require('../models/Skills');
const { Rankings, RankingHistory } = require('../models/Ranking');
const { CharacterCompanion, CharacterCompanionUnlocked } = require('../models/Companion');
const { CharacterChapter, CharacterChapterHistory } = require('../models/Chapter');
const { BattlepassProgress, BattlepassMissionProgress, BattlepassHistory } = require('../models/Battlepass');
const { QuestProgress } = require('../models/Quest');
const { CharacterMonthlyLogin, CharacterWeeklyLogin, CharacterDailySpin } = require('../models/Rewards');
const { NewsRead } = require('../models/News');
const Transaction = require('../models/Transaction');
const Payin = require('../models/Payin');

// Helper to ensure mongoose connection
async function ensureConnected() {
    if (mongoose.connection.readyState && mongoose.connection.readyState !== 0) return;

    const uri = process.env.DATABASE_URL;
    if (!uri) {
        throw new Error('DATABASE_URL is not set. Refusing to run a destructive reset without an explicit connection string.');
    }
    console.log(`Connecting to MongoDB at ${uri.replace(/\/\/.*@/, '//***@')} ...`);
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB.');
}

async function resetUsersAndCharacters() {
    try {
        await ensureConnected();

        console.log('Resetting users and character data...');

        const targets = [
            ['Users', Users],
            ['Characterdata', Characterdata],
            ['Characterstats', Characterstats],
            ['Charactertitles', Charactertitle],
            ['Characterbadges', Characterbadge],
            ['Characterwallet', Characterwallet],
            ['CharacterInventory', CharacterInventory],
            ['CharacterSkillTree', CharacterSkillTree],
            ['Rankings', Rankings],
            ['RankingHistory', RankingHistory],
            ['PvpStats', PvpStats],
            ['PvP matches', PvP],
            ['BattlepassProgress', BattlepassProgress],
            ['BattlepassMissionProgress', BattlepassMissionProgress],
            ['BattlepassHistory', BattlepassHistory],
            ['QuestProgress', QuestProgress],
            ['CharacterMonthlyLogin', CharacterMonthlyLogin],
            ['CharacterWeeklyLogin', CharacterWeeklyLogin],
            ['CharacterDailySpin', CharacterDailySpin],
            ['CharacterChapter', CharacterChapter],
            ['CharacterChapterHistory', CharacterChapterHistory],
            ['CharacterCompanion', CharacterCompanion],
            ['CharacterCompanionUnlocked', CharacterCompanionUnlocked],
            ['RaidbossFight', RaidbossFight],
            ['Friends', Friends],
            ['Mail', Mail],
            ['NewsRead', NewsRead],
            ['Reset', Reset],
            ['Resethistory', Resethistory],
            // Sales records (dashboard total sales = completed Transactions + done Payins)
            ['Transaction', Transaction],
            ['Payin', Payin],
        ];

        for (const [name, model] of targets) {
            const result = await model.deleteMany({});
            console.log(`  ${name}: ${result.deletedCount} deleted`);
        }

        // Reset the customid counter so regular players start at 1000 again
        await Counter.findOneAndUpdate(
            { name: 'character_customid' },
            { $set: { seq: 999 } },
            { upsert: true }
        );
        console.log('  Counter character_customid reset to 999 (next regular ID: 1000)');

        // Rebuild VIP tier availability: every ID free, nothing taken
        const TIER_RANGES = {
            platinum: { min: 1, max: 9 },
            gold: { min: 10, max: 99 },
            silver: { min: 100, max: 899 }
        };

        for (const [tier, range] of Object.entries(TIER_RANGES)) {
            const availableIds = [];
            for (let id = range.min; id <= range.max; id++) {
                availableIds.push(id);
            }
            await TierAvailability.findOneAndUpdate(
                { tier },
                { $set: { idRange: range, available: availableIds, taken: [] } },
                { upsert: true }
            );
            console.log(`  TierAvailability ${tier} reset: ${availableIds.length} IDs available`);
        }

        console.log('DONE. Users and character data wiped. Restart the web API server to seed the founder accounts.');
    } catch (error) {
        console.error('Reset failed:', error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

resetUsersAndCharacters();
