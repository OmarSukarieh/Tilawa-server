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

exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { user: userIdQuery, teacher: teacherIdQuery } = req.query;
  const { message, messageType } = req.body;

  if (!message || !messageType) return next(new ErrorResponse(`Must enter message and messageType`, 422))
  if (!userIdQuery && !teacherIdQuery) return next(new ErrorResponse(`Missing user or teacher params`, 422))

  if (userIdQuery) {
    // teacher send message
    if (!req.teacher) return next(new ErrorResponse(`Not authorize to send message to teacher`, 403))
    const teacherId = req.teacher.id;

    // check if user exists
    const existsUser = await User.findByPk(userIdQuery);
    if (!existsUser) return next(new ErrorResponse(`User is not exists`, 404))

    let chatId;

    const findChat = await Chat.findOne({
      where: { teacherId, userId: userIdQuery },
    });

    if (!findChat) {
      const createChat = await Chat.create({
        teacherId,
        userId: userIdQuery,
      });

      chatId = createChat.id;
    } else {
      chatId = findChat.id;
    }

    const createMessage = await Message.create({
      chatId, message, messageType,
      fromTeacherId: teacherId,
    });

    const getChatters = await Chat.findOne({
      where: { teacherId, userId: userIdQuery },

      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Message,
          attributes: ["id", "message", "createdAt", "fromUserId"],
          order: [["createdAt", "DESC"]],
          limit: 1,
        },
      ],
      attributes: ["id"],
    });

    res.json({
      success: true,
      data: getChatters,
    })


  } else if (teacherIdQuery) {
    // user send message
    if (!req.user) return next(new ErrorResponse(`Not authorize to send message to user`, 403))

    const userId = req.user.id;

    // check if teacher exists
    const existsTeacher = await Teacher.findByPk(teacherIdQuery);
    if (!existsTeacher) return next(new ErrorResponse(`Teacher is not exists`, 404))

    let chatId;

    const findChat = await Chat.findOne({
      where: { teacherId: teacherIdQuery, userId },
    });

    if (!findChat) {
      const createChat = await Chat.create({
        teacherId: teacherIdQuery, userId
      });

      chatId = createChat.id;
    } else {
      chatId = findChat.id;
    }

    const createMessage = await Message.create({
      chatId, message, messageType,
      fromUserId: userId,
    });

    const getChatters = await Chat.findOne({
      where: { teacherId: teacherIdQuery, userId },
      include: [
        {
          model: Teacher,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Message,
          attributes: ["id", "message", "createdAt", "fromUserId"],
          order: [["createdAt", "DESC"]],
          limit: 1,
        },
      ],
      attributes: ["id"],
    });

    res.json({
      success: true,
      data: getChatters,
    })
  }

})

exports.getAllMessages = asyncHandler(async (req, res, next) => {
  const { user: userIdQuery, teacher: teacherIdQuery, offset } = req.query;

  if (!userIdQuery && !teacherIdQuery) return next(new ErrorResponse(`Missing user or teacher params`, 422))

  // get all my chat with users
  if (userIdQuery) {
    if (!req.teacher) return next(new ErrorResponse(`Not authorize to send message to teacher`, 403))
    const teacherId = req.teacher.id;

    const getChatters = await Chat.findOne({
      where: { teacherId, userId: userIdQuery },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Message,
          order: [["createdAt", "DESC"]],
          offset: offset ? offset : 0,
          limit: 20,
        },
      ],
      attributes: ["id"],
    });

    res.json({
      success: true,
      data: getChatters,
    })
  }
  //get all my chat with tachers
  else if (teacherIdQuery) {
    if (!req.user) return next(new ErrorResponse(`Not authorize to send message to teacher`, 403))
    const userId = req.user.id;

    const getChatters = await Chat.findOne({
      where: { userId, teacherId: teacherIdQuery },
      include: [
        {
          model: Teacher,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Message,
          order: [["createdAt", "DESC"]],
          offset: offset ? offset : 0,
          limit: 20,
        },
      ],
      attributes: ["id"],
    });

    res.json({
      success: true,
      data: getChatters,
    })
  }
})