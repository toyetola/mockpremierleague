const express = require("express");
const router = require("express").Router();
const User = require("../app/models/userModel.js");
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

var session = require('express-session');
const app = express();

app.use(session({ secret: 'keyboard', cookie: { maxAge: 3600000 }}))

const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    confirm_password:Joi.string().required().valid(Joi.ref('password')),
    role: Joi.string().required()
});



router.post("/register", async (req, res) => {
    // validate the user input
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const isEmailExist = await User.findOne({ email: req.body.email });
    if (isEmailExist)
        return res.status(400).json({ error: "Email already exists" });

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);   
    if(req.body.role != "user") return res.status(401).json({"error":"not authorized", "message":"Your should use the user registeration route"}) 
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password,
        role: req.body.role    
    });

    try{
        const savedUser = await user.save();
        if(savedUser)
            return res.json({ data:savedUser, message:"success" })  
        else
            return res.json({ error:1, message:"could not save the details" })         
    }catch (error){
        return res.status(400).json({ error : "fatal error: cannot determine error"});  
    }
});

    // login route
router.post("/login", async (req, res) => {
    // validate the user input
    const loginValidation = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).max(1024).required(),
    });
    const { error } = loginValidation.validate(req.body);
    // throw validation errors
    if (error) return res.status(400).json({ error:   error.details[0].message });
    const user = await User.findOne({ email: req.body.email });
    // throw error when email is wrong
    if (!user) return res.status(400).json({ error: "Email is wrong" });
    // check for password correctness
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
    return res.status(400).json({ error: "Password is wrong" });

    // create token
    const token = jwt.sign(
        // payload data
        {
        name: user.name,
        id: user._id,
        },
        process.env.TOKEN_SECRET
    );

    req.session.theuser = user

    res.header("auth-token", token).json({
        data: {
            message:"Login successful",
            token,
        },
    });


    /* res.json({
      error: null,
      data: {
        message: "Login successful",
        user: user
      },
    }); */
  });

// adminlogin
router.post("/registerAdmin", async (req, res) => {
    // validate the user input
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const isEmailExist = await User.findOne({ email: req.body.email });
    if (isEmailExist)
        return res.status(400).json({ error: "Email already exists" });

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);   
    if(req.body.role != "admin") return res.status(401).json({"error":"not authorized", "message":"Your should use the admin registeration route"}) 
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password,
        role: req.body.role    
    });

    try{
        const savedUser = await user.save();
        if(savedUser)
            return res.json({ data:savedUser, message:"success" })  
        else
            return res.json({ error:1, message:"could not save the details" })         
    }catch (error){
        return res.status(400).json({ error : "fatal error: cannot determine error"});  
    }
});

router.get('/logout',function(req,res){
    if(req.session.theuser) {
        req.session.destroy(function(){
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;