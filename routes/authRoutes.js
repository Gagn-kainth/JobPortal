const express = require('express');
const router = express.Router();
const { registerValidation } = require("../middleware/validators");

const { jwtAuthMiddleware } = require("../middleware/jwtauth");

const{ handleRegister , handleLogins , handleProfile ,updateProfile ,changePassword } = require('../controllers/authController')

router.post('/register',registerValidation, handleRegister);
router.post('/login',handleLogins);
router.get('/profile',jwtAuthMiddleware, handleProfile);
router.put("/profile", jwtAuthMiddleware, updateProfile);
router.put('/change-password', jwtAuthMiddleware, changePassword);

module.exports = router;