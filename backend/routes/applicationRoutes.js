const express = require("express");
const Application = require("../models/Application");

const router = express.Router();

const internships = [
  { id: 1, title: "Web Development Intern", company: "Tech Solutions", duration: "3 Months", location: "Remote", description: "Work on React and Node.js projects." },
  { id: 2, title: "Data Analyst Intern", company: "Data Labs", duration: "2 Months", location: "Coimbatore", description: "Work with Python, SQL and data analysis." },
  { id: 3, title: "AI/ML Intern", company: "Innovate AI", duration: "6 Months", location: "Bangalore", description: "Work on machine learning projects." }
];

// Get all internships
router.get("/internships", (req, res) => {
  res.json(internships);
});

// Get internship details
router.get("/internships/:id", (req, res) => {
  const internship = internships.find(i => i.id === Number(req.params.id));

  if (!internship) {
    return res.status(404).json({ message: "Internship not found" });
  }

  res.json(internship);
});

// Submit application
router.post("/applications", async (req, res) => {
  try {
    const { name, email, rollNumber, internshipId } = req.body;

    if (!name || !email || !rollNumber || !internshipId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const internship = internships.find(i => i.id === Number(internshipId));

    if (!internship) {
      return res.status(400).json({ message: "Invalid internship selected" });
    }

    const application = await Application.create({
      name,
      email,
      rollNumber,
      internshipId: internship.id,
      internshipTitle: internship.title
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit application" });
  }
});

// Get all applications
router.get("/applications", async (req, res) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve applications" });
  }
});

module.exports = router;
