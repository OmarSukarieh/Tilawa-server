const { Op } = require("sequelize");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const asyncHandler = require("../utils/async");
const config = require("../config/app");
const ErrorResponse = require('../utils/errorResponse')
const {
  Teacher
} = require("../models");

exports.getTeachers = asyncHandler(async (req, res, next) => {
  const teacher = await Teacher.findAll();

  res.status(200).json({
    success: true,
    data: teacher,
  });
});

exports.getTeacher = asyncHandler(async (req, res, next) => {
  const teacherId = req.params.teacherId;

  const teacher = await Teacher.findOne({
    where: {
      id: teacherId,
    },
  });

  if (!teacher) {
    return next(new ErrorResponse(`Teacher not found with id ${teacherId}`, 404));
  }

  res.status(200).json({
    success: true,
    data: teacher,
  });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  res.json({
    success: true,
    data: req.teacher,
  });
});