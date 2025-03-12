const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema(
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
        }, // video  description  image
        link: {
            type: String
        },  
    },
    {
        timestamps: true
    }
)

const Announcement = mongoose.model("Announcement", AnnouncementSchema)
module.exports = Announcement