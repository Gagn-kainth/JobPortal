const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Connect to MongoDB
require("./config/db");

const UserRoute = require("./routes/authRoutes");
const JobsRoute = require("./routes/jobRoutes");
const ApplicationRoute = require("./routes/applicationRoutes");
const CompanyRoute = require("./routes/companyRoutes");
const DashboardRoute = require("./routes/dashboardRoutes");
const InterviewRoute = require("./routes/interviewRoutes");

const app = express();

// Middleware
// server.js
const allowedOrigins = [
  'http://localhost:5173',
  'https://talentpathbygg.vercel.app',
  'https://job-portal-995rt6eyh-gagn-s-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin); // For debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test Route
app.get("/", (req, res) => {
  res.send("Job Portal API Running...");
});

// Routes
app.use("/api/auth", UserRoute);
app.use("/api/jobs", JobsRoute);
app.use("/api/applications", ApplicationRoute);
app.use("/api/companies", CompanyRoute);
app.use("/api/dashboard", DashboardRoute);
app.use("/api/interviews", InterviewRoute);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});