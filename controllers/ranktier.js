const RankTier = require("../models/RankTier");

exports.createRankTier = async (req, res) => {
    try {
        const { name, requiredmmr } = req.body;

        if (!name || !requiredmmr) {
            return res.status(400).json({ message: "failed", data: "All fields are required." });
        }

        const existingTier = await RankTier.findOne({name: new RegExp(`^${name.trim()}$`, 'i')});

        if (existingTier) {
            return res.status(409).json({ message: "failed", data: "Rank tier with this name already exists." });
        }

        let icon = req.file?.path;

        const newTier = await RankTier.create({ name, requiredmmr, icon });

        return res.status(201).json({ message: "success", data: newTier });

    } catch (error) {
        console.error("Error creating rank tier:", error);
        return res.status(500).json({ message: "server-error", data: "Internal server error." });
    }
};


exports.getAllRankTiers = async (req, res) => {
    try {
        const rankTiers = await RankTier.find();

        return res.status(200).json({ message: "success", data: rankTiers });

    } catch (error) {
        console.error("Error fetching rank tiers:", error);
        return res.status(500).json({ message: "server-error", data: "Internal server error." });
    }
};

exports.getRankTierById = async (req, res) => {
    try {
        const { id } = req.params;
        const rankTier = await RankTier.findById(id);

        if (!rankTier) {
            return res.status(404).json({ message: "failed", data: "Rank tier not found." });
        }

        return res.status(200).json({ message: "success", data: rankTier });

    } catch (error) {
        console.error("Error fetching rank tier:", error);
        return res.status(500).json({ message: "server-error", data: "Internal server error." });
    }
};

exports.updateRankTier = async (req, res) => {
    try {
        const { id, name, requiredmmr } = req.body;
        let icon = req.file?.path;

        const existingTier = await RankTier.findById(id);
        if (!existingTier) {
            return res.status(404).json({ message: "failed", data: "Rank tier not found." });
        }

        const existingUpdateTier = await RankTier.findOne({name: new RegExp(`^${name.trim()}$`, 'i')});
        if (existingUpdateTier) {
            return res.status(409).json({ message: "failed", data: "Rank tier with this name already exists." });
        }

        const updatedTier = await RankTier.findByIdAndUpdate(
            id,
            { 
                name: name || existingTier.name, 
                requiredmmr: requiredmmr || existingTier.requiredmmr, 
                icon: icon || existingTier.icon 
            },
            { new: true }
        );

        return res.status(200).json({ message: "success", data: updatedTier });

    } catch (error) {
        console.error("Error updating rank tier:", error);
        return res.status(500).json({ message: "server-error", data: "Internal server error." });
    }
};


exports.deleteRankTier = async (req, res) => {
    try {
        const { id } = req.body;
        const deletedTier = await RankTier.findByIdAndDelete(id);

        if (!deletedTier) {
            return res.status(404).json({ message: "failed", data: "Rank tier not found." });
        }

        return res.status(200).json({ message: "success", data: "Rank tier deleted successfully." });

    } catch (error) {
        console.error("Error deleting rank tier:", error);
        return res.status(500).json({ message: "server-error", data: "Internal server error." });
    }
};
