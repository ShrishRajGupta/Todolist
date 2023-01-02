const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-abhi:TEST-123@cluster0.8jqsezr.mongodb.net/todolistDB");

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to todo list"
});
const item2 = new Item({
    name: "Use + to add new items"
});
const item3 = new Item({
    name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items:[itemsSchema]
};
const List = mongoose.model("List", listSchema);

app.get("/",function(req,res){
    
    Item.find({},function(err,foundItems){

        if(foundItems.length === 0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Successfully saved items to DB");
                }
            });
            res.redirect("/");
        }
        else
        res.render("list",{listTitle: "Today", nextItem: foundItems});
    });
    
});
app.post("/",function(req,res){
    
    const ItemName = req.body.newItem;
    const listName = req.body.list;
    
    const newItem = new Item({
        name: ItemName
    });
    if(listName === "Today"){
    newItem.save();
    res.redirect("/");
    }else{
        List.findOne({name: listName},function(err,foundList){
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/" + listName);
        });
        
    }
    
});

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
    const customListName = req.body.listName;
    

    if(customListName === "Today"){
        Item.findByIdAndRemove(checkedItemId,function(err){
            if(!err){
                console.log("SUCCESS");
                res.redirect("/");
            }  
        });
    }else{
        List.findOneAndUpdate({name: customListName},{$pull:{items:{_id: checkedItemId}}},function(err,foundList){
            if(!err){
                res.redirect("/" + customListName);
            }
        });
    }
    
    
});

app.get("/:customListName", function(req,res){
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name: customListName},function(err,foundList){
        if(!err){
            if(!foundList){

                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/"+ customListName);
            }else{
                
                res.render("list",{listTitle: foundList.name, nextItem: foundList.items});
            }
        }
    });
    
});


let port = process.env.PORT;
if(port == NULL||port == ""){
    port = 3000;
}
app.listen(port,function(){
    console.log("SERVER STARTED SUCCESSFULLY");
});
