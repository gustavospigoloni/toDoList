const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/toDoListDB");
mongoose.set('strictQuery', false);

const itemSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemSchema);

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) => {
    if (err) console.log(err);
    else res.render("list", { title: "Today", foundItems: foundItems });
  });
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, (err, foundList) => {
    if (!err) {
      if(!foundList) {
        const list = new List ({
          name: customListName,
          items: []
        })
      
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", { title: foundList.name, foundItems: foundList.items })
      }
    }
  });

});

app.post("/", (req, res) => {
  const newListItem = req.body.newItem;
  const listName = req.body.button;

  const newItem = new Item ({
    name: newListItem
  });

  if(listName === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, (err, foundList) => {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
  
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, (err, foundItems) => {
      if (err) console.log(err);
      else {
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) => {
      if (!err){
        res.redirect("/" + foundList.name);
      }
    });
  }


  
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
