const { generateToken } = require("../middleware/jwtauth");
const User = require("../models/User");

const handleRegister = async (req, res) => {
  try {
    const data = req.body;
    const newUser = new User(data);
    const response = await newUser.save();

    const userObj = response.toObject();
    delete userObj.password;

    res.status(201).json({
      message: "User registered successfully",
      user: userObj,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email or username already in use" });
    }
    res.status(500).json({ error: "An error occurred while adding the user." });
  }
};

const handleLogins = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const payload = { id: user.id, username: user.username, role: user.role };
    const token = generateToken(payload);

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCandidateDetails = async (req, res) => {
  try {
    const { skills, experience, education } = req.body;
    const updates = {};
    if (skills !== undefined) updates.skills = skills;
    if (experience !== undefined) updates.experience = experience;
    if (education !== undefined) updates.education = education;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({ message: "Details updated", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update details" });
  }
};

const handleProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, username } = req.body;
    const allowedUpdates = {};
    if (name !== undefined) allowedUpdates.name = name;
    if (username !== undefined) allowedUpdates.username = username;

    const updatedUser = await User.findByIdAndUpdate(userId, allowedUpdates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to change password" });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Image file required" });
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePic: `/uploads/profilePics/${req.file.filename}` },
      { new: true }
    ).select("-password");
    res.status(200).json({ message: "Profile picture updated", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload profile picture" });
  }
};

const uploadResumeFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Resume file required" });
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { resumeUrl: `/uploads/resumes/${req.file.filename}` },
      { new: true }
    ).select("-password");
    res.status(200).json({ message: "Resume uploaded", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload resume" });
  }
};

const addExperience = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.experience.push(req.body);
    await user.save();
    res.status(201).json(user.experience);
  } catch (error) {
    res.status(500).json({ error: "Failed to add experience" });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.experience = user.experience.filter((e) => e._id.toString() !== req.params.expId);
    await user.save();
    res.status(200).json(user.experience);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete experience" });
  }
};

const addEducation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.education.push(req.body);
    await user.save();
    res.status(201).json(user.education);
  } catch (error) {
    res.status(500).json({ error: "Failed to add education" });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.education = user.education.filter((e) => e._id.toString() !== req.params.eduId);
    await user.save();
    res.status(200).json(user.education);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete education" });
  }
};

const searchCandidates = async (req, res) => {
  try {
    const { skills, keyword, page = 1, limit = 10 } = req.query;
    const filter = { role: "candidate" };

    if (skills) {
      const skillArr = skills.split(",").map((s) => s.trim());
      filter.skills = { $in: skillArr.map((s) => new RegExp(s, "i")) };
    }
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { "experience.title": { $regex: keyword, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [candidates, total] = await Promise.all([
      User.find(filter).select("-password").skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      candidates,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to search candidates" });
  }
};

module.exports = {
  handleRegister,
  handleLogins,
  handleProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
  uploadResumeFile,
  updateCandidateDetails,
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation,
  searchCandidates,
};