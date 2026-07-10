const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../middleware/jwtauth");
const { authorizeRecruiter } = require("../middleware/authorizeRecruiter");
const { candidateDashboard, recruiterDashboard } = require("../controllers/dashboardController");

router.get("/candidate", jwtAuthMiddleware, candidateDashboard);
router.get("/recruiter", jwtAuthMiddleware, authorizeRecruiter, recruiterDashboard);

module.exports = router;