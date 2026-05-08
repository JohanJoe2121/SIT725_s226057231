const expect = require("chai").expect;
const request = require("request");
const { calculateBMI, getBMICategory } = require("../calculate");

describe("BMI Calculator API", function () {
  const baseUrl = "http://localhost:3000";

  it("should return status 200 and load the index page", function (done) {
  request(baseUrl, function (error, response, body) {
    expect(response.statusCode).to.equal(200);
    expect(body).to.include("BMI Calculator");
    done();
  });
});

  it("should return correct BMI and category for valid input", function (done) {
    request.get(`${baseUrl}/bmi?weight=70&height=1.75`, function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      expect(body).to.include("BMI: 22.86");
      expect(body).to.include("Category: Normal Weight");
      done();
    });
  });

  it("should return error when height is missing", function (done) {
    request.get(`${baseUrl}/bmi?weight=70`, function (error, response, body) {
      expect(response.statusCode).to.equal(400);
      expect(body).to.include("Weight and height are required");
      done();
    });
  });

  it("should return error for non-numeric input", function (done) {
    request.get(`${baseUrl}/bmi?weight=hello&height=world`, function (error, response, body) {
      expect(response.statusCode).to.equal(400);
      expect(body).to.include("Weight and height must be valid numbers");
      done();
    });
  });
});

describe("BMI Calculation Functions", function () {
  it("calculateBMI() should correctly calculate BMI", function () {
    const result = calculateBMI(70, 1.75);
    expect(result).to.equal(22.86);
  });

  it("getBMICategory() should return Normal Weight for BMI 18.5", function () {
    const result = getBMICategory(18.5);
    expect(result).to.equal("Normal Weight");
  });

  it("getBMICategory() should return Obese for BMI 30", function () {
    const result = getBMICategory(30);
    expect(result).to.equal("Obese");
  });
  it("getBMICategory() should return Overweight for BMI 25", function () {
    const result = getBMICategory(25);
    expect(result).to.equal("Overweight");
  });
  it("getBMICategory() should return Underweight for BMI 18", function () {
    const result = getBMICategory(18);
    expect(result).to.equal("Underweight");
  });
});