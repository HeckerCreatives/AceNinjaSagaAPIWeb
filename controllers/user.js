const { default: mongoose } = require("mongoose")
const Users = require("../models/Users");
const { daily, weekly, monthly } = require("../utils/graphfilter");
const { startOfISOWeek, endOfISOWeek, startOfYear, endOfYear } = require('date-fns');
const bcrypt = require('bcrypt');

const encrypt = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

exports.totalregistration = async (req, res) => {
        const totalUsers = await Users.countDocuments()
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while fetching totalUsers. Error: ${err}`)

            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later."})
        })
        const totalActiveUsers = await Users.countDocuments({ status: "active" })
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while fetching totalActiveUsers. Error: ${err}`)

            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later."})
        })
        const totalInactiveUsers = await Users.countDocuments({ status: { $ne: "active" } })
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while fetching totalInactiveUsers. Error: ${err}`)

            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later."})
        })

        return res.status(200).json({
            message: "success",
            data: {
                totalUsers: totalUsers,
                totalActiveUsers: totalActiveUsers,
                totalInactiveUsers: totalInactiveUsers,
            }
        });

}

exports.banunbanuser = async (req, res) => {
    const { userid, status } = req.body

    if(!userid || !status){
        return res.status(400).json({ message: "failed", data: "Please input userid and status."})
    }
    await Users.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(userid)}, { $set: { status: status}})
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encounter while banning/unbanning users. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })

    return res.status(200).json({ message: "success" })
}


exports.userlist = async (req, res) => {
    const { page, limit, filter, search} = req.query

    const pageOptions = {
        page: parseInt(page) || 0,
        limit: parseInt(limit) || 10
    }

    let searchMatchStage = {};
    let filterMatchStage = {};

    if(search) {
        searchMatchStage = {
            $or: [
                { username: { $regex: search, $options: 'i' } },
                { 'character.username': { $regex: search, $options: 'i' } }
            ]
        };
    }
    if(filter === 'active' || filter === 'inactive'){
        filterMatchStage = {
            status: filter,
        }
    }   

    const matchCondition = [
        {
            $match: {
                auth: "player"
            }
        },
        {
            $lookup: {
                from: "characterdatas",
                localField: "_id",
                foreignField: "owner",
                as: "character"
            }
        },
        {
            $unwind: {
                path: "$character",
                preserveNullAndEmptyArrays: true // Preserve users without character data
            }
        },
        {
            $lookup: {
                from: "characterwallets",
                localField: "character._id", // Use the `_id` of the character
                foreignField: "owner", // Match `owner` field in `characterwallets`
                as: "character.wallet"
            }
        },
        ...(search ? [ { $match: searchMatchStage }] : []),
        ...(filter ? [ { $match: filterMatchStage }]: []),
        {
            $group: {
                _id: "$_id", // Recombine documents by user
                username: { $first: "$username" },
                email: { $first: "$email" },
                status: { $first: "$status" },
                auth: { $first: "$auth" },
                character: { $push: "$character" } // Aggregate back the `character` array
            }
        },
        {
            $project: {
                id: 1,
                username: 1,
                email: 1,
                status: 1,
                auth: 1,
                character: 1
            }
        },
        {
            $skip: pageOptions.page * pageOptions.limit
        },
        {
            $limit: pageOptions.limit
        }
    ];
    

    const playerlistdata = await Users.aggregate(matchCondition)

    const countQuery = { auth: "player", ...filterMatchStage };
    if (search) {
        countQuery.$or = searchMatchStage.$or;
    }
    
    const totalPlayers = await Users.countDocuments(countQuery)
    .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while fetching users. Error: ${err}`)

            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details"})
        });

    const finalpages = Math.ceil(totalPlayers / pageOptions.limit)

    const finaluserdata = []
    
    playerlistdata.forEach(temp => {
        const { _id, email, username, status, auth, character } = temp
        const characters = []

        character.forEach(temp1 => {
            const { _id, wallet, username, gender, outfit, hair, eyes, facedetails, color, title, level, badge } = temp1
           
            const wallet1 = []

            wallet.forEach(temp2 => {
                const { type, amount } = temp2

                wallet1.push({
                    type: type,
                    ammount: amount
                })
            })

            characters.push({
                id: _id,
                username: username,
                gender: gender,
                outfit: outfit,
                hair: hair,
                eyes: eyes,
                facedetails: facedetails,
                color: color,
                title: title,
                level: level,
                badge: badge,
                wallet: wallet1,
            })
        })
        finaluserdata.push({
            id: _id,
            username: username,
            email: email,
            status: status,
            auth: auth,
            character: characters,
        })
    })
    const data = {
        "playerListData": finaluserdata,
        "totalPages": finalpages
    }
    return res.json({ message: "success", data: data});

} 


exports.changeuserpasswordsuperadmin = async(req, res) => {

    const { userid, password } = req.body

    if(!userid || !password){
        return res.status(400).json({ message: "failed", data: "Please input userid and password."})
    }
    
    if(password.length < 6 || password.length > 15) {
        return res.status(400).json({ message: "failed", data: "Password must be between 6 and 15 characters."})
    }

    const passwordRegex = /^[a-zA-Z0-9\[\]@#]+$/;
    if(!passwordRegex.test(password)){
        return res.status(400).json({ message: "failed", data: "Only letters, numbers, and [, ], @, # characters are allowed."})      
    }


    const encryptedPassword = await encrypt(password)

    await Users
    .findOneAndUpdate({ _id: new mongoose.Types.ObjectId(userid)}, { $set: { password: encryptedPassword }})
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while changing user password. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })

    return res.status(200).json({ message: "success" })
}

exports.changeuserpassword = async(req, res) => {

    const { id } = req.user;

    const { oldpw, newpw } = req.body

    if(!oldpw || !newpw){
        return res.status(400).json({ message: "failed", data: "Please input old password and new password."})
    }


    const user = await Users.findOne({ _id: id })
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while fetching user. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })


    if(!user){
        return res.status(400).json({ message: "failed", data: "User not found."})
    }

    if(!await user.matchPassword(oldpw)){
        return res.status(400).json({ message: "failed", data: "Old password is incorrect."})
    }

    if(newpw.length < 6 || newpw.length > 15) {
        return res.status(400).json({ message: "failed", data: "Password must be between 6 and 15 characters."})
    }

    const passwordRegex = /^[a-zA-Z0-9\[\]@#]+$/;
    if(!passwordRegex.test(newpw)){
        return res.status(400).json({ message: "failed", data: "Only letters, numbers, and [, ], @, # characters are allowed."})      
    }

    const encryptedPassword = await encrypt(newpw)

    await Users
    .findOneAndUpdate({ _id: id}, { $set: { password: encryptedPassword }})
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while changing user password. Error: ${err}`)

        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
    })

    return res.status(200).json({ message: "success" })

}


exports.registrationGraph = async (req, res) => {

    const { charttype } =  req.query
    const filter = charttype
    let projectCondition = {};
    let matchCondition = {};
    let groupCondition = {};
    let sortCondition = {};

    if (filter === 'daily') {
        const currentDate = new Date();
        const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(currentDate.setHours(24, 0, 0, 0));

        matchCondition = {
            createdAt: {
              $gte: startOfDay,
              $lt: endOfDay
            }
          }
        projectCondition = {
            hour_created: { $hour: "$createdAt" }
        };
        groupCondition = {
            _id: { hour: "$hour_created" },
            value: { $sum: 1 }
        }
        sortCondition = { "_id.hour": 1 };

    } else if (filter === 'weekly') {

        const currentDate = new Date();
        const startOfWeek = startOfISOWeek(currentDate);
        const endOfWeek = endOfISOWeek(currentDate);

        matchCondition = {
            createdAt: {
                $gte: startOfWeek,
                $lt: endOfWeek
            }
        };
        
        projectCondition = {
            day_of_week: { $dayOfWeek: "$createdAt" }
        };
        
        groupCondition = {
            _id: { day: "$day_of_week" },
            value: { $sum: 1 }
        };
        
        sortCondition = { "_id.day": 1 };

    } else if (filter === 'monthly') {
        const currentYear = new Date().getFullYear();

        const startOfCurrentYear = startOfYear(new Date(currentYear, 0, 1)); 
        const endOfCurrentYear = endOfYear(new Date(currentYear, 0, 1));

        matchCondition = {
            createdAt: {
                $gte: startOfCurrentYear, 
                $lt: endOfCurrentYear 
            }
        };
        projectCondition = {
            month: { 
                $month: "$createdAt" 
            },
        };
       groupCondition = {
            _id: {
                month: "$month"
            },
            value: { 
                $sum: 1 
            }
        };
        sortCondition = { "_id.month": 1 };

    } else if (filter === 'yearly') {    
        projectCondition = {
            year_created: {
                $year: "$createdAt"
            }
        }
        groupCondition = {
            _id: { 
                year: "$year_created"
            },
            value: { 
                $sum: 1 
            }
        };
        sortCondition = { "_id.year": 1 };
    } else {
        return res.status(400).json({ message: "failed", data: "Invalid filter. Use 'daily', 'weekly', 'monthly', or 'yearly'." });
    }

    const data = await Users.aggregate([
        { $match: matchCondition },
        { $project: projectCondition },
        { $group: groupCondition },
        { $sort: sortCondition }
    ]);


    let finalData = {}

    // filtering data 
    if(filter === 'daily'){
        daily.forEach((time, index) => {
            const matchingEntry = data.find(entry => entry._id.hour === index + 1);
            
            finalData[time] = matchingEntry ? matchingEntry.value : 0;
        });
    } else if (filter === 'weekly'){
        weekly.forEach((weekday, index)=>{
            const matchingEntry = data.find(entry => entry._id.day === index + 1);

            finalData[weekday] = matchingEntry ? matchingEntry.value : 0;
        })
    } else if(filter === 'monthly'){
        monthly.forEach((month, index) => {
            const matchingEntry = data.find(entry => entry._id.month === index + 1);

            finalData[month] = matchingEntry ? matchingEntry.value : 0;
        })
    } else if(filter === 'yearly') {

        const releasedYear = 2024
        // const currentYear = new Date().getFullYear();
        const currentYear = 2028;


        for(let year = releasedYear; year <= currentYear; year++){
            const matchingEntry = data.find(entry => entry._id.year === parseInt(year, 10));

            finalData[year] = matchingEntry ? matchingEntry.value : 0;
        }
    } else {
        return res.status(400).json({ message: "failed", data: "Invalid filter. Use 'daily', 'weekly', 'monthly', or 'yearly'." });
    }

    
    return res.json({ message: "success", data: finalData});
}
