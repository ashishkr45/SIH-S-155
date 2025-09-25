// controllers/attendance.controller.js
const Attendance = require("../Models/attendance.model.js");
const User = require("../Models/userSchema");
const markAttendance = async (req, res) => {
  try {
    const { status } = req.body; // optional, default = Present

    const newAttendance = new Attendance({
      student: req.user._id,
      status: status || "Present",
    });

    await newAttendance.save();

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance: newAttendance,
    });
  } catch (error) {
    res.status(500).json({ message: "Error marking attendance", error: error.message });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user._id }).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance", error: error.message });
  }
};

const markAttendanceWithFace = async (req, res) => {
  try {
    const { faceDescriptor } = req.body; // Array from frontend

    if (!faceDescriptor || faceDescriptor.length === 0) {
      return res.status(400).json({ message: "Face descriptor is required" });
    }

    // Fetch the student's stored face descriptor
    const student = await User.findById(req.user._id);

    if (!student.faceDescriptor || student.faceDescriptor.length === 0) {
      return res.status(400).json({ message: "No face data registered for this student" });
    }

    const distance = euclideanDistance(student.faceDescriptor, faceDescriptor);

    if (distance > 0.6) {
      return res.status(401).json({ message: "Face does not match" });
    }

    // Check if already marked today
    const today = new Date().toISOString().split("T")[0];
    const existing = await Attendance.findOne({ student: student._id, date: today });
    if (existing) return res.json({ message: "Already marked" });

    const attendance = await Attendance.create({ student: student._id, date: today });
    res.json({ message: "Attendance marked", attendance });
  } catch (err) {
    res.status(500).json({ message: "Error marking attendance", error: err.message });
  }
};



module.exports = { markAttendance, getMyAttendance,markAttendanceWithFace };
