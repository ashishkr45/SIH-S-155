// controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../Models/userSchema");
const Student = require("../Models/student.model");
const dotenv = require('dotenv');
dotenv.config();

// JWT generator
const generateJWT = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "7d" });
};

// Temporary OTP store (in-memory, expires in 5 mins)
let otpStore = {};
console.log(process.env.SMTP_PORT);

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // should be smtp.gmail.com
  port: parseInt(process.env.SMTP_PORT), // 587
  secure: process.env.SMTP_SECURE === "true", // false for 587
  auth: {
    user: process.env.SMTP_USER, // your Gmail
    pass: process.env.SMTP_PASS, // App Password
  },
});

// ================= SIGNUP =================
const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    if (role === "student") {
      await Student.create({ userId: newUser._id });
    }

    res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// ================= LOGIN (password) =================
const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ email, role });
    if (!user)
      return res
        .status(403)
        .json({ message: "User not registered", success: false });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });

    const token = generateJWT({ userId: user._id, role: user.role });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      success: true,
      user: { id: user._id, name: user.name, role: user.role, token },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Internal server error",
        error: error.message,
        success: false,
      });
  }
};

// ================= SEND OTP =================
const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // expires in 5 mins

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your Login OTP",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("error in sendOtp in auth.controller", error);

    res.status(500).json({ message: error.message, success: false });
  }
};

// ================= LOGIN (OTP) =================
const loginOtp = async (req, res) => {
  const { email, otp, role } = req.body;
  try {
    const user = await User.findOne({ email, role });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    const record = otpStore[email];
    if (!record)
      return res
        .status(400)
        .json({ message: "OTP not requested", success: false });
    if (record.expires < Date.now())
      return res.status(400).json({ message: "OTP expired", success: false });
    if (record.otp != otp)
      return res.status(400).json({ message: "Invalid OTP", success: false });

    // OTP valid → delete
    delete otpStore[email];

    const token = generateJWT({ userId: user._id, role: user.role });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "OTP login successful",
      user: { id: user._id, name: user.name, role: user.role, token },
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// ================= LOGOUT =================
const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({ message: "Logout successful", success: true });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Internal server error",
        error: error.message,
        success: false,
      });
  }
};

module.exports = { signup, login, logout, sendOtp, loginOtp };
