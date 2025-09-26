// routes/auth.routes.js
const express = require("express");
const { signup, login, logout, sendOtp, loginOtp } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);          // password login
router.post("/logout", logout);

// OTP routes
router.post("/send-otp", sendOtp);     // send OTP
router.post("/login-otp", loginOtp);   // login with OTP

module.exports = router;
