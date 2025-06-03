const { default: mongoose } = require("mongoose")
const Season = require("../models/Season")
const { RemainingTime, getSeasonRemainingTimeInMilliseconds, getSeasonRemainingTime } = require("../utils/datetimetools")


exports.getseasons = async (req, res) => {
    const { page, limit, filter } = req.query

    const pageOptions = {
        page: parseInt(page) || 0,
        limit: parseInt(limit) || 10,
    }

    let query = {}

    if(filter){
        query = { type: filter }
    }

    const seasonData = await Season.find()
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while fetching News data. Error: ${err}`)
    
            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later."})
        })
    
        const totalSeason = await Season.countDocuments();
    
        const finalData = []
    
    
        seasonData.forEach(data => {
            const { _id, title, duration, isActive, createdAt, startedAt } = data
    
            finalData.push({
                _id: _id,
                title: title,
                duration: duration,
                isActive: isActive,
                startedAt: startedAt,
                createdAt: createdAt,
            })
        });
    
        return res.status(200).json({ message: "success", data: finalData, totalPages: Math.ceil(totalSeason / pageOptions.limit)})
}

exports.deleteseasons = async (req, res) => {
    const { id } = req.body

    if(!id){
        return res.status(400).json({ message: "failed", data: "Please input season id."})
    }

    await Season.findByIdAndDelete(new mongoose.Types.ObjectId(id))
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while deleting season data. Error: ${err}`)
        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later."})
    })

    return res.status(200).json({ message: "success"})
}

exports.createseason = async (req, res) => {
    try {
        const { title, duration } = req.body;

        if (!title || !duration) {
            return res.status(400).json({ message: "failed", data: "Please input title and duration." });
        }

        const existingSeasons = await Season.countDocuments();

        const newSeason = await Season.create({
            title,
            duration,
            isActive: existingSeasons === 0 ? "active" : "upcoming",
        });

        return res.status(200).json({ message: "success", data: newSeason });

    } catch (err) {
        console.error(`Error creating season: ${err}`);
        return res.status(500).json({ message: "server-error", data: "There's a problem with the server. Please contact support for more details." });
    }
};

exports.updateseason = async (req, res) => {
    try {
        const { id, title, duration, isActive } = req.body;

        if (!id) {
            return res.status(400).json({ message: "failed", data: "Season ID is required." });
        }

        if (!title || !duration) {
            return res.status(400).json({ message: "failed", data: "Please input title and duration." });
        }

        const existingSeason = await Season.findById(id);
        if (!existingSeason) {
            return res.status(404).json({ message: "not-found", data: "Season not found." });
        }

        if (existingSeason.isActive === "active" && isActive === "upcoming") {
            return res.status(400).json({ message: "failed", data: "You cannot change an active season to upcoming." });
        }

        // Prepare fields to update
        let updateFields = { title, duration };

        if (isActive === "active") {
            const currentSeason = await Season.findOne({ isActive: "active" });

            if (currentSeason && String(currentSeason._id) !== id) {
                if (!currentSeason.startedAt) {
                    console.error("Error: startedAt is missing for the current active season.");
                    return res.status(500).json({ message: "server-error", data: "Current active season has no start date. Contact support." });
                }

                const remainingTime = getSeasonRemainingTimeInMilliseconds(currentSeason.startedAt, currentSeason.duration);

                console.log(remainingTime)

                if (remainingTime > 0) {
                    return res.status(400).json({ message: "failed", data: "The current season is still active. Wait until it ends to activate a new season." });
                }

                await Season.findByIdAndUpdate(currentSeason._id, { isActive: "ended" });
            }

            updateFields.isActive = "active";
            updateFields.startedAt = new Date(); // Ensure the correct start time
        } else {
            updateFields.isActive = existingSeason.isActive; // Preserve current state if not changing to active
        }

        const updatedSeason = await Season.findByIdAndUpdate(id, updateFields, { new: true });

        return res.status(200).json({ message: "success", data: updatedSeason });

    } catch (err) {
        console.error(`Error updating season: ${err}`);
        return res.status(500).json({ message: "server-error", data: "There's a problem with the server. Please contact support for more details." });
    }
};



exports.getcurrentseason = async (req, res) => {
    try {
        const currentSeason = await Season.findOne({ isActive: 'active' });

        if (!currentSeason) {
            return res.status(404).json({ message: "not-found", data: "No current season found." });
        }

        const timeleft = getSeasonRemainingTimeInMilliseconds(currentSeason.startedAt, currentSeason.duration);

        return res.status(200).json({
            message: "success",
            data: {
                title: currentSeason.title,
                timeleft: timeleft,
                id: currentSeason._id
            }
        });

    } catch (err) {
        console.error(`Error retrieving current season: ${err}`);
        return res.status(500).json({
            message: "server-error",
            data: "There's a problem with the server. Please try again later."
        });
    }
};

exports.getseasonforleaderboards = async (req, res) => {
    try {
        const seasonList = await Season.find({ isActive: { $in: ["active", "ended"] } });

        if (!seasonList || seasonList.length === 0) {
            return res.status(404).json({ message: "not-found", data: [] });
        }

        return res.status(200).json({
            message: "success",
            data: seasonList.map(season => ({
                title: season.title,
                id: season._id
            }))
        });

    } catch (err) {
        console.error(`Error retrieving seasons: ${err}`);
        return res.status(500).json({
            message: "server-error",
            data: "There's a problem with the server. Please try again later."
        });
    }
};

