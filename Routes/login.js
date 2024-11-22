const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const Driver = require("../models/login");
const router = express.Router();
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();


// Use session middleware
router.use(
  session({
    secret: process.env.SESSION_SECRET, // Replace with a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set secure to true if using HTTPS
  })
);

// Login form route
router.get("/login", (req, res) => {
  res.render("login");
});

// Login submission route
router.post("/submit-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Driver.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a session for the user
    req.session.user = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL}>`,
      to: user.email,
      subject: "Login Confirmation",
      text: `Hello ${user.fullName},\n\nYou have successfully logged into your account.`,
    };

    transporter.sendMail(mailOptions).catch((err) => {
      console.error("Email send failed:", err.message); // Log email errors without blocking the login response
    });

    res.status(200).json({
      message: "Login successful",
      session: req.session.user, // Include session data in the response
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Protected route example
router.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized access. Please log in." });
  }

  res.status(200).json({
    message: "Welcome to the dashboard!",
    user: req.session.user,
  });
});

// Logout route
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out." });
    }
    res.status(200).json({ message: "Logged out successfully." });
  });
});

module.exports = router;
