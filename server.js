const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const db = require("./config/db");

const UserRoute = require("./routes/authRoutes");
const JobsRoute = require("./routes/jobRoutes");
const ApplicationRoute = require("./routes/applicationRoutes");
const CompanyRoute = require("./routes/companyRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.send("Job Portal API Running..."));

app.use("/api/auth", UserRoute);
app.use("/api/jobs", JobsRoute);
app.use("/api/applications", ApplicationRoute);
app.use("/api/companies", CompanyRoute);

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));