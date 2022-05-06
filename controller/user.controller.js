const { Op } = require("sequelize");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const asyncHandler = require("../utils/async");
const config = require("../config/app");
const ErrorResponse = require('../utils/errorResponse')
const {
  User
} = require("../models");

exports.getUsers = asyncHandler(async (req, res, next) => {
  const user = await User.findAll();

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;

  const user = await User.findOne({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return next(new ErrorResponse(`User not found with id ${userId}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  res.json({
    success: true,
    data: req.user,
  });
});