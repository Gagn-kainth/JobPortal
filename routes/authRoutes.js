const express = require('express');
const router = express.Router();

const{ handleRegister } = require('../controllers/authController')

router.post('/register',handleRegister)

module.exports = router;