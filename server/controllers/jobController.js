const Job = require("../models/Job");

const createJob = async (req, res) => {
  try {
    const newJob = new Job({
      ...req.body,
      createdBy: req.user.id,
    });

    const response = await newJob.save();

    res.status(201).json({
      message: "Job added successfully",
      job: response,
    });
  } catch (error) {
    console.error("Error adding Job:", error);
    res.status(500).json({
      error: "An error occurred while adding a job.",
    });
  }
};


const getJobs = async (req, res) => {
  try {
    const {
      keyword, location, jobType, experienceLevel,
      minSalary, maxSalary, sortBy = "latest",
      page = 1, limit = 10,
    } = req.query;

    const filter = {};

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }
    if (location) filter.location = { $regex: location, $options: "i" };
    if (jobType) filter.jobType = jobType;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (minSalary || maxSalary) {
      filter.salary = {};
      if (minSalary) filter.salary.$gte = Number(minSalary);
      if (maxSalary) filter.salary.$lte = Number(maxSalary);
    }

    const sortMap = {
      latest: { createdAt: -1 },
      salary: { salary: -1 },
      experience: { experienceLevel: 1 },
    };
    const sort = sortMap[sortBy] || sortMap.latest;

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(filter).populate("createdBy", "name email").sort(sort).skip(skip).limit(Number(limit)),
      Job.countDocuments(filter),
    ]);

    res.status(200).json({
      jobs,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch job" });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });


    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to edit this job" });
    }

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update job" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (job.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete job" });
  }
};

const saveJob = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { $addToSet: { savedJobs: req.params.id } });
  res.status(200).json({ message: "Job saved" });
};

const unsaveJob = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { $pull: { savedJobs: req.params.id } });
  res.status(200).json({ message: "Job unsaved" });
};

const getSavedJobs = async (req, res) => {
  const user = await User.findById(req.user.id).populate("savedJobs");
  res.status(200).json(user.savedJobs);
};

const getMyJobs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find({ createdBy: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments({ createdBy: req.user.id }),
    ]);

    res.status(200).json({ jobs, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch your jobs" });
  }
};
module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob , saveJob, unsaveJob, getSavedJobs , getMyJobs};
