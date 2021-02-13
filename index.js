require('dotenv/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


//CONNECT TO DB
mongoose.connect(process.env.DB_CONNECTION,{ useUnifiedTopology: true, useNewUrlParser: true })
.then(()=>{
    console.log("Connected to DB");
})
.catch(err =>{
    console.log("Error:"+err);
});

//IMPORT ROUTE
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

const app = express();

//MIDDLEWARE
app.use(bodyParser.json());

//ROUTE MIDDLEWARE
app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);


app.listen(3000,()=>{
    console.log("Server Up and Running");
});