// controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/userSchema");
const Student = require("../Models/student.model");

const generateJWT = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "7d" });
};

// ================= SIGNUP =================
const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    // If student, create Student entry for face recognition
    if (role === "student") {
      await Student.create({ userId: newUser._id });
    }

    res.status(201).json({ message: "User registered successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(403).json({ message: "User not registered" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

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
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
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
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { signup, login, logout };
