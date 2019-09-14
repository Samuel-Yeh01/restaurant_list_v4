const mongoose = require("mongoose");
const Todo = require("../restaurant");

mongoose.connect("mongodb://localhost/restaurant", { useNewUrlParser: true });

const db = mongoose.connection;

db.on("error", () => {
  console.log("db error");
});

db.once("open", () => {
  console.log("db connected!");

  for (var i = 0; i < 10; i++) {
    Todo.create({ name: "name-" + i });
  }

  console.log("done");
});
