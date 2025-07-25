const Characterwallet = require("../models/Characterwallet");
const { Item } = require("../models/Market");
const Transaction = require("../models/Transaction");
const { checkcharacter } = require("../utils/character");
const { get_access_token } = require("../utils/paypaltools")
// const Transaction = require("../models/Transaction")
// const Characterwallet = require("../models/Characterwallet")
// const { default: mongoose } = require("mongoose")
 
// exports.createTransaction = async (req, res) => {

//     const { id, username } = req.user

//     const { transactionId, amount, method, currency, items } = req.body

//     if(!id){
//         return res.status(400).json({ message: "failed", data: "Unauthorized! Please login to the right account." })
//     }

//     if(!transactionId || !amount || !method || !currency ){
//         return res.status(400).json({ message: "failed", data: "No transaction data." })
//     }

//     if(!items && items.length === 0){
//         return res.status(400).json({ message: "failed", data: "No transaction data." })      
//     }

//     await Transaction.create({
//         owner: id,
//         transactionId: transactionId,
//         amount: amount,
//         method: method,
//         currency: currency,
//         items: items
//     })
//     .then(data => data)
//     .catch(err => {
//         console.log(`There's a problem encountered when creating transaction for user: ${username}. Error: ${err}`)
//         return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later"})
//     })

//     return res.status(200).json({ message: "success"})
// }


// exports.completeTransaction = async (req, res) => {
//     const { id } = req.user

//     const { status, transactionId, items, characterid } = req.body
    
//     if(!transactionId || !items || !characterid){
//         return res.status(400).json({ message: "failed", data: "There's no transaction/user details found."})
//     }
    
//     if(status === 'completed'){
        
//         const findTransaction = await Transaction.findOne({ transactionId: transactionId})
        
//         if(!findTransaction){
//             return res.status(400).json({ message: "bad-request", data: "Transaction does not exists."})
//         } else {
//             await Transaction.findOneAndUpdate({ owner:  new mongoose.Types.ObjectId(id), transactionId: transactionId}, { $set: { status: "completed"}})
//             .then(data => data)
//             .catch(err => {
//                 console.log(`There's a problem encountered while updating transaction. Error: ${err}`)
//                 return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later."})
//             })

//             for (const item of items) {
//                 const { type, quantity, price } = item;

//                 if (!type || !quantity || !price) {
//                     return res.status(400).json({ message: "failed", data: "Invalid item data provided." });
//                 }
//                 const totalAmount = quantity * price;

//                 await Characterwallet.findOneAndUpdate(
//                     { owner: characterid, type },
//                     { $inc: { amount: totalAmount } }, 
//                 )
//                 .then(data => data)
//                 .catch(err => {
//                     console.log(`There's a problem encountered while updating character wallet. Error: ${err}`)
                    
//                     return res.status(400).json({
//                         message: "bad-request",
//                         data: `Character wallet not found for type: ${type}`,
//                     });            
//                 })

//             }
            
//             return res.status(200).json({ message: "success"})
//         }
//     } else {
//         await Transaction.findOneAndUpdate({ owner: new mongoose.Types.ObjectId(id), transactionId: transactionId}, { $set: { status: "failed"}})
//         .then(data => data)
//         .catch(err => {
//             console.log(`There's a problem while updating transaction status: failed. Error: ${err}`)
//             return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
//         })

//         return res.status(200).json({ message: "success"})
//     }
// }


// exports.monitorTransaction = async (req, res) => {
    
//     const { id } = req.user

//     const { transactionId } = req.query


//     if(!id || !transactionId){
//         return res.status(400).json({ message: "No user ID and transaction ID found."})
//     }
//     const transactionData = await Transaction.findOne({ transactionId: transactionId, owner: new mongoose.Types.ObjectId(id)})
//     .then(data => data)
//     .catch(err => {
//         console.log(`There's a problem encountered while fetching transaction data. Error ${err}`)

//         return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later."})
//     })


//     const data = {
//         transactionId: transactionData.transactionId,
//         amount: transactionData.amount,
//         status: transactionData.status,
//         items: transactionData.items,
//         date: transactionData.createdAt
//     }


//     return res.status(200).json({ message: "success", data: data })
// }

// exports.getusertransactions = async (req, res) => {

//     const { id } = req.query

//     if(!id){
//         return res.status(400).json({ message: "failed", data: "Please input user ID."})
//     }
//     const transactionData = await Transaction.find({ owner: new mongoose.Types.ObjectId(id)})
//     .then(data => data)
//     .catch(err => {
//         console.log(`There's a problem while fetching user transaction data. Error: ${err}`)
//         return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
//     })

//     const data = []

//     transactionData.forEach(temp => {
//         data.push({
//             id: temp._id,
//             transactionId: temp.transactionId,
//             amount: temp.number,
//             method: temp.method,
//             currency: temp.currency,
//             status: temp.status,
//             items: temp.items,
//             date: temp.createdAt
//         })
//     })

//     return res.status(200).json({ message: "success", data: data})
// }


// exports.createorder = async (req, res) => {
//     const { id, username } = req.user;
//     const { characterid, itemid, firsttopup } = req.body;

//     if (!id || !characterid || !itemid) {
//         return res.status(400).json({ message: "failed", data: "Unauthorized! Please login to the right account." });
//     }

//     const itemdata = await Item.findOne({ _id: itemid })
//     .then(data => data)
//     .catch(err => {
//         console.log(`There's a problem encountered while fetching item data for user: ${username}. Error: ${err}`);
//         return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later" });
//     });

//     if (!itemdata) {
//         return res.status(400).json({ message: "failed", data: "Item not found." });
//     }
    
//     let value = Number(itemdata.price).toFixed(2);
//     let topupCredits = itemdata.topupcredit;
//     let bonus = 0;
//     if (firsttopup) {
//         topupCredits = Math.floor(topupCredits * 1.2); // 20% bonus
//         bonus = Math.floor(topupCredits - (itemdata.topupcredit || 0));
//     }

//     get_access_token()
//         .then(access_token => {
//             let orderData = {
//                 'intent': 'CAPTURE',
//                 'purchase_units': [{
//                     'amount': {
//                         'currency_code': 'USD',
//                         'value': value.toString(),
//                         'breakdown': {
//                             'item_total': {
//                                 'currency_code': 'USD',
//                                 'value': value.toString()
//                             }
//                         }
//                     },
//                     'items': [{
//                         'name': 'Legendary Credit Pack',
//                         'description': `Legendary credit bundle for serious players! - You will receive ${topupCredits} TopUp Credits (${topupCredits - bonus} Base + ${bonus} Bonus)`,
//                         'unit_amount': {
//                             'currency_code': 'USD',
//                             'value': value.toString()
//                         },
//                         'quantity': '1'
//                     }],
//                 }],
//                 'application_context': {
//                     'return_url': 'http://localhost:3000/',
//                     'cancel_url': 'https://example.com/cancel'
//                 }
//             }

//             const data = JSON.stringify(orderData);

//             fetch(process.env.PAYPAL_API_URL + '/v2/checkout/orders', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${access_token}`
//                     },
//                     body: data
//                 })
//                 .then(res => res.json())
//                 .then(json => {
//                     res.send(json);
//                 })
//         })
//         .catch(err => {
//             console.log(`There's a problem encountered while creating order for user: ${username}. Error: ${err}`);
//             return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later" });
//         });
// }

// exports.completeorder = async (req, res) => {
//     const { id, username } = req.user;
//     const { orderid, characterid, itemid, firsttopup } = req.body;

//     if (!id || !characterid || !itemid) {
//         return res.status(400).json({ message: "failed", data: "Missing required information." });
//     }

//     // Get item data first
//     const itemdata = await Item.findOne({ _id: itemid })
//         .then(data => data)
//         .catch(err => {
//             console.log(`Error fetching item data: ${err}`);
//             return res.status(400).json({ message: "bad-request", data: "Error fetching item data" });
//         });

//     if (!itemdata) {
//         return res.status(400).json({ message: "failed", data: "Item not found." });
//     }

//     let topupCredits = itemdata.topupcredit;
//     if (firsttopup) {
//         topupCredits = Math.floor(topupCredits * 1.2); // 20% bonus
//     }

//     get_access_token()
//         .then(access_token => {
//             fetch(process.env.PAYPAL_API_URL + '/v2/checkout/orders/' + orderid + '/capture', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${access_token}`
//                 }
//             })
//             .then(res => res.json())
//             .then(async json => {
//                 if (json.status === 'COMPLETED') {
//                     // Update user's wallet with the credits
//                     await Characterwallet.findOneAndUpdate(
//                         { owner: characterid, type: 'topupcredit' },
//                         { $inc: { amount: topupCredits } },
//                         { new: true }
//                     ).catch(err => {
//                         console.log(`Error updating wallet: ${err}`);
//                         return res.status(500).json({ message: "failed", data: "Error updating wallet" });
//                     });


                    
//                     return res.status(200).json({ 
//                         message: "success", 
//                         data: { 
//                             credits: topupCredits,
//                             paypalResponse: json 
//                         }
//                     });
//                 } else {
//                     return res.status(400).json({ message: "failed", data: "Payment not completed" });
//                 }
//             });
//         })
//         .catch(err => {
//             console.log(`Payment processing error: ${err}`);
//             return res.status(500).json({ message: "failed", data: "Payment processing error" });
//         });
// }


exports.gettopupmarketcredits = async (req, res) => {

    const { id } = req.user;
    const { characterid } = req.query;
    if (!id || !characterid) {
        return res.status(400).json({ message: "failed", data: "Unauthorized! Please login to the right account." });
    }

        const checker = await checkcharacter(id, characterid);

        if (checker === "failed") {
            return res.status(400).json({
                message: "Unauthorized",
                data: "You are not authorized to view this page. Please login the right account to view the page."
            });
        }

    const gettransactions = await Transaction.find({ owner: characterid })
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while fetching transactions for character: ${characterid}. Error: ${err}`);
            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later" });
        });

    const gettopupitems = await Item.find({ type: "topupcredit" })
        .sort({ price: 1 }) // Sort by price ascending
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while fetching topup items. Error: ${err}`);
            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later" });
        });


    const data = {
        topupitems: gettopupitems.map(item => {
            // has first topup if there are no transactions for this character

            const hasFirstTopup = gettransactions.some(transaction => transaction.item.toString() === item._id.toString() && transaction.status === "completed");

            const baseCredits = item.topupcredit;
            const bonusCredits = !hasFirstTopup ? Math.floor(baseCredits * 0.2) : 0; // 20% bonus for first topup
            return {
                id: item._id,
                name: item.name,
                description: `${item.description} - You will receive ${baseCredits + bonusCredits} TopUp Credits${bonusCredits ? ` (${baseCredits} Base + ${bonusCredits} Bonus)` : ''}`,
                price: item.price,
                topupcredit: baseCredits + bonusCredits,
                bonusEligible: !hasFirstTopup
            };
        })
    };

    return res.status(200).json({ message: "success", data: data });
}


exports.completeorder = async (req, res) => {

    const { id, username } = req.user;
    const { orderdata, characterid, itemid, bonusEligible } = req.body;
    if (!id || !characterid || !itemid) {
        return res.status(400).json({ message: "failed", data: "Missing required information." });
    }

    const checker = await checkcharacter(id, characterid);
    if (checker === "failed") {
        return res.status(400).json({
            message: "Unauthorized",
            data: "You are not authorized to view this page. Please login the right account to view the page."
        });
    }

    const itemdata = await Item.findOne({ _id: itemid })
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while fetching item data for user: ${username}. Error: ${err}`);
            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later" });
        });
    if (!itemdata) {
        return res.status(400).json({ message: "failed", data: "Item not found." });
    }

    let topupCredits = itemdata.topupcredit;
    
    if (bonusEligible) {
        topupCredits = Math.floor(topupCredits * 1.2); // 20% bonus for first topup
    }

    // Process the order data

    const transaction = await Transaction.create({
        owner: characterid,
        transactionid: orderdata.id, // <-- FIXED: use correct field name
        amount: orderdata.purchase_units[0].amount.value,
        item: itemid,
        method: "PayPal",
        currency: orderdata.purchase_units[0].amount.currency_code,
        status: "completed",
        name: orderdata.payer.name.given_name + " " + orderdata.payer.name.surname,
        email: orderdata.payer.email_address,
        items: [{
            itemId: itemid,
            name: itemdata.name,
            quantity: 1,
            price: itemdata.price
        }]
    })        
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while saving transaction for user: ${username}. Error: ${err}`);
            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later" });
        });

    await Characterwallet.findOneAndUpdate(
        { owner: characterid, type: "topupcredit" },
        { $inc: { amount: topupCredits } },
        { new: true }
    )
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while updating character wallet. Error: ${err}`);
            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later" });
        });

    return res.status(200).json({
        message: "success",
    });

}

exports.gettopuphistory = async (req, res) => {
    const { id } = req.user;
    const { characterid, page, limit } = req.query;

    const pageOptions = {
        page: parseInt(page) || 0, // Default to page 1 if not provided
        limit: parseInt(limit) || 10 // Default to 10 items per page if not provided
    }
    if (!id || !characterid) {
        return res.status(400).json({ message: "failed", data: "Unauthorized! Please login to the right account." });
    }

    const checker = await checkcharacter(id, characterid);
    if (checker === "failed") {
        return res.status(400).json({
            message: "Unauthorized",
            data: "You are not authorized to view this page. Please login the right account to view the page."
        });
    }

    const transactions = await Transaction.find({ owner: characterid })
        .sort({ createdAt: -1 }) // Sort by date descending
        .skip(pageOptions.page  * pageOptions.limit) // Skip items for pagination
        .limit(pageOptions.limit) // Limit the number of items per page
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while fetching topup history for character: ${characterid}. Error: ${err}`);
            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later" });
        });

    if (!transactions || transactions.length === 0) {
        return res.status(404).json({ message: "failed", data: "No transactions found for this character." });
    }

    const totalTransactions = await Transaction.countDocuments({ owner: characterid })
        .then(count => count)
        .catch(err => {
            console.log(`There's a problem encountered while counting transactions for character: ${characterid}. Error: ${err}`);
            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later" });
        });

    const formattedTransactions = transactions.map(transaction => ({
        id: transaction._id,
        transactionId: transaction.transactionid,
        amount: transaction.amount,
        method: transaction.method,
        currency: transaction.currency,
        status: transaction.status,
        items: transaction.items,
        date: transaction.createdAt
    }));


    return res.status(200).json({ 
        message: "success", data: 
        formattedTransactions, 
        pagination: {
            currentPage: pageOptions.page,
            totalPages: Math.ceil(totalTransactions / pageOptions.limit),
            totalItems: totalTransactions
        } 
    });
}

exports.gettopuphistorysa = async (req, res) => {
    const { id } = req.user;
    const { characterid, page, limit } = req.query;

    const pageOptions = {
        page: parseInt(page) || 0, // Default to page 1 if not provided
        limit: parseInt(limit) || 10 // Default to 10 items per page if not provided
    }
    if (!id || !characterid) {
        return res.status(400).json({ message: "failed", data: "Unauthorized! Please login to the right account." });
    }

    const transactions = await Transaction.find({ owner: characterid })
        .sort({ createdAt: -1 }) // Sort by date descending
        .skip(pageOptions.page * pageOptions.limit) // Skip items for pagination
        .limit(pageOptions.limit) // Limit the number of items per page
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while fetching topup history for character: ${characterid}. Error: ${err}`);
            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later" });
        });

    if (!transactions || transactions.length === 0) {
        return res.status(404).json({ message: "failed", data: "No transactions found for this character." });
    }

    const totalTransactions = await Transaction.countDocuments({ owner: characterid })
        .then(count => count)
        .catch(err => {
            console.log(`There's a problem encountered while counting transactions for character: ${characterid}. Error: ${err}`);
            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later" });
        });

    const formattedTransactions = transactions.map(transaction => ({
        id: transaction._id,
        transactionId: transaction.transactionid,
        amount: transaction.amount,
        method: transaction.method,
        currency: transaction.currency,
        status: transaction.status,
        items: transaction.items,
        date: transaction.createdAt
    }));


    return res.status(200).json({ 
        message: "success", data: 
        formattedTransactions, 
        pagination: {
            currentPage: pageOptions.page,
            totalPages: Math.ceil(totalTransactions / pageOptions.limit),
            totalItems: totalTransactions
        } 
    });
}

exports.getcharactertopuphistorysa = async (req, res) => {
    const { id } = req.user;
    const { page, limit, search } = req.query;

    const pageOptions = {
        page: parseInt(page) || 0, // Default to page 1 if not provided
        limit: parseInt(limit) || 10 // Default to 10 items per page if not provided
    }
    if (!id) {
        return res.status(400).json({ message: "failed", data: "Unauthorized! Please login to the right account." });
    }

    const transactions = await Transaction.aggregate([
        {
            $lookup: {
                from: "characterdatas", // Use the correct collection name
                localField: "owner",
                foreignField: "_id",
                as: "character"
            }
        },
        { $unwind: "$character" },
        {
            $match: search ? {
                $or: [
                    { "character.username": { $regex: search, $options: "i" } },
                    { "transactionid": { $regex: search, $options: "i" } }
                ]
            } : {}
        },
        { $sort: { createdAt: -1 } },
        { $skip: pageOptions.page * pageOptions.limit },
        { $limit: pageOptions.limit },
        {
            $project: {
                _id: 1,
                transactionid: 1,
                amount: 1,
                method: 1,
                currency: 1,
                status: 1,
                items: 1,
                createdAt: 1,
                character: {
                    username: "$character.username",
                    _id: "$character._id"
                }
            }
        }
    ]).catch(err => {
        console.log(`Error fetching transactions: ${err}`);
        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later" });
    });

    const totalTransactions = await Transaction.aggregate([
        {
            $lookup: {
                from: "characterdatas", // Use the correct collection name
                localField: "owner",
                foreignField: "_id",
                as: "character"
            }
        },
        { $unwind: "$character" },
        {
            $match: search ? {
                $or: [
                    { "character.username": { $regex: search, $options: "i" } },
                    { "transactionid": { $regex: search, $options: "i" } }
                ]
            } : {}
        },
        { $count: "total" }
    ]).then(result => (result[0] ? result[0].total : 0))
    .catch(err => {
        console.log(`Error counting transactions: ${err}`);
        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later" });
    });

    if (!transactions || transactions.length === 0) {
        return res.status(404).json({ message: "failed", data: "No transactions found!" });
    }
    
    const formattedTransactions = transactions.map(transaction => ({
        id: transaction._id,
        transactionId: transaction.transactionid,
        amount: transaction.amount,
        characterid: transaction.character._id,
        characterusername: transaction.character.username,
        method: transaction.method,
        currency: transaction.currency,
        status: transaction.status,
        items: transaction.items,
        date: transaction.createdAt
    }));


    return res.status(200).json({ 
        message: "success", data: 
        formattedTransactions, 
        pagination: {
            currentPage: pageOptions.page,
            totalPages: Math.ceil(totalTransactions / pageOptions.limit),
            totalItems: totalTransactions
        } 
    });
}