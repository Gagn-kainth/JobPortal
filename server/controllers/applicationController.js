const Application = require("../models/Application");
const Job = require("../models/Job");

const User = require("../models/User");


const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    let resumeUrl;
    if (req.file) {
      // candidate uploaded a fresh resume for this specific application
      resumeUrl = `/uploads/resumes/${req.file.filename}`;
    } else {
      // fall back to their saved profile resume
      const user = await User.findById(req.user.id);
      if (!user.resumeUrl) {
        return res.status(400).json({ error: "No resume found. Please upload a resume." });
      }
      resumeUrl = user.resumeUrl;
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
      resumeUrl,
      coverLetter,
    });

    res.status(201).json({ message: "Applied successfully", application });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "You already applied to this job" });
    }
    console.error(error);
    res.status(500).json({ error: "Failed to apply to job" });
  }
};
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate("job", "title company location salary jobType")
      .sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ error: "Application not found" });

    if (application.candidate.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await application.deleteOne();
    res.status(200).json({ message: "Application withdrawn" });
  } catch (error) {
    res.status(500).json({ error: "Failed to withdraw application" });
  }
};

const getApplicantsForJob = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const filter = { job: req.params.jobId };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate("candidate", "name email skills resumeUrl profilePic")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Application.countDocuments(filter),
    ]);

    res.status(200).json({ applications, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applicants" });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const application = await Application.findById(req.params.id).populate("job");
    if (!application) return res.status(404).json({ error: "Application not found" });

    if (application.job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: "Status updated", application });
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

const getAllApplicantsForRecruiter = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const jobs = await Job.find({ createdBy: req.user.id }).select("_id");
    const jobIds = jobs.map((j) => j._id);

    const filter = { job: { $in: jobIds } };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate("candidate", "name email skills resumeUrl profilePic")
        .populate("job", "title")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Application.countDocuments(filter),
    ]);

    res.status(200).json({ applications, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applicants" });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  withdrawApplication,
  getApplicantsForJob,
  getAllApplicantsForRecruiter,
  updateApplicationStatus,
};