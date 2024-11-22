const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(v);
      },
      message: "Please enter a valid email address"
    }
  },
  password: {
    type: String,
    required: true
  }
});

const Driver = mongoose.model("Drivers", userSchema);

module.exports = Driver;
