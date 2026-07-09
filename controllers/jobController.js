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
    const jobs = await Job.find().populate("createdBy", "name email");
    res.status(200).json(jobs);
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

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob };

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob };
