const asyncHandler = require('express-async-handler');
const Item = require("../models/items.js");
const List = require("../models/list.js")

const defaultItems = require("../default.js");

const getItems = asyncHandler(async (req, res) => {
        if(!req){
        console.log("req is null");
        res.status(200)
            .json({Msg:"ERRORRRRRR"});
    }
    const foundItems = await Item.find({});
    // console.log(foundItems);

    // Initialize
    if (foundItems.length === 0) {
        Item.insertMany(defaultItems, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully saved items to DB");
            }
        });
        res.redirect("/");
    }
    else{
    console.log(foundItems);
    // console.log(`/ req in else block`);
        res.render("list", { listTitle: "Today", nextItem: foundItems });
    }
});


const postItems = asyncHandler(async (req, res) => {
    if(!req){
        console.log("req is null");
        res.status(200)
            .json({Msg:"ERRORRRRRR"});
        return;
    }
    let ItemName = req.body.newItem;
    let listName = req.body.list;
    console.log(`list ${req.body.list}  ItemName = ${req.body.newItem}`);
    // res.status(200);

    const newItem = new Item({
        name: ItemName
    });

    if(listName === "Today"){
    newItem.save();
    res.redirect("/");
    return;
    }
    else
    {
        List.findOne({name: listName},function(err,foundList){
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/" + listName);
        });
        
    }


});

const deleteItems = asyncHandler( async(req,res)=>{
    const checkedItemId = req.body.checkbox;
    const customListName = req.body.listName;
    
    if(customListName === "Today"){
        await Item.findOneAndRemove({name: checkedItemId},function(err){
            if(!err){
                console.log(`checkedItemId = ${req.body.checkbox} \n customListName = ${req.body.listName} \n\n`);
                res.redirect("/");
            }  
        })
    }
    else{
        await List.findOneAndUpdate({name: customListName},{$pull:{items:{_id: checkedItemId}}},function(err,foundList){
            if(!err){
                res.redirect("/" + customListName);
            }
        });
    }
});

module.exports = {
    getItems,
    postItems,
    deleteItems
};
