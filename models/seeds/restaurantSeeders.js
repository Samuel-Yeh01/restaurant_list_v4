const mongoose = require("mongoose");
const Restaurant = require("../restaurant.js");
const restaurants = require("./restaurant.json").results;

mongoose.connect("mongodb://localhost/restaurant", { useNewUrlParser: true });

const db = mongoose.connection;

db.on("error", () => {
  console.log("db error");
});

db.once("open", async () => {
  console.log("mongoDB is connected.");

  for (const item of restaurants) {
    await Restaurant.create(item); // 等待 mongoDB 創建完成
  }

  // mongoDB 創建完成後，才執行
  console.log("seeder created successfully");
  process.exit();
  // 離開程式
});
