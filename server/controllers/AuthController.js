const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");
const sendEmail = require("../middleware/nodemailer");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
  const { name, email, rollNo, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email,rollNo, password: hashedPassword, role });

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await Otp.deleteMany({ email }); // clear old OTPs
    await Otp.create({ email, code, expiresAt });
    await sendEmail(email, "Verify your email", `Your OTP is: ${code}`);

    res.status(201).json({ message: "User registered. OTP sent to email." });
  } catch (err) {
    res.status(500).json({ error: "Server error during registration" });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpEntry = await Otp.findOne({ email });
    if (!otpEntry || otpEntry.code !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    if (Date.now() > otpEntry.expiresAt)
      return res.status(400).json({ error: "OTP expired" });

    await User.findOneAndUpdate({ email }, { isVerified: true });
    await Otp.deleteOne({ email });

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ error: "OTP verification failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    if (!user.isVerified)
      return res.status(401).json({ error: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { name: user.name, role: user.role, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};
