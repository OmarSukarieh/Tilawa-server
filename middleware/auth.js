const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/async");
const ErrorResponse = require("../utils/errorResponse");
const { User, Teacher, Employee } = require("../models");
const config = require('../config/app')

exports.protectUser = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }

  try {
    const decoded = await jwt.verify(token, config.jwtSecret);
    if (decoded.type !== 'user') return next(new ErrorResponse("Not authorize to access this route", 401));
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return next(new ErrorResponse("Not authorize to access this route", 401));
    }

    req.user = user;

    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }
});

exports.protectTeacher = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }

  try {
    const decoded = await jwt.verify(token, config.jwtSecret);
    if (decoded.type !== 'teacher') return next(new ErrorResponse("Not authorize to access this route", 401));
    const teacher = await Teacher.findByPk(decoded.id);

    if (!teacher) {
      return next(new ErrorResponse("Not authorize to access this route", 401));
    }

    req.teacher = teacher;

    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }
});

exports.protectEmployee = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }

  try {
    const decoded = await jwt.verify(token, config.jwtSecret);
    const employee = await Employee.findByPk(decoded.id);

    if (!employee) {
      return next(new ErrorResponse("Not authorize to access this route", 401));
    }

    req.employee = employee;

    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }
});
