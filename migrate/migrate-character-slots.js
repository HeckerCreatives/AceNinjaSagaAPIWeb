const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Users = require('../models/Users');
const Characterdata = require('../models/Characterdata');

// Database connection
const connectDB = async () => {
    try {
        const uri = process.env.DATABASE_URL || process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('DATABASE_URL is not set. Refusing to run without an explicit connection string.');
        }
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
};

// Migration functions
const migrateUsers = async () => {
    console.log('\n🔄 Starting Users migration...');
    
    try {
        // Get all users
        const users = await Users.find({}).lean();
        console.log(`📊 Found ${users.length} users to process`);
        
        let updatedUsers = 0;
        
        for (const user of users) {
            const userId = user._id;
            
            // Get user's active characters (ordered by creation date)
            const userCharacters = await Characterdata.find({
                owner: userId,
                status: { $ne: "deleted" }
            }).sort({ createdAt: 1 }).lean();
            
            const characterCount = userCharacters.length;
            
            // Determine which slots should be unlocked based on character count
            const slotsToUnlock = [];
            for (let i = 1; i <= Math.min(characterCount, 4); i++) {
                slotsToUnlock.push(i);
            }
            
            // Ensure at least slot 1 is always unlocked
            if (slotsToUnlock.length === 0) {
                slotsToUnlock.push(1);
            }
            
            // Update user document
            const updateResult = await Users.updateOne(
                { _id: userId },
                {
                    $set: {
                        slotsunlocked: slotsToUnlock,
                        characterSlots: slotsToUnlock.length // Keep for backward compatibility
                    }
                }
            );
            
            if (updateResult.modifiedCount > 0) {
                updatedUsers++;
                console.log(`✅ Updated user ${user.username || userId}: ${characterCount} characters → slots [${slotsToUnlock.join(', ')}]`);
            }
        }
        
        console.log(`✅ Users migration completed: ${updatedUsers}/${users.length} users updated`);
        
    } catch (error) {
        console.error('❌ Error during users migration:', error);
        throw error;
    }
};

const migrateCharacters = async () => {
    console.log('\n🔄 Starting Characters migration...');
    
    try {
        // Get all users with their characters
        const users = await Users.find({}).select('_id username').lean();
        console.log(`📊 Processing characters for ${users.length} users`);
        
        let totalCharactersUpdated = 0;
        
        for (const user of users) {
            const userId = user._id;
            
            // Get user's active characters (ordered by creation date)
            const userCharacters = await Characterdata.find({
                owner: userId,
                status: { $ne: "deleted" }
            }).sort({ createdAt: 1 });
            
            if (userCharacters.length === 0) {
                continue; // Skip users with no characters
            }
            
            console.log(`👤 Processing ${userCharacters.length} characters for user: ${user.username || userId}`);
            
            // Assign slot indices based on creation order (1, 2, 3, 4)
            for (let i = 0; i < userCharacters.length && i < 4; i++) {
                const character = userCharacters[i];
                const slotIndex = i + 1; // Slots are 1-indexed
                
                // Only update if slotIndex is not already set or is different
                if (!character.slotIndex || character.slotIndex !== slotIndex) {
                    await Characterdata.updateOne(
                        { _id: character._id },
                        { $set: { slotIndex: slotIndex } }
                    );
                    
                    console.log(`  ✅ Character "${character.username}" → Slot ${slotIndex}`);
                    totalCharactersUpdated++;
                }
            }
            
            // Handle edge case: if user has more than 4 characters (shouldn't happen with proper validation)
            if (userCharacters.length > 4) {
                console.log(`  ⚠️  Warning: User has ${userCharacters.length} characters (max 4). Extra characters will need manual review.`);
            }
        }
        
        console.log(`✅ Characters migration completed: ${totalCharactersUpdated} characters updated`);
        
    } catch (error) {
        console.error('❌ Error during characters migration:', error);
        throw error;
    }
};

const validateMigration = async () => {
    console.log('\n🔍 Validating migration...');
    
    try {
        // Check for users without slotsunlocked array
        const usersWithoutSlots = await Users.countDocuments({
            $or: [
                { slotsunlocked: { $exists: false } },
                { slotsunlocked: { $size: 0 } }
            ]
        });
        
        // Check for characters without slotIndex
        const charactersWithoutSlotIndex = await Characterdata.countDocuments({
            status: { $ne: "deleted" },
            slotIndex: { $exists: false }
        });
        
        // Check for slot conflicts (multiple characters in same slot for same user)
        const slotConflicts = await Characterdata.aggregate([
            { $match: { status: { $ne: "deleted" }, slotIndex: { $exists: true } } },
            { $group: { _id: { owner: "$owner", slotIndex: "$slotIndex" }, count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } }
        ]);
        
        console.log('\n📋 Migration Validation Results:');
        console.log(`   Users without slots: ${usersWithoutSlots}`);
        console.log(`   Characters without slotIndex: ${charactersWithoutSlotIndex}`);
        console.log(`   Slot conflicts detected: ${slotConflicts.length}`);
        
        if (usersWithoutSlots === 0 && charactersWithoutSlotIndex === 0 && slotConflicts.length === 0) {
            console.log('✅ Migration validation passed!');
        } else {
            console.log('⚠️  Migration validation found issues that may need manual review.');
            
            if (slotConflicts.length > 0) {
                console.log('\n🔍 Slot conflicts details:');
                slotConflicts.forEach(conflict => {
                    console.log(`   User ${conflict._id.owner}: ${conflict.count} characters in slot ${conflict._id.slotIndex}`);
                });
            }
        }
        
    } catch (error) {
        console.error('❌ Error during validation:', error);
        throw error;
    }
};

// Main migration function
const runMigration = async () => {
    console.log('🚀 Starting Character Slot System Migration');
    console.log('==========================================');
    
    try {
        // Connect to database
        await connectDB();
        
        // Run migrations
        await migrateUsers();
        await migrateCharacters();
        
        // Validate results
        await validateMigration();
        
        console.log('\n🎉 Migration completed successfully!');
        console.log('\nNext steps:');
        console.log('1. Test the character creation, unlock, and listing APIs');
        console.log('2. Verify that existing characters appear in correct slots');
        console.log('3. Check that users can unlock additional slots');
        
    } catch (error) {
        console.error('\n💥 Migration failed:', error);
        console.log('\nPlease review the error and run the migration again if necessary.');
        process.exit(1);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
    }
};

// Dry run function for testing
const dryRun = async () => {
    console.log('🧪 Running DRY RUN - No actual changes will be made');
    console.log('==================================================');
    
    try {
        await connectDB();
        
        // Preview what would be changed
        const users = await Users.find({}).lean();
        console.log(`\n📊 Would process ${users.length} users:`);
        
        for (const user of users.slice(0, 5)) { // Show first 5 users as example
            const userCharacters = await Characterdata.find({
                owner: user._id,
                status: { $ne: "deleted" }
            }).sort({ createdAt: 1 }).lean();
            
            const slotsToUnlock = [];
            for (let i = 1; i <= Math.min(userCharacters.length, 4); i++) {
                slotsToUnlock.push(i);
            }
            if (slotsToUnlock.length === 0) slotsToUnlock.push(1);
            
            console.log(`   👤 ${user.username || user._id}: ${userCharacters.length} chars → slots [${slotsToUnlock.join(', ')}]`);
            
            userCharacters.forEach((char, index) => {
                if (index < 4) {
                    console.log(`      "${char.username}" → Slot ${index + 1}`);
                }
            });
        }
        
        if (users.length > 5) {
            console.log(`   ... and ${users.length - 5} more users`);
        }
        
        console.log('\n✅ Dry run completed. Use "npm run migrate:slots" to execute actual migration.');
        
    } catch (error) {
        console.error('❌ Dry run failed:', error);
    } finally {
        await mongoose.connection.close();
    }
};

// Command line handling
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run') || args.includes('-d');

if (isDryRun) {
    dryRun();
} else {
    runMigration();
}

module.exports = { runMigration, dryRun, validateMigration };