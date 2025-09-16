const mongoose = require('mongoose');
const Pvp = require('../models/Pvp');
const { Rankings } = require('../models/Ranking');
const PvpStats = require('../models/PvpStats');
const Season = require('../models/Season');

async function migratePvPUpdates() {
    try {
        console.log('🚀 Starting PvP migration...');

        // 1. Add type field to existing PvP matches (default to "normal")
        const pvpUpdateResult = await Pvp.updateMany(
            { type: { $exists: false } },
            { $set: { type: "normal" } }
        );
        console.log(`✅ Updated ${pvpUpdateResult.modifiedCount} PvP matches with type field`);

        // 2. Add season best fields to existing rankings
        const rankingUpdateResult = await Rankings.updateMany(
            { 
                $or: [
                    { seasonBestMMR: { $exists: false } },
                    { seasonBestRank: { $exists: false } }
                ]
            },
            { 
                $set: { 
                    seasonBestMMR: { $ifNull: ["$seasonBestMMR", "$mmr"] },
                    seasonBestRank: { $ifNull: ["$seasonBestRank", "$rank"] }
                } 
            }
        );
        console.log(`✅ Updated ${rankingUpdateResult.modifiedCount} rankings with season best fields`);

        // 3. Add type-specific stats to existing PvP stats
        const existingStats = await PvpStats.find({
            $or: [
                { rankedWin: { $exists: false } },
                { normalWin: { $exists: false } }
            ]
        });

        for (const stat of existingStats) {
            // Since we can't determine which matches were ranked vs normal historically,
            // we'll assume all existing matches were normal matches
            stat.rankedWin = 0;
            stat.rankedLose = 0;
            stat.rankedTotalMatches = 0;
            stat.rankedWinRate = 0;
            stat.normalWin = stat.win || 0;
            stat.normalLose = stat.lose || 0;
            stat.normalTotalMatches = stat.totalMatches || 0;
            stat.normalWinRate = stat.winRate || 0;
            
            await stat.save();
        }
        console.log(`✅ Updated ${existingStats.length} PvP stats with type-specific fields`);

        // 4. Fix owner reference in Pvp model (from User to Characterdata)
        // This might need manual verification depending on your data structure
        console.log('⚠️  Note: Please verify that Pvp.owner references point to Characterdata, not User');

        console.log('🎉 PvP migration completed successfully!');
        
    } catch (error) {
        console.error('❌ Error during PvP migration:', error);
        throw error;
    }
}

// Run migration if called directly
if (require.main === module) {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database')
        .then(() => {
            console.log('📦 Connected to MongoDB');
            return migratePvPUpdates();
        })
        .then(() => {
            console.log('✨ Migration completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Migration failed:', error);
            process.exit(1);
        });
}

module.exports = migratePvPUpdates;
