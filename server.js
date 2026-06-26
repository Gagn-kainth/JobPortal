const express = require("express");
const db = require("./config/db");
require('dotenv').config();
const app = express();

const UserRoute = require('./routes/authRoutes')
const JobsRoute = require('./routes/jobRoutes')
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Job Portal API Running...");
});


app.use('/',UserRoute);
app.use('/',JobsRoute);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});