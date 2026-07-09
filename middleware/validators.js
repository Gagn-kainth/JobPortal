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
  body("password").isLength({ min: 6 }).withMessage("Password must be 6+ characters"),
  validate,
];

module.exports = { registerValidation };