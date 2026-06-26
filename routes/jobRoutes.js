const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware } = require("../middleware/jwtauth");

const{authorizeRecruiter}=require('../middleware/authorizeRecruiter')
const { createJob } = require('../controllers/jobController');

router.post('/jobs',jwtAuthMiddleware,authorizeRecruiter,createJob);

module.exports = router;