// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB connected successfully.");

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected. Retrying...");
      connectDB();
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
