const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/JobPortal")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Connection failed", err));

 

const db = mongoose.connection;

db.on("connected", () => {
  console.log("MongoDB connection successful");
});

db.on("error", (err) => {
  console.log("MongoDB connection error:", err);
});

db.on("disconnected", () => {
  console.log("MongoDB connection disconnected");
});

module.exports = db;