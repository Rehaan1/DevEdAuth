const express = require('express');
const verify = require('./verifyToken');
const router = express.Router();


router.get('/',verify,(req,res)=>{
    res.json({user:req.user,posts:{title:'my first post',
    description:'no login no access'}});
});

module.exports = router;