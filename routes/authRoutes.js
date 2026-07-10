const express = require("express");
const router = express.Router();
const { registerValidation } = require("../middleware/validators");

const { jwtAuthMiddleware } = require("../middleware/jwtauth");

const {
  handleRegister,
  handleLogins,
  handleProfile,
  updateProfile,
  changePassword,
    updateCandidateDetails,
  searchCandidates,
} = require("../controllers/authController");
const { uploadProfilePic, uploadResume } = require("../middleware/upload");
const {
  uploadProfilePicture,
  uploadResumeFile,
} = require("../controllers/authController");

router.post("/register", registerValidation, handleRegister);
router.post("/login", handleLogins);
router.get("/profile", jwtAuthMiddleware, handleProfile);
router.get("/candidates/search", jwtAuthMiddleware, authorizeRecruiter, searchCandidates);
router.put("/profile", jwtAuthMiddleware, updateProfile);
router.put("/change-password", jwtAuthMiddleware, changePassword);
router.put("/details", jwtAuthMiddleware, updateCandidateDetails);
router.post(
  "/profile-pic",
  jwtAuthMiddleware,
  uploadProfilePic.single("profilePic"),
  uploadProfilePicture
);
router.post(
  "/resume",
  jwtAuthMiddleware,
  uploadResume.single("resume"),
  uploadResumeFile
);

module.exports = router;
