const express = require('express');
const router = express.Router();

const{ handleRegister , handleLogins } = require('../controllers/authController')

router.post('/register',handleRegister)
router.post('/login',handleLogins)

module.exports = router;