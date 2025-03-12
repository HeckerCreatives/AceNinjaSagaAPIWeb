const mongoose = require("mongoose");

const BattlepassSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Characterdata",
            required: true,
            index: true
        },
        season: {
            type: Number,
            required: true,
            index: true
        },
        level: {
            type: Number,
            default: 1,
            min: 1
        },
        experience: {
            type: Number,
            default: 0,
            min: 0
        },
        premium: {
            type: Boolean,
            default: false
        },
        claimedRewards: [{
            level: {
                type: Number,
                required: true
            },
            type: {
                type: String,
                enum: ['free', 'premium'],
                required: true
            },
            claimed: {
                type: Boolean,
                default: false
            },
            claimedAt: {
                type: Date
            }
        }],
        seasonStart: {
            type: Date,
            required: true
        },
        seasonEnd: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'expired'],
            default: 'active'
        }
    },
    {
        timestamps: true
    }
);

// Index for queries
BattlepassSchema.index({ owner: 1, season: 1 }, { unique: true });

// Methods to handle battlepass progression
BattlepassSchema.methods.addExperience = async function(amount) {
    this.experience += amount;
    // Add level up logic here if needed
    await this.save();
    return this;
};

BattlepassSchema.methods.claimReward = async function(level, type) {
    const reward = this.claimedRewards.find(r => r.level === level && r.type === type);
    if (reward && !reward.claimed) {
        reward.claimed = true;
        reward.claimedAt = new Date();
        await this.save();
        return true;
    }
    return false;
};

// Pre-save middleware to check season status
BattlepassSchema.pre('save', function(next) {
    const now = new Date();
    if (now > this.seasonEnd) {
        this.status = 'expired';
    } else if (now >= this.seasonStart && now <= this.seasonEnd) {
        this.status = 'active';
    }
    next();
});

const Battlepass = mongoose.model("Battlepass", BattlepassSchema);
module.exports = Battlepass;