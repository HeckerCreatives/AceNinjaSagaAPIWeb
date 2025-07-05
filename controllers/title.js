const Title = require("../models/Title");


exports.getTitles = async (req, res) => {

    const { page, limit, search } = req.query;

    const pageOptions = {
        pageNum: parseInt(page, 10) || 0,
        limitNum: parseInt(limit, 10) || 10
    }

    let query = {};
    if (search && search.trim().length > 0) {
        query = {
            $or: [
                { title: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } }
            ]
        };
    }

    const totalTitles = await Title.countDocuments(query);
    const titles = await Title.find(query)
        .sort({ index: 1 })
        .skip(pageOptions.pageNum * pageOptions.limitNum)
        .limit(pageOptions.limitNum)
        .select('index title description');
    
    const totalPages = Math.ceil(totalTitles / pageOptions.limitNum);
    const hasNext = pageOptions.pageNum < totalPages;
    const hasPrev = pageOptions.pageNum > 1;
    if (!titles || titles.length === 0) {
        return res.status(404).json({
            message: "failed",
            data: search ? "No titles found matching your search." : "No titles found."
        });
    }

    const formattedTitles = titles.map(title => ({
        id: title._id,
        index: title.index,
        title: title.title,
        description: title.description
    }));

    return res.status(200).json({
        message: "success",
        data: formattedTitles,
        pagination: {
            currentPage: pageOptions.pageNum,
            totalPages: totalPages,
            totalItems: totalTitles,
            itemsPerPage: pageOptions.limitNum,
            hasNext: hasNext,
            hasPrev: hasPrev
        }
    });
}