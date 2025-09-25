const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  faceDescriptor: { type: [Number] }, // store face-api.js descriptor array
  timetable: { type: Array },
  tasks: { type: Array },
});

module.exports = mongoose.model("User", studentSchema);
