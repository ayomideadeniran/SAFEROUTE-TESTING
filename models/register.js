const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  vehicleType: { type: String, required: true },
  vehicleReg: { type: String, required: true },
  operatingArea: { 
    type: String, 
    required: true, // Ensure the operating route is mandatory
    enum: [
      "Airport Road",
      "Gwarinpa to Wuse",
      "Kubwa Expressway",
      "Asokoro to Maitama",
      "Central Area to Jabi",
    ], // Restrict values to predefined routes
  },
  licenseNumber: { type: String },
  subscribeAlerts: { type: Boolean, default: false },
  termsOfService: { type: Boolean, required: true },
  email: { type: String, required: true, unique: true }, // Make email unique
  password: { type: String, required: true }, // Password field
});

const Driver = mongoose.model("Driver", driverSchema);

module.exports = Driver;
