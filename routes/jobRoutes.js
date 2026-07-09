const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../middleware/jwtauth");

const { authorizeRecruiter } = require("../middleware/authorizeRecruiter");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

router.post("/jobs", jwtAuthMiddleware, authorizeRecruiter, createJob);
router.get("/jobs", getJobs);
router.get("/jobs/:id", getJobById);
router.put("/jobs/:id", jwtAuthMiddleware, authorizeRecruiter, updateJob);
router.delete("/jobs/:id", jwtAuthMiddleware, authorizeRecruiter, deleteJob);

module.exports = router;
