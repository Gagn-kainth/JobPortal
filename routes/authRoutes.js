const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware } = require("../middleware/jwtauth");

const{ handleRegister , handleLogins , handleProfile ,updateProfile } = require('../controllers/authController')

router.post('/register',handleRegister)
router.post('/login',handleLogins)
router.get('/profile',jwtAuthMiddleware, handleProfile)
router.put("/profile", jwtAuthMiddleware, updateProfile);
module.exports = router;