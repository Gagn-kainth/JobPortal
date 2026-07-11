const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerValidation = [
  body("email").isEmail().withMessage("Valid email required"),
  body("username").trim().notEmpty().withMessage("Username required"),
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain a lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain a number")
    .matches(/[^A-Za-z0-9]/).withMessage("Password must contain a special character"),
  validate,
];

const loginValidation = [
  body("username").trim().notEmpty().withMessage("Username or email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];
const changePasswordValidation = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword").isLength({ min: 6 }).withMessage("New password must be 6+ characters"),
  validate,
];

const jobValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("company").trim().notEmpty().withMessage("Company is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("salary").isNumeric().withMessage("Salary must be a number"),
  body("jobType")
    .isIn(["Full-time", "Part-time", "Internship", "Contract", "Remote"])
    .withMessage("Invalid job type"),
  body("experienceLevel")
    .isIn(["Fresher", "Junior", "Intermediate", "Senior"])
    .withMessage("Invalid experience level"),
  validate,
];

const applicationStatusValidation = [
  body("status")
    .isIn(["Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"])
    .withMessage("Invalid status value"),
  validate,
];

const companyValidation = [
  body("name").trim().notEmpty().withMessage("Company name is required"),
  validate,
];

module.exports = {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  jobValidation,
  applicationStatusValidation,
  companyValidation,
};