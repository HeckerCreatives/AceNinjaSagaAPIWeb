const mongoose = require("mongoose");

const CharacterTitleSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Characterdata",
            index: true
        },
        title: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Titles",
        },
        index: {
            type: Number,
            required: true,
            index: true
        },
        title: {
            type: String,
            required: true,
            index: true
        },
    },
    {
        timestamps: true
    }
)

const Charactertitle = mongoose.model("Charactertitle", CharacterTitleSchema)
module.exports = Charactertitle