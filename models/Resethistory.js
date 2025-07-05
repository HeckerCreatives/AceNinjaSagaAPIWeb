const { default: mongoose } = require("mongoose");


const ResetHistorySchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staffusers",
            required: true
        },
        type: {
            type: String,
            required: true
        },
        action: {
            type: String,
            required: true
        },
        manualresetdate: {
            type: Date,
            default: Date.now
        },
    },
    {
        timestamps: true,
    }
)

const ResetHistory = mongoose.model("ResetHistory", ResetHistorySchema);
module.exports = ResetHistory;