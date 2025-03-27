const Newsletter = require("../models/Newsletter")
const Users = require("../models/Users")


exports.deletenewsletter = async (req, res) => {

    const { newsletterid } = req.body


    if(!newsletterid) {
        return res.status(400).json({ message: "failed", data: "Please input newsletter id field."})
    }

    await Newsletter.findOneAndDelete({ _id: newsletterid })
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered when deleting newsletter ${newsletterid}. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })

    return res.status(200).json({ message: "success"})
}

exports.editnewsletter = async (req, res) => {

    const { newsletterid, title, description } = req.body

    if(!title || !description || !newsletterid){
        return res.status(400).json({ message: "failed", data: "Incomplete input fields."})
    }
    let bannerimg = req.file?.path;

    await Newsletter.findOneAndUpdate({ _id: newsletterid }, { $set: { title: title, description: description, banner: bannerimg }})
         .then(data => data)
         .catch(err => {
            console.log(`There's a problem encountered while updating newsletter ${newsletterid}. Error: ${err}`)

            return res.status(200).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
         })

    return res.status(200).json({ message: "success" })
}


 exports.createnewsletter = async (req, res) => {    
     const { id } = req.user;

     const { title, description, type } = req.body;

     if(!title || !description || !type) {
         return res.status(400).json({ message: "failed", data: "Incomplete input fields."})
     }
     let bannerimg = "";

     if(req.file) {
         bannerimg = req.file.path
     } else {
         return res.json({message: "failed", data: "Please select an image first!"})
     }

      const data = await Newsletter.create({ owner: id, title: title, description: description, banner: bannerimg, type: type})
      .then(data => data)
      .catch(err => {
         console.log(`There's a problem encourted while creating newsletter. Error: ${err}`)
         return res.status(400).json({ message: "Bad-request", data: "There's a problem with the server. Please contact support for more details."})
      })

      return res.status(200).json({ message: "success", data: data.banner })
 }




 exports.getnewsletterlist = async (req, res) => {
    const { page, limit, filter } = req.query;

    const pageOptions = {
        page: parseInt(page) || 0,
        limit: parseInt(limit) || 10,
    };

    let filterStage = {};

    if (filter) {
        filterStage = { type: filter };
    }

    try {
        // Get the total count of filtered documents
        const totalCount = await Newsletter.countDocuments(filterStage);
        const totalpages = Math.ceil(totalCount / pageOptions.limit);

        // Fetch paginated data
        const newsListPipeline = [
            ...(filter ? [{ $match: filterStage }] : []),
            { $sort: { createdAt: -1 } },
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit }
        ];

        const news = await Newsletter.aggregate(newsListPipeline);

        // Format response
        const data = {
            totalpages,
            totalCount, // Optional: Return total count if needed
            news: news.map(({ _id, description, title, banner }) => ({
                newsid: _id,
                description,
                title,
                banner
            }))
        };

        return res.status(200).json({ message: "success", data });
    } catch (error) {
        console.error("Error fetching newsletters:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


