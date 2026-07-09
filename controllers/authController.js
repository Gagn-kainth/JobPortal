const { generateToken } = require("../middleware/jwtauth");
const User = require("../models/User");

const handleRegister = async (req, res) => {
  try {
    const data = req.body;
    const newUser = new User(data);
    const response = await newUser.save();
    console.log("data saved !");

    const payload = {
      id: response.id,
      username: response.username,
      role: response.role,
    };

    const token = generateToken(payload);
    const userObj = response.toObject();
    delete userObj.password;

    res.status(201).json({
      token: token,
      message: "User has registered",
      User: response,
    });
  } catch (error) {
    console.error("Error adding User :", error);

    res
      .status(500)
      .json({ error: "An error occurred while adding the user ." });
  }
};

const handleLogins = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    const token = generateToken(payload);

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Invalid Server Error !!" });
  }
};

const handleProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error",
    });
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

module.exports = {
  handleRegister,
  handleLogins,
  handleProfile,
  updateProfile,
  changePassword,
};
