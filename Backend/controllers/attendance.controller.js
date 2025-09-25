// controllers/attendance.controller.js
const Attendance = require("../Models/attendanceSchema");

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

module.exports = { markAttendance, getMyAttendance };
