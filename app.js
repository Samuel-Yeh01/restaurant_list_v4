// require packages used in the project
const express = require("express");
const app = express();

// require express-handlebars here
const exphbs = require("express-handlebars");
const restaurantList = require("./models/restaurant.js");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

// setting template engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// setting static files
app.use(express.static("public"));

// 設定 bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
// 設定 method-override
app.use(methodOverride("_method"));

// 載入路由器
app.use("/", require("./routes/home"));
app.use("/todos", require("./routes/restaurant"));

mongoose.connect("mongodb://localhost/restaurant", { useNewUrlParser: true }); // 設定連線到 mongoDB

// mongoose 連線後透過 mongoose.connection 拿到 Connection 的物件
const db = mongoose.connection;

// 連線異常
db.on("error", () => {
  console.log("mongodb error!");
});

// 連線成功
db.once("open", () => {
  console.log("mongodb connected!");
});

// routes setting
app.get("/", (req, res) => {
  // past the restaurant data into 'index' partial template
  res.render("index", { restaurants: restaurantList.results });
});

app.get("/restaurants/:restaurant_id", (req, res) => {
  // console.log("req.params.restaurant_id", req.params.restaurant_id);
  const restaurant = restaurantList.results.find(
    restaurant => restaurant.id.toString() === req.params.restaurant_id
  );
  res.render("show", { restaurant: restaurant });
});

app.get("/search", (req, res) => {
  const keyword = req.query.keyword;
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase());
  });
  res.render("index", { restaurants: restaurants, keyword: keyword });
});

// start and listen on the Express server
app.listen(3000, () => {
  console.log("App is running!");
});
