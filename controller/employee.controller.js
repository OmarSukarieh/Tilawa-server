const { Op } = require("sequelize");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const asyncHandler = require("../utils/async");
const config = require("../config/app");
const ErrorResponse = require('../utils/errorResponse')
const {
  Employee
} = require("../models");

exports.getAllEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findAll();

  res.status(200).json({
    success: true,
    data: employee
  })
})

exports.createEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.create(req.body);

  res.status(200).json({
    success: true,
    data: employee
  })
})

exports.loginEmployee = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse(`Not valid email or password`, 400));
  }

  const employee = await Employee.findOne({ where: { email } });

  if (!employee) {
    return next(new ErrorResponse(`Not valid email or password`, 400));
  }

  const isMatch = await bcrypt.compare(password, employee.password);

  if (!isMatch) {
    return next(new ErrorResponse(`Not valid email or password`, 400));
  }

  const token = jwt.sign({ id: employee.id }, config.appKey, {
    expiresIn: config.jwtExpire,
  });

  const options = {
    expires: new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(200).cookie("token", token, options).json({
    success: true,
    token,
  });
})

exports.logOutEmployee = asyncHandler(async (req, res, next) => {
  res.cookie("token", "", { maxAge: 1 }).json({
    success: true,
  });
});