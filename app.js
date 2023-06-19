const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");
const Item=require("./models/items.js")
const List = require("./models/list.js")

const connectDB=require('./config/conn.js');
connectDB();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
// app.use(express.json());

const port = process.env.PORT || 3000;

const itemRoute= require("./routes/itemRoutes.js")
const customRoutes = require("./routes/customRoutes.js")
app.use(itemRoute);
app.use(customRoutes);



app.listen(port,()=>{
    console.log("Listening to port = "+port);
});
