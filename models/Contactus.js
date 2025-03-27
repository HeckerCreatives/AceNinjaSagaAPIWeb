const { default: mongoose } = require("mongoose");

const ContactUsSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        message: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
)


const Contactus = mongoose.model("Contactus", ContactUsSchema)
module.exports = Contactus