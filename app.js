//******env setting******
// require packages used in the project
const express = require("express");
const app = express();
// 判斷 dev env.(開發環境)
if (process.env.NODE_ENV !== "production") {
  // 若非 production model
  require("dotenv").config();
  // 則用 dotenv 讀取 .env 檔案
}
// setting static files
app.use(express.static("public"));

//******introduce middleware******
// 引入 express-handlebars & 設定 template engine
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// require body-parser & body-parser
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
// setting bodyParser & body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// require express-session
const session = require("express-session");
// register express-session and set
app.use(
  session({
    secret: "your secret key",
    // setting a private key own by yourself
    resave: false,
    saveUninitialized: true
  })
);

// require passport
const passport = require("passport");
// use passport
app.use(passport.initialize());
app.use(passport.session());
// load passport config
require("./config/passport")(passport);

// 引入 connect-flash 用法&介紹
// 1. https://www.itread01.com/p/982024.html
// 2. http://bit.ly/2kn1F7a
const flash = require("connect-flash");
app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.isAuthenticated = req.isAuthenticated();
  // 檢查用戶是否登入成功
  res.locals.success_msg = req.flash("congrats", "Login Success");
  res.locals.warning_msg = req.flash("warning", "ID or password error");
  next();
});

//******引入 db ODM******
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/restaurant", {
  useNewUrlParser: true,
  useCreateIndex: true
});
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

// routes setting
app.use("/", require("./routes/home"));
app.use("/restaurants", require("./routes/restaurant"));
// 因路由設定出問題，以下先暫時註解
// app.use("/search", require("./routes/search"));
// app.use("/users", require("./routes/users"));
// app.use("/auth", require("./routes/auths"));

// start and listen on the Express server
app.listen(3000, () => {
  console.log(`App is running at http://localhost:${port}`);
});
