const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // set by authMiddleware
    const user = await User.findById(userId).select("-password");
    console.log("hello")
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load profile" });
  }
};
