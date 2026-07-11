const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../middleware/jwtauth");
const { authorizeRecruiter } = require("../middleware/authorizeRecruiter");
const {
  scheduleInterview,
  getMyInterviews,
  getRecruiterInterviews,
} = require("../controllers/interviewController");

router.post("/", jwtAuthMiddleware, authorizeRecruiter, scheduleInterview);
router.get("/my", jwtAuthMiddleware, getMyInterviews);
router.get(
  "/recruiter",
  jwtAuthMiddleware,
  authorizeRecruiter,
  getRecruiterInterviews
);

module.exports = router;
