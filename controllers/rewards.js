const { MonthlyLogin } = require("../models/Rewards")
const { checkcharacter } = require("../utils/character")


exports.monthlyclaimreward = async (req, res) => {
    const { id } = req.user;
    const { characterid, type, rewards } = req.body;

    if(!characterid || !type || !rewards) {
        return res.status(400).json({ 
            message: "failed", 
            data: "Please input all data." 
        });
    }

    const checker = await checkcharacter(id, characterid);
    if (checker === "failed") {
        return res.status(400).json({
            message: "Unauthorized",
            data: "You are not authorized to view this page. Please login the right account to view the page."
        });
    }

    // implement rewards processing logic here to be created in the future

    try {
        await MonthlyLogin.findOneAndUpdate(
            { owner: characterid }, 
            { 
                $inc: { login: 1 },
                isClaimed: "1", 
                lastClaimed: Date.now() 
            }
        );

        // Add rest of reward processing logic here

        return res.json({
            message: "success",
            data: "Monthly reward claimed successfully"
        });

    } catch (error) {
        console.error('Error claiming monthly reward:', error);
        return res.status(500).json({
            message: "bad-request",
            data: "Failed to claim monthly reward"
        });
    }
}

exports.spinnerclaimreward = async (req, res) => {

    const { id } = req.user;
    const { characterid, rewards } = req.body;

    if(!characterid || !rewards) {
        return res.status(400).json({ 
            message: "failed", 
            data: "Please input all data." 
        });
    }

    const checker = await checkcharacter(id, characterid);

    if (checker === "failed") {
        return res.status(400).json({
            message: "Unauthorized",
            data: "You are not authorized to view this page. Please login the right account to view the page."
        });
    }

    // implement rewards processing logic here to be created in the future

    try {
        await SpinnerRewards.findOneAndUpdate(
            { owner: characterid }, 
            { 
                $inc: { daily: 1 },
                isClaimed: "1", 
                lastClaimed: Date.now() 
            }
        );

        // Add rest of reward processing logic here

        return res.json({
            message: "success",
            data: "Spinner reward claimed successfully"
        });

    } catch (error) {
        console.error('Error claiming spinner reward:', error);
        return res.status(500).json({
            message: "bad-request",
            data: "Failed to claim spinner reward"
        });
    }
}