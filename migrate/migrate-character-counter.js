const mongoose = require('mongoose');
const Characterdata = require('../models/Characterdata');
const Counter = require('../models/Counter');

// Helper to ensure mongoose connection
async function ensureConnected() {
    if (mongoose.connection.readyState && mongoose.connection.readyState !== 0) return;

    const uri = process.env.DATABASE_URL || 'mongodb://axcela:Axcela2025Ph@143.198.206.121:27017/ace?authSource=admin';
    console.log(`Connecting to MongoDB at ${uri} ...`);
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB.');
}

// Migration script to initialize the character customid counter
// Run this once to set up the counter based on existing data
async function initializeCharacterCounter() {
    try {
        console.log('Initializing character customid counter...');
        
        // Find the highest existing customid
        const maxDoc = await Characterdata.findOne({ 
            customid: { $exists: true, $ne: null } 
        }).sort({ customid: -1 }).lean();
        
        const maxCustomId = maxDoc ? (maxDoc.customid || 0) : 0;
        
        // Initialize or update the counter
        await Counter.findOneAndUpdate(
            { name: 'character_customid' },
            { $set: { seq: maxCustomId } },
            { upsert: true }
        );
        
        console.log(`Counter initialized to: ${maxCustomId}`);
        console.log('Migration completed successfully!');
        
    } catch (error) {
        console.error('Error during migration:', error);
        throw error;
    }
}

// Check for duplicate customids and report them
async function checkForDuplicates() {
    try {
        console.log('Checking for duplicate customids...');
        
        const duplicates = await Characterdata.aggregate([
            { $match: { customid: { $exists: true, $ne: null } } },
            { $group: { _id: "$customid", count: { $sum: 1 }, docs: { $push: "$_id" } } },
            { $match: { count: { $gt: 1 } } }
        ]);
        
        if (duplicates.length > 0) {
            console.warn('Found duplicate customids:');
            duplicates.forEach(dup => {
                console.warn(`CustomId ${dup._id}: ${dup.count} documents`);
            });
            return false;
        } else {
            console.log('No duplicate customids found.');
            return true;
        }
        
    } catch (error) {
        console.error('Error checking duplicates:', error);
        throw error;
    }
}

// Main migration function
async function runMigration() {
    try {
    // Ensure mongoose is connected (auto-connect using MONGO_URI or localhost fallback)
    await ensureConnected();
        
        // Check for existing duplicates
        const noDuplicates = await checkForDuplicates();
        
        if (!noDuplicates) {
            console.warn('Please resolve duplicate customids before running the migration.');
            console.warn('You may need to manually update duplicate records.');
            return;
        }
        
        // Initialize the counter
        await initializeCharacterCounter();
        
    // Assign missing customids to characters that don't have one
    await assignMissingCustomIds();
        
        console.log('Migration completed successfully!');
        
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

// Assign customids to all characters that are missing one
async function assignMissingCustomIds() {
    console.log('Assigning missing customids to characters...');

    const BATCH_SIZE = 100; // process documents in batches to avoid memory spikes
    let processed = 0;

    // Diagnostics: count total and missing
    try {
        const totalCount = await Characterdata.countDocuments();
        const missingCount = await Characterdata.countDocuments({ $or: [ { customid: { $exists: false } }, { customid: null } ] });
        console.log(`Total characters: ${totalCount}. Missing customid: ${missingCount}`);
        if (missingCount === 0) {
            console.log('No characters missing customid. Nothing to assign.');
            return;
        }
    } catch (err) {
        console.warn('Could not compute diagnostics counts:', err);
    }

    // Cursor to iterate documents without customid
    const cursor = Characterdata.find({ $or: [ { customid: { $exists: false } }, { customid: null } ] }).cursor();

    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        let assigned = false;
        const MAX_RETRIES = 3;

        for (let attempt = 0; attempt < MAX_RETRIES && !assigned; attempt++) {
            try {
                // Atomically increment counter
                const counterDoc = await Counter.findOneAndUpdate(
                    { name: 'character_customid' },
                    { $inc: { seq: 1 } },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                );

                if (!counterDoc || typeof counterDoc.seq !== 'number') {
                    throw new Error('Failed to get sequence from counter');
                }

                const candidateId = counterDoc.seq;

                // Try to set the customid only if it's still missing (atomic check)
                const updated = await Characterdata.updateOne(
                    { _id: doc._id, $or: [ { customid: { $exists: false } }, { customid: null } ] },
                    { $set: { customid: candidateId } }
                );

                if (updated.nModified === 1 || updated.modifiedCount === 1) {
                    assigned = true;
                    processed++;
                } else {
                    // Another process likely assigned a value concurrently. Retry.
                    console.warn(`Race detected assigning customid ${candidateId} for doc ${doc._id}. Retrying...`);
                    continue;
                }

            } catch (err) {
                // Handle duplicate key error specifically
                if (err && err.code === 11000) {
                    console.warn('Duplicate key on assign, retrying...');
                    continue;
                }
                console.error('Error assigning customid for', doc._id, err);
                break; // break retry loop for this doc
            }
        }

        if (!assigned) {
            console.error(`Failed to assign customid for document ${doc._id} after ${MAX_RETRIES} attempts`);
        }
    }

    console.log(`Assigned customids to ${processed} characters.`);
}

// Export for use in other scripts
module.exports = {
    initializeCharacterCounter,
    checkForDuplicates,
    runMigration,
    assignMissingCustomIds
};

// If running directly
if (require.main === module) {
    (async () => {
        try {
            await runMigration();
            console.log('Migration script completed.');
        } catch (err) {
            console.error('Migration script failed:', err);
            process.exit(1);
        }
    })();
}
