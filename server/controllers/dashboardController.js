const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");

const candidateDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const [statusBreakdown, savedJobsCount, totalApplied] = await Promise.all([
      Application.aggregate([
        { $match: { candidate: new (require("mongoose").Types.ObjectId)(userId) } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      User.findById(userId).then((u) => u.savedJobs.length),
      Application.countDocuments({ candidate: userId }),
    ]);

    res.status(200).json({ totalApplied, savedJobsCount, statusBreakdown });
  } catch (error) {
    res.status(500).json({ error: "Failed to load dashboard" });
  }
};

const recruiterDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const mongoose = require("mongoose");

    const jobsPosted = await Job.countDocuments({ createdBy: userId });

    const applicantsPerJob = await Application.aggregate([
      { $lookup: { from: "jobs", localField: "job", foreignField: "_id", as: "jobInfo" } },
      { $unwind: "$jobInfo" },
      { $match: { "jobInfo.createdBy": new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$job", jobTitle: { $first: "$jobInfo.title" }, count: { $sum: 1 } } },
    ]);

    const statusBreakdown = await Application.aggregate([
      { $lookup: { from: "jobs", localField: "job", foreignField: "_id", as: "jobInfo" } },
      { $unwind: "$jobInfo" },
      { $match: { "jobInfo.createdBy": new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({ jobsPosted, applicantsPerJob, statusBreakdown });
  } catch (error) {
    res.status(500).json({ error: "Failed to load dashboard" });
  }
};

module.exports = { candidateDashboard, recruiterDashboard };