const express = require("express");
const path = require("path");

const { calculateBMI, getBMICategory } = require("./calculate");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/bmi", (req, res) => {

  const weight = parseFloat(req.query.weight);
  const height = parseFloat(req.query.height);

  if (!req.query.weight || !req.query.height) {
    return res.status(400).send("Weight and height are required");
  }

  if (isNaN(weight) || isNaN(height)) {
    return res.status(400).send("Weight and height must be valid numbers");
  }

  if (weight <= 0 || height <= 0) {
    return res.status(400).send("Weight and height must be greater than zero");
  }

  const bmi = calculateBMI(weight, height);

  const category = getBMICategory(bmi);

  res.send(`BMI: ${bmi}, Category: ${category}`);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});