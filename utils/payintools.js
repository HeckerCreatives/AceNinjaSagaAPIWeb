const { default: mongoose } = require("mongoose")
const Payin = require("../models/Payin")

exports.createpayin = async (id, amount, processby, status, character) => {
    try {
        const data = await Payin.create({
            owner: new mongoose.Types.ObjectId(id),
            value: amount,
            status: status,
            processby: new mongoose.Types.ObjectId(processby),
            character: new mongoose.Types.ObjectId(character)
        });

        return {
            message: "success",
            data: data
        };
    } catch (err) {
        console.error(`Failed to create Payin data for ${id}, error:`, err);
        return {
            message: "failed"
        };
    }
};