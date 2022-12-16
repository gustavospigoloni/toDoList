const express = require("express");
const bodyParser = require("body-parser");

const app = express();
let newListItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  let today = new Date();

  let day = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  res.render("list", { day: day, newListItems: newListItems });
});

app.post("/", (req, res) => {
  let newListItem = req.body.newItem;
  newListItems.push(newListItem);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
