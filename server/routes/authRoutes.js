const express = require("express");
const router = express.Router();
const {
  registerValidation,
  loginValidation,
  changePasswordValidation,
} = require("../middleware/validators");

const { jwtAuthMiddleware } = require("../middleware/jwtauth");
const { authorizeRecruiter } = require("../middleware/authorizeRecruiter");

const {
  handleRegister,
  handleLogins,
  handleProfile,
  updateProfile,
  changePassword,
  updateCandidateDetails,
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation,
  searchCandidates,
  uploadProfilePicture,
  uploadResumeFile,
} = require("../controllers/authController");
const { uploadProfilePic, uploadResume } = require("../middleware/upload");

router.post("/register", registerValidation, handleRegister);
router.post("/login", loginValidation, handleLogins);
router.get("/profile", jwtAuthMiddleware, handleProfile);
router.get(
  "/candidates/search",
  jwtAuthMiddleware,
  authorizeRecruiter,
  searchCandidates
);
router.put("/profile", jwtAuthMiddleware, updateProfile);
router.put(
  "/change-password",
  jwtAuthMiddleware,
  changePasswordValidation,
  changePassword
);
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
router.post("/experience", jwtAuthMiddleware, addExperience);
router.delete("/experience/:expId", jwtAuthMiddleware, deleteExperience);
router.post("/education", jwtAuthMiddleware, addEducation);
router.delete("/education/:eduId", jwtAuthMiddleware, deleteEducation);

module.exports = router;
