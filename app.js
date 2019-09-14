// require packages used in the project
const express = require("express");
const app = express();

// 引入 db ODM
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/restaurant", { useNewUrlParser: true });
// mongoose 連線後透過 mongoose.connection 拿到 Connection 的物件
const db = mongoose.connection;
// db 連線異常
db.on("error", () => {
  console.log("mongodb error!");
});
// db 連線成功
db.once("open", () => {
  console.log("mongodb connected!");
});

// 引入 mongoose model
const Restaurant = require("./models/restaurant.js");

// 引入 express-handlebars & 設定 template engine
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const bodyParser = require("body-parser");
const methodOverride = require("method-override");
// setting static files
app.use(express.static("public"));
// 設定 bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
// 設定 method-override
app.use(methodOverride("_method"));

// // 載入路由器 (從 routes 資料夾較路徑，暫時註解)
// app.use("/", require("./routes/home"));
// app.use("/todos", require("./routes/restaurant"));

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
