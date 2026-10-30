require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Student Internship Portal API is running");
});

app.use("/api", applicationRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  });
