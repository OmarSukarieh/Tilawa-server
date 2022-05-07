const { Op } = require("sequelize");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const asyncHandler = require("../utils/async");
const config = require("../config/app");
const ErrorResponse = require('../utils/errorResponse')
const {
  User,
  Teacher,
  Chat,
  Message
} = require("../models");

exports.getAllMyChat = asyncHandler(async (req, res, next) => {
  if (req.user) {
    const chat = await Chat.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Teacher,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Message,
          attributes: ["id", "message", "createdAt"],
          order: [["createdAt", "DESC"]],
          limit: 1,
        },
      ],
    });
    res.json({
      success: true,
      data: chat,
    });
  } else if (req.teacher) {
    const chat = await Chat.findAll({
      where: { teacherId: req.teacher.id },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Message,
          attributes: ["id", "message", "createdAt"],
          order: [["createdAt", "DESC"]],
          limit: 1,
        },
      ],
    });
    res.json({
      success: true,
      data: chat,
    });
  } else {
    return next(new ErrorResponse(`type not found`, 404))
  }
})

exports.getAllTeacher = asyncHandler(async (req, res, next) => {
  const allTeachers = await Teacher.findAll();

  res.json({
    success: true,
    data: allTeachers
  })
})
