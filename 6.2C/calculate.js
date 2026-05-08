function calculateBMI(weight, height) {
  return Number((weight / (height * height)).toFixed(2));
}

function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi < 25) {
    return "Normal Weight";
  } else if (bmi < 30) {
    return "Overweight";
  } else {
    return "Obese";
  }
}

module.exports = {
  calculateBMI,
  getBMICategory
};