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


module.exports ={createJob};