const Badge = require("../models/Badge");

exports.getBadges = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        
        const pageOptions = {
            pageNum: parseInt(page, 10) || 0,
            limitNum: parseInt(limit, 10) || 10
        }

        // Build query
        let query = {};
        if (search && search.trim().length > 0) {
            query = {
                $or: [
                    { title: { $regex: search.trim(), $options: 'i' } },
                    { description: { $regex: search.trim(), $options: 'i' } }
                ]
            };
        }

        // Get total count for pagination
        const totalBadges = await Badge.countDocuments(query);
        
        // Get badges with pagination
        const badges = await Badge.find(query)
            .sort({ index: 1 })
            .skip(pageOptions.pageNum * pageOptions.limitNum)
            .limit(pageOptions.limitNum)
            .select('index title description');

        // Calculate pagination info
        const totalPages = Math.ceil(totalBadges / pageOptions.limitNum);
        const hasNext = pageOptions.pageNum < totalPages;
        const hasPrev = pageOptions.pageNum > 1;

        if (!badges || badges.length === 0) {
            return res.status(200).json({
                message: "success",
                data: [],
                pagination: {
                    currentPage: pageOptions.pageNum,
                    totalPages: 0,
                    totalItems: 0
                }
            });
        }

        // Format response as numbered object
        const formattedBadges = badges.map(badge => ({
            id: badge._id,
            index: badge.index,
            title: badge.title,
            description: badge.description
        }));


        return res.status(200).json({
            message: "success",
            data: formattedBadges,
            pagination: {
                currentPage: pageOptions.pageNum,
                totalPages: totalPages,
                totalItems: totalBadges,
                itemsPerPage: pageOptions.limitNum,
                hasNext: hasNext,
                hasPrev: hasPrev
            },
            ...(search && { searchTerm: search.trim() })
        });

    } catch (error) {
        console.error('Error fetching badges:', error);
        return res.status(500).json({
            message: "failed",
            data: "Internal server error while fetching badges."
        });
    }
};
