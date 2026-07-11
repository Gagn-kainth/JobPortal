const Company = require("../models/Company");
const User = require("../models/User");

const createCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const logoUrl = req.file
      ? `/uploads/companyLogos/${req.file.filename}`
      : "";

    const company = await Company.create({
      name,
      description,
      website,
      location,
      logoUrl,
      createdBy: req.user.id,
    });

    await User.findByIdAndUpdate(req.user.id, { company: company._id });

    res.status(201).json({ message: "Company created", company });
  } catch (error) {
    res.status(500).json({ error: "Failed to create company" });
  }
};

const getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ createdBy: req.user.id });
    if (!company) return res.status(404).json({ error: "Company not found" });
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch company" });
  }
};

const updateCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ createdBy: req.user.id });
    if (!company) return res.status(404).json({ error: "Company not found" });

    const { name, description, website, location } = req.body;
    if (name !== undefined) company.name = name;
    if (description !== undefined) company.description = description;
    if (website !== undefined) company.website = website;
    if (location !== undefined) company.location = location;
    if (req.file)
      company.logoUrl = `/uploads/companyLogos/${req.file.filename}`;

    await company.save();
    res.status(200).json({ message: "Company updated", company });
  } catch (error) {
    res.status(500).json({ error: "Failed to update company" });
  }
};

module.exports = { createCompany, getMyCompany, updateCompany };
