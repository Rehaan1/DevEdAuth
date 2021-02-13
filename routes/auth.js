const express = require('express');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const {registerValidation,loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');

const router = express.Router();

//REGISTER
router.post('/register',async (req,res)=>{
    
    //VALIDATING DATA
    const {error} = registerValidation(req.body);
    if(error)
    {
        return res.status(400).send(error.details[0].message);
    }

    //CHECKING IF USER IS ALREADY IN DATABASE
    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist)
    {
        return res.status(400).send('Email Already Exists');
    }

    //HASH THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    //CREATE A NEW USER
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try{
        const savedUser = await user.save();
        res.send({user: savedUser._id});
    }
    catch(err){
        res.status(400).send(err);
    }
    
});

//LOGIN
router.post('/login',async (req,res)=>{

    //VALIDATING DATA
    const {error} = loginValidation(req.body);
    if(error)
    {
        return res.status(400).send(error.details[0].message);
    }

    //CHECKING IF EMAIL EXISTS
    const user = await User.findOne({email:req.body.email});
    if(!user)
    {
        return res.status(400).send('Email or Password Does Not Exist');
    }

    //CHECKING IF PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password,user.password);
    
    if(!validPass)
    {
        return res.status(400).send('Invalid Password or Email');
    }

    //CREATE AND ASSIGN A TOKEN
    const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);

});


module.exports = router;