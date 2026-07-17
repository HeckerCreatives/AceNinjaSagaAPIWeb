const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Characterdata = require('../models/Characterdata');

async function ensureConnected() {
    if (mongoose.connection.readyState && mongoose.connection.readyState !== 0) return;

    const uri = process.env.DATABASE_URL;
    if (!uri) {
        throw new Error('DATABASE_URL is not set. Refusing to run without an explicit connection string.');
    }
    console.log(`Connecting to MongoDB at ${uri.replace(/\/\/.*@/, '//***@')} ...`);
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB.');
}

async function migrateAddStatus() {
    try {
        await ensureConnected();

        // Update characters where status is missing or null
        const filter = { $or: [ { status: { $exists: false } }, { status: null } ] };

        const toUpdateCount = await Characterdata.countDocuments(filter);
        console.log(`Found ${toUpdateCount} character documents missing 'status'.`);

        if (toUpdateCount === 0) {
            console.log('No documents to update. Migration complete.');
            return;
        }

        const res = await Characterdata.updateMany(filter, { $set: { status: 'active' } });

        console.log(`Matched ${res.matchedCount || res.n || 0} documents, modified ${res.modifiedCount || res.nModified || 0} documents.`);
        console.log('Migration finished successfully.');

    } catch (err) {
        console.error('Migration failed:', err);
        process.exitCode = 1;
    } finally {
        try { await mongoose.disconnect(); } catch (e) { /* ignore */ }
    }
}

if (require.main === module) {
    migrateAddStatus();
}

module.exports = migrateAddStatus;
