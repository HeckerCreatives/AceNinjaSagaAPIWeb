
const Users = require("../models/Users")

const fs = require('fs')

const bcrypt = require('bcrypt');
const jsonwebtokenPromisified = require('jsonwebtoken-promisified');
const path = require("path");

const privateKey = fs.readFileSync(path.resolve(__dirname, "../keys/private-key.pem"), 'utf-8');
const { default: mongoose } = require("mongoose");

const encrypt = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

exports.register = async (req, res) => {
    const { username, password, email } = req.body

    if(username.length < 5 || username.length > 20){
        return res.status(400).json({ message: "failed", data: "Username input must be atleast 5 characters and maximum of 20 characters."})
    }
    if(password.length < 5 || password.length > 20){
        return res.status(400).json({ message: "failed", data: "Password input must be atleast 5 characters and maximum of 20 characters."})
    }
  
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^[a-zA-Z0-9\[\]!@#*]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({ message: "failed", data: "Please input a valid email."})      
    }   
     if(!usernameRegex.test(username)){
        return res.status(400).json({ message: "failed", data: "Special characters like &, %,^ are not allowed. Please input a valid username."})      
    }    
    if(!passwordRegex.test(password)){
        return res.status(400).json({ message: "failed", data: "Special characters are not allowed. Please input a valid password."})      
    }

    const userExists = await Users.findOne({ $or: [{ username: { $regex: `^${username}$`, $options: 'i'}, email: { $regex: `^${email}$`, $options: 'i'}}]})

    if(userExists){
        return res.status(400).json({ message: "failed", data: "Username/Email has already been used."})
    }

    await Users.create({ username: username, password: password, email: email, status: "active", webtoken: "", gametoken: "", bandate: "", banreason: "", auth: "player"})
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem encountered while creating user account. Error: ${err}`)
        return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please try again later."})
    })

    return res.status(200).json({ message: "success"})

}

exports.authlogin = async(req, res) => {
    const { username, password } = req.query;

    Users.findOne({ username: { $regex: new RegExp('^' + username + '$', 'i') } })
    .then(async user => {
        if (user && (await user.matchPassword(password))){
            if (user.status != "active"){
                return res.status(401).json({ message: 'failed', data: `Your account had been ${user.status}! Please contact support for more details.` });
            }
            if (user.auth === "superadmin"){
                const token = await encrypt(privateKey)

                await Users.findByIdAndUpdate({_id: user._id}, {$set: {webtoken: token}}, { new: true })
                .then(async () => {
                    const payload = { id: user._id, username: user.username, status: user.status, token: token, auth: user.auth }

                    let jwtoken = ""

                    try {
                        jwtoken = await jsonwebtokenPromisified.sign(payload, privateKey, { algorithm: 'RS256' });
                    } catch (error) {
                        console.error('Error signing token:', error.message);
                        return res.status(500).json({ error: 'Internal Server Error', data: "There's a problem signing in! Please contact customer support for more details! Error 004" });
                    }

                    res.cookie('sessionToken', jwtoken, { secure: true, sameSite: 'None' } )
                    return res.json({message: "success", data: {
                            auth: user.auth
                        }
                    })
                })
                .catch(err => res.status(400).json({ message: "bad-request2", data: "There's a problem with your account! There's a problem with your account! Please contact customer support for more details."  + err }))
           } else {

               
               const token = await encrypt(privateKey)
               
               await Users.findByIdAndUpdate({_id: user._id}, {$set: {webtoken: token}}, { new: true })
               .then(async () => {
                   const payload = { id: user._id, username: user.username, status: user.status, token: token, auth: "player" }
                   
                   let jwtoken = ""
                   
                   try {
                       jwtoken = await jsonwebtokenPromisified.sign(payload, privateKey, { algorithm: 'RS256' });
                    } catch (error) {
                        console.error('Error signing token:', error.message);
                        return res.status(500).json({ error: 'Internal Server Error', data: "There's a problem signing in! Please contact customer support for more details! Error 004" });
                    }
                    
                    res.cookie('sessionToken', jwtoken, { secure: true, sameSite: 'None' } )
                    return res.json({message: "success", data: {
                        auth: "player",
                    }})
                })
                .catch(err => res.status(400).json({ message: "bad-request2", data: "There's a problem with your account! There's a problem with your account! Please contact customer support for more details."  + err }))
            }
        }
    })
    .catch(err => res.status(400).json({ message: "bad-request1", data: "There's a problem with your account! There's a problem with your account! Please contact customer support for more details." }))
}

exports.logout = async (req, res) => {
    res.clearCookie('sessionToken', { path: '/' })
    return res.json({message: "success"})
}