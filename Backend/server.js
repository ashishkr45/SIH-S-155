// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./Routes/auth.routes.js";
import attendanceRoutes from "./Routes/attendance.routes.js";

// Load env variables
dotenv.config();

const app = express();
connectDB();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
