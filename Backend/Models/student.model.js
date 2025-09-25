// models/student.model.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  faceDescriptor: { type: Array }, // face-api.js descriptor array
  timetable: { type: Array },      // e.g., [{ day: "Monday", class: "Math" }]
  tasks: { type: Array }           // e.g., [{ taskName, freePeriodSlot }]
});

module.exports = mongoose.model("Student", studentSchema);
