const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../middleware/jwtauth");
const { uploadResume } = require("../middleware/upload");
const {
  applyToJob,
  getMyApplications,
  withdrawApplication,
  getApplicantsForJob,
  updateApplicationStatus,
} = require("../controllers/applicationController");

router.post(
  "/:jobId",
  jwtAuthMiddleware,
  uploadResume.single("resume"),
  applyToJob
);
router.get("/my", jwtAuthMiddleware, getMyApplications);
router.delete("/:id", jwtAuthMiddleware, withdrawApplication);
router.get("/job/:jobId", jwtAuthMiddleware, getApplicantsForJob);
router.put("/:id/status", jwtAuthMiddleware, updateApplicationStatus);

module.exports = router;
