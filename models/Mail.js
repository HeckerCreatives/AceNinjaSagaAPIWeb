const { default: mongoose } = require("mongoose");


const MailSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            index: true
        },
        description: {
            type: String
        },
        type: {
            type: String
        },
        status: {
            type: String,
            enum: ["unread", "read"],
            default: "unread"
        },
        rewards: {
            type: Map,
            of: Number
        },
    },
    {
        timestamps: true
    }
)