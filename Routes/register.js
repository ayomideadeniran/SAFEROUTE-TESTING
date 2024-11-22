const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const Driver = require("../models/register");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();

// Predefined suggested routes
const suggestedRoutes = [
  "Airport Road",
  "Gwarinpa to Wuse",
  "Kubwa Expressway",
  "Asokoro to Maitama",
  "Central Area to Jabi"
];

// Render registration page with suggested routes
router.get("/register", (req, res) => {
  res.render("register", { suggestedRoutes });
});

// Fetch all drivers
router.get("/drivers", async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.render("drivers", { drivers });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while retrieving drivers.",
      error: error.message
    });
  }
});




// Fetch only phone numbers
router.get("/numbers", async (req, res) => {
  try {
    const drivers = await Driver.find({}, { phone: 1, _id: 0 });
    const phoneNumbers = drivers.map(driver => driver.phone);
    res.status(200).render("Numbers", {
      data: phoneNumbers,
      error: null
    });
  } catch (error) {
    res.status(500).render("Numbers", {
      data: [],
      error: `An error occurred while retrieving phone numbers: ${error.message}`
    });
  }
});

// Handle driver registration and send email
router.post("/submit-register", async (req, res) => {
  const {
    fullName,
    phone,
    vehicleType,
    vehicleReg,
    operatingArea,
    licenseNumber,
    subscribeAlerts,
    termsOfService,
    email,
    password,
    confirmPassword
  } = req.body;

  // Validate terms and password match
  if (termsOfService !== "on") {
    return res
      .status(400)
      .json({ message: "You must agree to the terms of service." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new driver
    const newDriver = new Driver({
      fullName,
      phone,
      vehicleType,
      vehicleReg,
      operatingArea,
      licenseNumber,
      subscribeAlerts: subscribeAlerts === "on",
      termsOfService: termsOfService === "on",
      email,
      password: hashedPassword
    });

    await newDriver.save();

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD // App password for Gmail
      }
    });

    // Define email content
    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL}>`,
      to: "ayomideratata@gmail.com", // The admin email for notification
      // bcc: email, // Send confirmation email to the registered driver
      subject: "New Driver Registration",
      text: `Hello Admin,\n\nA new driver has just registered!\n\nDetails:\n\nName: ${fullName}\nPhone: ${phone}\nVehicle Type: ${vehicleType}\nVehicle Registration: ${vehicleReg}\nRoute Assigned: ${operatingArea}\n\nPlease review the registration details.\n\nBest regards,\nYour App Team`
    };

    // Send email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Failed to send email:", err.message);
      } else {
        console.log("Email sent successfully:", info.response);
      }
    });

    // Respond with success
    res.status(201).json({
      message: "Driver registered successfully and confirmation email sent.",
      data: newDriver
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while registering the driver.",
      error: error.message
    });
  }
});

module.exports = router;
