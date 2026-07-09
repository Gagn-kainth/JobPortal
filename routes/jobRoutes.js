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

router.post("/", jwtAuthMiddleware, authorizeRecruiter, createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.put("/:id", jwtAuthMiddleware, authorizeRecruiter, updateJob);
router.delete("/:id", jwtAuthMiddleware, authorizeRecruiter, deleteJob);

module.exports = router;
