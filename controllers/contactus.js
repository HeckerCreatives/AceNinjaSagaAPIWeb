const Contactus = require("../models/Contactus")


exports.sendmessage = async (req, res) => {
    const { email, message } = req.body;

    if (!email || !message) {
        return res.status(400).json({ 
            message: "failed", 
            data: "Please input all data." 
        });
    }

    try {
        // Check if email already exists
        const existingContact = await Contactus.findOne({ email });
        
        if (existingContact) {
            // Update existing contact with new message
            existingContact.message = message;
            existingContact.updatedAt = new Date();
            await existingContact.save();
        } else {
            // Create new contact
            await Contactus.create({ email, message });
        }

        return res.status(200).json({ 
            message: "success" 
        });
    } catch (err) {
        console.error(`Error in contact form submission: ${err}`);
        return res.status(400).json({ 
            message: "bad-request", 
            data: "There's a problem with the server. Please try again later." 
        });
    }
}

exports.getcontactslist = async (req, res) => {

    const { page, limit, query } = req.query
    const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
    }

    if (query) {
        options.query = { email: { $regex: query, $options: "i" } }
    }

    try {
        const data = await Contactus.find(options.query)
            .limit(options.limit)
            .skip(options.limit * (options.page - 1))
            .sort({ createdAt: -1 })
            
        const totalData = await Contactus.countDocuments(options.query)
        const totalPages = Math.ceil(totalData / options.limit)

        const contacts = data.map((contact) => {
            const { _id, email, message, createdAt } = contact
            return {
                id: _id,
                email,
                message,
                createdAt
            }
        })
        
        return res.status(200).json({ message: "success", data: contacts, totalpages: totalPages })
    } catch (err) {
        console.log(`There's a problem encountered while getting contacts. Error: ${err}.`)
        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later." })
    }

}