const { Op } = require("sequelize");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const asyncHandler = require("../utils/async");
const config = require("../config/app");
const ErrorResponse = require('../utils/errorResponse')
const {
  User,
  Teacher
} = require("../models");

exports.registerUserTeacher = asyncHandler(async (req, res, next) => {
  const { isTeacher, password } = req.body;
  const Data = req.body;
  delete Data.password;
  delete Data.isTeacher;

  if (isTeacher !== true && isTeacher !== false) return next(new ErrorResponse('bad request isTeacher not exists'));

  const createUserTeacher = isTeacher ? await Teacher.create({ password: bcrypt.hashSync(password, 10), ...req.body }) : await User.create({ password: bcrypt.hashSync(password, 10), ...req.body })

  res.status(201).json({
    success: true,
    data: createUserTeacher
  })
})

exports.loginUserTeacher = asyncHandler(async (req, res, next) => {
  const { email, password, isTeacher } = req.body;

  if (isTeacher !== true && isTeacher !== false) return next(new ErrorResponse('bad request isTeacher not exists'));
  if (!email || !password) return next(new ErrorResponse(`Not valid email or password`, 400));

  const userTeacher = isTeacher ? await Teacher.findOne({ where: { email } }) : await User.findOne({ where: { email } })

  if (!userTeacher) return next(new ErrorResponse(`Not valid email or password`, 400));

  const isMatch = await bcrypt.compare(password.toString(), userTeacher.password);

  if (!isMatch) return next(new ErrorResponse(`Not valid email or password`, 400));

  const token = jwt.sign({ id: userTeacher.id, type: isTeacher ? "teacher" : "user" }, config.jwtSecret, { expiresIn: config.jwtExpire });

  const options = {
    expires: new Date(Date.now() + 365 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(200).cookie("token", token, options).json({
    success: true,
    type: isTeacher ? 'teacher' : 'user',
    token,
  });
})