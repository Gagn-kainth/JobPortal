const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../middleware/jwtauth");
const { authorizeRecruiter } = require("../middleware/authorizeRecruiter");
const { jobValidation } = require("../middleware/validators");

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  saveJob,
  unsaveJob,
  getSavedJobs,
  getMyJobs,
} = require("../controllers/jobController");

router.post('/', jwtAuthMiddleware, authorizeRecruiter, jobValidation, createJob);
router.get('/', getJobs);


router.get('/my-jobs', jwtAuthMiddleware, authorizeRecruiter, getMyJobs);
router.get('/saved/my', jwtAuthMiddleware, getSavedJobs);

router.get('/:id', getJobById);
router.put('/:id', jwtAuthMiddleware, authorizeRecruiter, jobValidation, updateJob);
router.delete('/:id', jwtAuthMiddleware, authorizeRecruiter, deleteJob);
router.post('/:id/save', jwtAuthMiddleware, saveJob);
router.delete('/:id/save', jwtAuthMiddleware, unsaveJob);

module.exports = router;