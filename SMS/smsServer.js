const express = require("express");
const mongoose = require("mongoose");
const Driver = require("./models/register"); // Adjust to your model file path
const path = require("path");
const sendSMS = require("./sendSMS");

const app = express();

// Middleware to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files (e.g., CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/transportDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Route to display the form
app.get("/", async (req, res) => {
    try {
        // Fetch distinct routes from the database
        const routes = await Driver.distinct("operatingArea");

        // Render the form with routes passed to the view
        res.render("index", { routes: routes || [], message: null, error: null });
    } catch (error) {
        console.error("Error fetching routes:", error);
        res.render("index", { routes: [], message: null, error: "Error fetching routes." });
    }
});

// Route to send SMS
app.post("/send-sms", async (req, res) => {
    const { route, message } = req.body;

    if (!route || !message) {
        return res.render("index", { routes: [], message: null, error: "Please select a route and provide a message." });
    }

    try {
        // Fetch the phone numbers of drivers that belong to the selected route
        const drivers = await Driver.find({ operatingArea: route }, { phone: 1 });
        const numbers = drivers.map(driver => driver.phone);

        // Log the fetched numbers
        console.log('Fetched Numbers:', numbers);

        // Send SMS to the selected route's drivers
        await sendSMS(numbers, message);

        res.render("index", { routes: [], message: "SMS sent successfully!", error: null });
    } catch (error) {
        console.error("Error sending SMS:", error);
        res.render("index", { routes: [], message: null, error: "Failed to send SMS. Please try again." });
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port: ${port}`);
});
