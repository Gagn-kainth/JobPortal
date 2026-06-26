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
  const userId = req.user.id;

  const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
  });

  res.status(200).json(updatedUser);
};

module.exports = {
  handleRegister,
  handleLogins,
  handleProfile,
  updateProfile,
};
