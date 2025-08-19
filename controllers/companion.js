const Characterwallet = require("../models/Characterwallet");
const Characterdata = require("../models/Characterdata");
const {Companion, CharacterCompanion} = require("../models/Companion");
const { checkcharacter } = require("../utils/character");

exports.getcharactercompanions = async (req, res) => {

    const { id } = req.user
    const { characterid, page, limit } = req.query

    const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
    }

    const checker = await checkcharacter(id, characterid);

    if (checker === "failed") {
        return res.status(400).json({
            message: "Unauthorized", 
            data: "You are not authorized to view this page. Please login the right account to view the page."
        });
    }

    const query = { owner: characterid }

    const companions = await CharacterCompanion.find(query)
        .populate("companion")
        .limit(options.limit)
        .skip(options.limit * (options.page - 1))
        .sort({ createdAt: -1 })
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while getting companions. Error: ${err}.`)
            return res.status(400).json({
                message: "bad-request", 
                data: "There's a problem with the server. Please try again later."
            });
        })

    const totalData = await CharacterCompanion.countDocuments(query)
    const totalPages = Math.ceil(totalData / options.limit)

    const finalData = []

    companions.forEach(data => {
        const { companion, isEquipped, _id } = data

        const { id, name, activedescription, passivedescription, passiveeffects, activeeffects, levelrequirement } = companion

        finalData.push({
            id: _id,
            companionid: id,
            companionname: name,
            activedescription: activedescription,
            activeeffects: activeeffects,
            passivedescription: passivedescription,
            passiveeffects: passiveeffects,
            levelrequirement: levelrequirement,
            isEquipped: isEquipped
        })
    });

    return res.status(200).json({
        message: "success", 
        data: finalData, 
        totalpages: totalPages
    });
    
}

exports.getcharactercompanionssa = async (req, res) => {

    const { id } = req.user
    const { characterid, page, limit } = req.query

    const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
    }

    const query = { owner: characterid }

    const companions = await CharacterCompanion.find(query)
        .populate("companion")
        .limit(options.limit)
        .skip(options.limit * (options.page - 1))
        .sort({ createdAt: -1 })
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while getting companions. Error: ${err}.`)
            return res.status(400).json({
                message: "bad-request", 
                data: "There's a problem with the server. Please try again later."
            });
        })

    const totalData = await CharacterCompanion.countDocuments(query)
    const totalPages = Math.ceil(totalData / options.limit)

    const finalData = []

    companions.forEach(data => {
        const { companion, isEquipped, _id } = data

        const { id, name, activedescription, passivedescription, passiveeffects, activeeffects, levelrequirement } = companion

        finalData.push({
            id: _id,
            companionid: id,
            companionname: name,
            activedescription: activedescription,
            activeeffects: activeeffects,
            passivedescription: passivedescription,
            passiveeffects: passiveeffects,
            levelrequirement: levelrequirement,
            isEquipped: isEquipped
        })
    });

    return res.status(200).json({
        message: "success", 
        data: finalData, 
        totalpages: totalPages
    });
}


exports.companionlist = async (req, res) => {

    const { page, limit, characterid } = req.query

    if(!characterid){
        return res.status(400).json({ message: "failed", data: "Please input character id."})
    }
    const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
    }

    const companions = await Companion.find()
        .limit(options.limit)
        .skip(options.limit * (options.page - 1))
        .sort({ levelrequirement: 1 })
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while getting companions. Error: ${err}.`)
            return res.status(400).json({
                message: "bad-request", 
                data: "There's a problem with the server. Please try again later."
            });
        })

    // check if user has the companion

    const charactercompanion = await CharacterCompanion.find({ owner: characterid })


    const totalData = await Companion.countDocuments()
    const totalPages = Math.ceil(totalData / options.limit)

    const finalData = []

    companions.forEach(data => {
        const { id, name, activedescription, passivedescription, passiveeffects, activeeffects, levelrequirement, price, currency } = data

        let isOwned = false

        charactercompanion.forEach(companion => {
            if(companion.companion.toString() === id.toString()){
                isOwned = true
            }
        })

        finalData.push({
            id: id,
            name: name,
            activedescription: activedescription,
            passivedescription: passivedescription,
            passiveeffects: passiveeffects,
            activeeffects: activeeffects,
            levelrequirement: levelrequirement,
            price: price,
            currency: currency,
            isOwned: isOwned,
        })
    });

    return res.status(200).json({
        message: "success", 
        data: finalData, 
        totalpages: totalPages
    });
}


// Clean companion list: no character ownership checks, simple paginated list
exports.companionListClean = async (req, res) => {
    const { page, limit } = req.query;

    const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
    };

    try {
        const companions = await Companion.find()
            .limit(options.limit)
            .skip(options.limit * (options.page - 1))
            .sort({ levelrequirement: 1 })
            .then(data => data);

        const totalData = await Companion.countDocuments();
        const totalPages = Math.ceil(totalData / options.limit);

        const finalData = companions.map(c => {
            const { id, name, activedescription, passivedescription, passiveeffects, activeeffects, levelrequirement, price, currency } = c;
            return {
                id: id,
                name: name,
                activedescription: activedescription,
                passivedescription: passivedescription,
                passiveeffects: passiveeffects,
                activeeffects: activeeffects,
                levelrequirement: levelrequirement,
                price: price,
                currency: currency
            };
        });

        return res.status(200).json({
            message: 'success',
            data: finalData,
            totalpages: totalPages
        });
    } catch (err) {
        console.log(`There's a problem encountered while getting companions. Error: ${err}.`);
        return res.status(400).json({
            message: 'bad-request',
            data: "There's a problem with the server. Please try again later."
        });
    }
}


exports.buycompanion = async (req, res) => {

    const { id } = req.user
    const { characterid, companionid } = req.body

    if(!characterid || !companionid){
        return res.status(400).json({ message: "failed", data: "Please input character id and companion id."})
    }

    const checker = await checkcharacter(id, characterid);

    if (checker === "failed") {
        return res.status(400).json({
            message: "Unauthorized", 
            data: "You are not authorized to view this page. Please login the right account to view the page."
        });
    }

    const companion = await Companion.findById(companionid)
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while buying companion. Error: ${err}.`)
        return res.status(400).json({
            message: "bad-request", 
            data: "There's a problem with the server. Please try again later."
        });
    })
    if(!companion){
        return res.status(400).json({ message: "failed", data: "Companion not found."})
    }

    const character = await Characterdata.findById(characterid)
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while buying companion. Error: ${err}.`)
        return res.status(400).json({
            message: "bad-request", 
            data: "There's a problem with the server. Please try again later."
        });
    })

    if(!character){
        return res.status(400).json({ message: "failed", data: "Character not found."})
    }
    // check level
    if(character.level < companion.levelrequirement){
        return res.status(400).json({ message: "failed", data: "Character level not enough."})
    }

    const charactercompanion = await CharacterCompanion.find({ owner: characterid, companion: companionid })
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while buying companion. Error: ${err}.`)
        return res.status(400).json({
            message: "bad-request", 
            data: "There's a problem with the server. Please try again later."
        });
    })

    if(charactercompanion.length > 0){
        return res.status(400).json({ message: "failed", data: "Companion already owned."})
    }

    // check price and currency and wallet balance

    const { price, currency } = companion

    // check if character has enough currency

    const wallet = await Characterwallet.findOne({ owner: characterid, type: currency })
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while buying companion. Error: ${err}.`)
        return res.status(400).json({
            message: "bad-request", 
            data: "There's a problem with the server. Please try again later."
        });
    })

    if(!wallet){
        return res.status(400).json({ message: "failed", data: "Character wallet not found."})
    }

    if(wallet.amount < price){
        return res.status(400).json({ message: "failed", data: "Insufficient funds."})
    }

    // deduct wallet amount

    wallet.amount -= price

    await wallet.save()

    // add companion to character

    await CharacterCompanion.create({ owner: characterid, companion: companionid, isEquipped: false })
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while buying companion. Error: ${err}.`)
        return res.status(400).json({
            message: "bad-request", 
            data: "There's a problem with the server. Please try again later."
        });
    })

    return res.status(200).json({ message: "success"})


}