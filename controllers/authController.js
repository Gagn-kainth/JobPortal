const User = require("../models/User");

const handleRegister = async (req, res) => {
  try {
    const data = req.body;
    const newUser = new User(data);
    await newUser.save();

    res.status(201).json({
      message: "User has registered",
      User: newUser,
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
    res.status(200).json({ message: "Login successful", user })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Invalid Server Error !!" });
  }
};

module.exports = {
  handleRegister,
  handleLogins,
};
