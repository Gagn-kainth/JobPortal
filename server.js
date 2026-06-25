const express = require("express");
const db = require("./config/db");
const app = express();

const UserRoute = require('./routes/authRoutes')

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Job Portal API Running...");
});


app.use('/',UserRoute);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});