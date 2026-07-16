const { default: mongoose } = require("mongoose")
const Season = require("../models/Season")
const { BattlepassSeason } = require("../models/Battlepass")
const { Rankings, RankReward } = require("../models/Ranking")
const Characterdata = require("../models/Characterdata")
const Mail = require("../models/Mail")
const { awardRankRewards } = require("../utils/rankrewards")
const { summarizeAppliedRewards } = require("../utils/rewardtools")
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

            // Calculate season end date and sync with active battlepass
            const seasonEndDate = new Date(updateFields.startedAt.getTime() + (duration * 24 * 60 * 60 * 1000));
            
            // Update active battlepass to match season end date
            await BattlepassSeason.updateMany(
                { status: "active" },
                { 
                    endDate: seasonEndDate,
                    startDate: updateFields.startedAt
                }
            );
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

// Strip mongoose-assigned _ids from embedded subdocs before cloning into a new
// document so Mongoose generates fresh _ids on insert. Without this, cloning a
// BattlepassSeason's tiers/missions would copy the original _ids and violate
// the embedded subdoc unique-_id invariant.
const stripIds = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.map(item => {
        const obj = item && item.toObject ? item.toObject() : { ...item };
        if (obj && typeof obj === 'object') delete obj._id;
        return obj;
    });
};

exports.endseason = async (req, res) => {
    const { newSeason, newBattlepass } = req.body || {};

    // Input validation — both new-season and new-battlepass blocks are required because
    // ending without setting up a successor leaves the game with no active season,
    // breaking BP, rank progression, and several other queries that assume one exists.
    if (!newSeason || !newSeason.title || newSeason.duration == null) {
        return res.status(400).json({ message: "failed", data: "New season title and duration are required." });
    }
    if (Number(newSeason.duration) <= 0) {
        return res.status(400).json({ message: "failed", data: "Season duration must be a positive number of days." });
    }
    if (!newBattlepass || !newBattlepass.title || newBattlepass.seasonNumber == null ||
        newBattlepass.premiumCost == null || newBattlepass.tierCount == null) {
        return res.status(400).json({
            message: "failed",
            data: "New battle pass title, season number, premium cost, and tier count are required."
        });
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // 1. Find the current active season.
        const currentSeason = await Season.findOne({ isActive: "active" }).session(session);
        if (!currentSeason) {
            await session.abortTransaction();
            return res.status(404).json({ message: "not-found", data: "No active season to end." });
        }

        // 2. Distribute rank rewards (only if rankings exist for this season).
        const rankings = await Rankings.find({ season: currentSeason._id }).session(session);
        const allRankRewards = await RankReward.find({}).session(session);

        let rewardedCount = 0;
        let mailedCount = 0;

        if (rankings.length > 0 && allRankRewards.length > 0) {
            const characterIds = rankings.map(r => r.owner);
            const characters = await Characterdata.find({ _id: { $in: characterIds } }).session(session);
            const characterMap = new Map(characters.map(c => [c._id.toString(), c]));

            for (const ranking of rankings) {
                const character = characterMap.get(ranking.owner.toString());
                if (!character) continue;

                const player = {
                    owner: ranking.owner,
                    rank: ranking.rank,
                    character: { gender: character.gender === 0 ? 'male' : 'female' }
                };

                const results = await awardRankRewards(player, allRankRewards, session);

                // Skip mail if nothing was awarded (e.g. their rank had no configured payout).
                const succeeded = (results || []).filter(r => r && r.success);
                if (succeeded.length === 0) continue;

                rewardedCount++;

                const summary = summarizeAppliedRewards(results);

                await Mail.create([{
                    owner: ranking.owner,
                    title: "Season Rewards",
                    description: `Congratulations on finishing ${currentSeason.title}! You received: ${summary}. Thank you for playing — these have been added to your account.`,
                    type: "rank-reward",
                    status: "unread"
                }], { session });

                mailedCount++;
            }
        }

        // 3. End the current season.
        await Season.findByIdAndUpdate(currentSeason._id, { isActive: "ended" }, { session });

        // 4. Deactivate the previous active BattlepassSeason (also captures it for cloning).
        const previousBP = await BattlepassSeason.findOne({ status: "active" }).session(session);
        if (previousBP) {
            await BattlepassSeason.findByIdAndUpdate(previousBP._id, { status: "inactive" }, { session });
        }

        // 5. Create the new active Season.
        const startedAt = new Date();
        const newSeasonDocs = await Season.create([{
            title: newSeason.title,
            duration: Number(newSeason.duration),
            isActive: "active",
            startedAt
        }], { session });
        const newSeasonDoc = newSeasonDocs[0];

        // 6. Create the new active BattlepassSeason, bound to the new season's window.
        const endDate = new Date(startedAt.getTime() + Number(newSeason.duration) * 24 * 60 * 60 * 1000);
        const cloneFromPrev = !!newBattlepass.cloneFromPreviousBP && !!previousBP;

        const newBPDocs = await BattlepassSeason.create([{
            title: newBattlepass.title,
            season: Number(newBattlepass.seasonNumber),
            startDate: startedAt,
            endDate,
            status: "active",
            tierCount: Number(newBattlepass.tierCount),
            premiumCost: Number(newBattlepass.premiumCost),
            tiers: cloneFromPrev ? stripIds(previousBP.tiers) : [],
            freeMissions: cloneFromPrev ? stripIds(previousBP.freeMissions) : [],
            premiumMissions: cloneFromPrev ? stripIds(previousBP.premiumMissions) : [],
            grandreward: cloneFromPrev ? (previousBP.grandreward || []) : []
        }], { session });
        const newBPDoc = newBPDocs[0];

        await session.commitTransaction();

        return res.status(200).json({
            message: "success",
            data: {
                endedSeasonId: currentSeason._id,
                newSeasonId: newSeasonDoc._id,
                newBattlepassId: newBPDoc._id,
                rewardedCharacterCount: rewardedCount,
                mailedCharacterCount: mailedCount
            }
        });
    } catch (err) {
        await session.abortTransaction();
        console.error(`[endseason] Error: ${err}`);
        return res.status(500).json({
            message: "server-error",
            data: err && err.message ? err.message : "There's a problem with the server. Please try again later."
        });
    } finally {
        session.endSession();
    }
};

exports.getseasonforleaderboards = async (req, res) => {
    try {
        const seasonList = await Season.find({ isActive: { $in: ["active", "ended"] } });

        if (!seasonList || seasonList.length === 0) {
            return res.status(204).json({ message: "not-found", data: [] });
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

