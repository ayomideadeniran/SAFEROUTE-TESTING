const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  vehicleType: { type: String, required: true },
  vehicleReg: { type: String, required: true },
  operatingArea: { type: String, index: true },  // Index to improve query performance
  licenseNumber: { type: String },
  subscribeAlerts: { type: Boolean, default: false },
  termsOfService: { type: Boolean, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Driver = mongoose.model("Driver", driverSchema);

module.exports = Driver;
