const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware } = require("../middleware/jwtauth");

const{ handleRegister , handleLogins , handleProfile } = require('../controllers/authController')

router.post('/register',handleRegister)
router.post('/login',handleLogins)
router.get('/profile',jwtAuthMiddleware, handleProfile)

module.exports = router;