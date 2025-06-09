const { default: mongoose } = require("mongoose")
const { News, ItemNews } = require("../models/News")


// exports.creatnews = async (req, res) => {
   
//     const { title, content} = req.body

//     if(!title || !content){
//         return res.status(400).json({ message: "failed", data: "Please input title and type."})
//     }

//     await News.create({ title: title, content: content})
//     .then(data => data)
//     .catch(err => {
//         console.log(`There's a problem encountered while creating News. Error: ${err}`)

//         return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
//     })

//     return res.status(200).json({ message: "success"})

// }

exports.createnews = async (req, res) => {
    const { title, content, contentType, url } = req.body;

    if (!title || !contentType) {
        return res.status(400).json({ message: "failed", data: "Please provide title and content type." });
    }

    let mediaUrl = "";

    if (contentType === "image") {
        if (!req.file) {
            return res.status(400).json({ message: "failed", data: "Please select an image first!" });
        }
        mediaUrl = req.file.path;
    } else if (contentType === "video") {
        if (!url) {
            return res.status(400).json({ message: "failed", data: "Please provide a video URL." });
        }
        mediaUrl = url;
    } else {
        return res.status(400).json({ message: "failed", data: "Invalid content type. Allowed: image, video." });
    }

    try {
        await News.create({ title, content, type: contentType, url: mediaUrl });
        return res.status(200).json({ message: "success" });
    } catch (err) {
        console.error(`Error creating news: ${err}`);
        return res.status(500).json({ message: "bad-request", data: "Server error. Please contact support." });
    }
};

exports.editnews = async (req, res) => {
    const { newsid, title, content, contentType, url } = req.body;

    if (!newsid) {
        return res.status(400).json({ message: "failed", data: "News ID is required." });
    }

    try {
        const existingNews = await News.findOne({ _id: newsid });
        if (!existingNews) {
            return res.status(404).json({ message: "failed", data: "News not found." });
        }

        let mediaUrl = existingNews.url; 
        if (contentType === "image") {
            if (req.file) {
                mediaUrl = req.file.path; 
            }
        } else if (contentType === "video") {
            if (url) {
                mediaUrl = url; 
            }
        } else if (contentType) {
            return res.status(400).json({ message: "failed", data: "Invalid content type. Allowed: image, video." });
        }

        await News.updateOne(
            { _id: newsid },
            {
                title: title || existingNews.title, 
                content: content || existingNews.content, 
                type: contentType || existingNews.type,
                url: mediaUrl
            }
        );

        return res.status(200).json({ message: "success" });
    } catch (err) {
        console.error(`Error updating news: ${err}`);
        return res.status(500).json({ message: "bad-request", data: "Server error. Please contact support." });
    }
}

exports.getnews = async (req, res) => {

    const {page, limit} = req.query

    const pageOptions = {
        page: parseInt(page) || 0,
        limit: parseInt(limit) || 10
    }

    const NewsData = await News.find()
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while fetching News data. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later."})
    })

    const totalNews = await News.countDocuments();

    const finalData = []


    NewsData.forEach(data => {
        const { id, title, content, type, url } = data

        finalData.push({
            id: id,
            title: title,
            content: content,
            type: type,
            url: url
        })
    });

    return res.status(200).json({ message: "success", data: finalData, totalPages: Math.ceil(totalNews / pageOptions.limit)})

}

// exports.editnews = async (req, res) => {
    
//     const {id, action, title, content} = req.body

//     if(!id || !action){
//         return res.status(400).json({ message: "failed", data: "Please input News id and action."})
//     }

//     if(!content){
//         return res.status(400).json({ message: "failed", data: "Please input content fields."})
//     }

//     if(action === "add"){
//         await News.findByIdAndUpdate(
//             id, 
//             { 
//                 $set: { title: title},
//                 $push: { 
//                 content: { 
//                     $each: Array.isArray(content) ? content: [content] 
//                 } 
//             } 
//         })
//         .then(data => data)
//         .catch(err => {
//             console.log(`There's a problem encountered while editting News with the action ${action}. Error: ${err}`)

//             return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later."})
//         })
//     } else if(action === "edit"){
//         const bulkOps = content.map((content) => ({
//             updateOne: {
//                 filter: { _id: id, "content._id": content.id },
//                 update: {
//                     $set: {
//                         "content.$.type": content.type,
//                         "content.$.value": content.value,
//                     },
//                 },
//             },
//         }));

//         if (title) {
//             bulkOps.push({
//                 updateOne: {
//                     filter: { _id: id },
//                     update: { $set: { title } },
//                 },
//             });
//         }
//          await News.bulkWrite(bulkOps)
//          .then(data => data)
//          .catch(err => {
//             console.log(`There's a problem encountered while editting News with the action ${action}. Error: ${err}`)

//             return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later."})
//          })
//     } else if(action === "force"){
//         const newNewsData = {
//             id: id,
//             title: title,
//             content: content
//         }
//         await News.findOneAndReplace({ _id: id}, newNewsData)
//         .then(data => data)
//         .catch(err => {
//             console.log(`There's a problem encountered while editting News with the action ${action}. Error: ${err}`)
//             return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later."})
//         })
//     } else {
//         return res.status(400).json({ message: "failed", data: "Action must be add/edit or delete."})
//     }

//     return res.status(200).json({ message: "success"})
// }

exports.deletenews = async (req, res) => {
    const { id } = req.body

    if(!id){
        return res.status(400).json({ message: "failed", data: "Please input News id."})
    }

    await News.findByIdAndDelete(new mongoose.Types.ObjectId(id))
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while deleting News. Error: ${err}`)
        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later."})
    })

    return res.status(200).json({ message: "success"})
}

exports.createitemnews = async (req, res) => {
    const { title, itemid, itemtype } = req.body;

    if (!title || !itemid || !itemtype) {
        return res.status(400).json({ message: "failed", data: "Please provide title, item ID, and item type." });
    }

    try {
        await ItemNews.create({ title, item: itemid, itemtype });
        return res.status(200).json({ message: "success" });
    } catch (err) {
        console.error(`Error creating news: ${err}`);
        return res.status(500).json({ message: "bad-request", data: "Server error. Please contact support." });
    }
};

exports.getitemnews = async (req, res) => {
    const { page, limit } = req.query;

    const pageOptions = {
        page: parseInt(page) || 0,
        limit: parseInt(limit) || 10
    };

    try {
        const ItemNewsData = await ItemNews.find()
            .skip(pageOptions.page * pageOptions.limit)
            .limit(pageOptions.limit)
            .populate("item");

        const totalItemNews = await ItemNews.countDocuments();

        const finalData = ItemNewsData.map(data => ({
            id: data._id,
            title: data.title,
            item: data.item,
            itemtype: data.itemtype
        }));

        return res.status(200).json({ message: "success", data: finalData, totalPages: Math.ceil(totalItemNews / pageOptions.limit) });
    } catch (err) {
        console.error(`Error fetching item news: ${err}`);
        return res.status(500).json({ message: "bad-request", data: "Server error. Please try again later." });
    }
};

exports.deleteitemnews = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "failed", data: "Please input Item News ID." });
    }

    try {
        await ItemNews.findByIdAndDelete(new mongoose.Types.ObjectId(id));
        return res.status(200).json({ message: "success" });
    } catch (err) {
        console.error(`Error deleting item news: ${err}`);
        return res.status(500).json({ message: "bad-request", data: "Server error. Please try again later." });
    }
};

exports.edititemnews = async (req, res) => {
    const { id, title, itemid, itemtype } = req.body;

    if (!id) {
        return res.status(400).json({ message: "failed", data: "Item News ID is required." });
    }

    try {
        const existingItemNews = await ItemNews.findOne({ _id: id });
        if (!existingItemNews) {
            return res.status(404).json({ message: "failed", data: "Item News not found." });
        }

        await ItemNews.updateOne(
            { _id: id },
            {
                title: title || existingItemNews.title,
                item: itemid || existingItemNews.item,
                itemtype: itemtype || existingItemNews.itemtype
            }
        );

        return res.status(200).json({ message: "success" });
    } catch (err) {
        console.error(`Error updating item news: ${err}`);
        return res.status(500).json({ message: "bad-request", data: "Server error. Please contact support." });
    }
};
