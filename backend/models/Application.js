const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  rollNumber: {
    type: String,
    required: true,
    trim: true
  },
  internshipId: {
    type: Number,
    required: true
  },
  internshipTitle: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);
