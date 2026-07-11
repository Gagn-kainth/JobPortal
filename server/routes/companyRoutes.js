const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../middleware/jwtauth");
const { authorizeRecruiter } = require("../middleware/authorizeRecruiter");
const { uploadCompanyLogo } = require("../middleware/upload");
const { companyValidation } = require("../middleware/validators");

const {
  createCompany,
  getMyCompany,
  updateCompany,
} = require("../controllers/companyController");

router.post(
  "/",
  jwtAuthMiddleware,
  authorizeRecruiter,
  uploadCompanyLogo.single("logo"),
  companyValidation,
  createCompany
);
router.get("/my", jwtAuthMiddleware, authorizeRecruiter, getMyCompany);

router.put(
  "/",
  jwtAuthMiddleware,
  authorizeRecruiter,
  uploadCompanyLogo.single("logo"),
  companyValidation,
  updateCompany
);

module.exports = router;
