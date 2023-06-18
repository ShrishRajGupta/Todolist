const express = require(`express`);
const app = express();
require('dotenv').config()
const mongoose = require("mongoose");
const connectDB= async ()=>{
    try{
        const connect= await mongoose.connect(process.env.DATA_BASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        
        }).then(() => {
            console.log("db connection success: ");                   
        })
    }
    catch(err){
        console.log(err);
    }
};

module.exports= connectDB;

