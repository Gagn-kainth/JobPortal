const Interview = require("../models/Interview");
const Application = require("../models/Application");

const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, scheduledAt, mode, notes } = req.body;

    const application = await Application.findById(applicationId).populate("job candidate");
    if (!application) return res.status(404).json({ error: "Application not found" });

    if (application.job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const interview = await Interview.create({
      application: applicationId,
      candidate: application.candidate._id,
      recruiter: req.user.id,
      job: application.job._id,
      scheduledAt,
      mode,
      notes,
    });

    res.status(201).json({ message: "Interview scheduled", interview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to schedule interview" });
  }
};

const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ candidate: req.user.id })
      .populate("job", "title company")
      .sort({ scheduledAt: 1 });
    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch interviews" });
  }
};

const getRecruiterInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ recruiter: req.user.id })
      .populate("candidate", "name email")
      .populate("job", "title")
      .sort({ scheduledAt: 1 });
    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch interviews" });
  }
};

module.exports = { scheduleInterview, getMyInterviews, getRecruiterInterviews };