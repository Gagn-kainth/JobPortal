const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../middleware/jwtauth");
const { applicationStatusValidation } = require("../middleware/validators");

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
router.put("/:id/status", jwtAuthMiddleware, applicationStatusValidation, updateApplicationStatus);

module.exports = router;
