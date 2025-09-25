// routes/attendance.routes.js
const express = require("express");
const { protect } = require("../Middleware/auth.middleware");
const { markAttendance, getMyAttendance } = require("../controllers/attendance.controller");

const router = express.Router();

// POST - Mark attendance
router.post("/mark", protect, markAttendance);

// GET - Get my attendance records
router.get("/my", protect, getMyAttendance);

module.exports = router;
