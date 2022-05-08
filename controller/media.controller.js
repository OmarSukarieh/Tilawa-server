const { Op } = require("sequelize");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

const asyncHandler = require("../utils/async");
const config = require("../config/app");
const ErrorResponse = require('../utils/errorResponse')
const {
  Chat
} = require("../models");

exports.createMedia = asyncHandler(async (req, res, next) => {
  const { params: chatId } = req.params;

  if (!chatId) return next(new ErrorResponse(`please add chatId in the params for upload`, 422));

  if (!req.files) return next(new ErrorResponse(`Please add files to uploaded`, 400));
  let file = req.files.file;

  if (Array.isArray(file)) return next(new ErrorResponse(`Please upload one file only`, 400));

  if (!file) return next(new ErrorResponse(`Please add files to uploaded`, 400));

  if (
    !file.mimetype.startsWith("image") &&
    !file.mimetype.startsWith("audio") &&
    !file.mimetype.startsWith("video")
  ) {
    return next(new ErrorResponse(`Please upload an image or pdf file`, 400));
  }

  const chat = await Chat.findOne({
    where: {
      id: chatId
    }
  });

  if (!chat) return next(new ErrorResponse(`Chat is not found`, 404))

  if (req.user) {
    if (req.user.id !== chat.userId) return next(new ErrorResponse(`Not authorize to add file`, 401))
  } else if (req.teacher) {
    if (req.teacher.id !== chat.teacherId) return next(new ErrorResponse(`Not authorize to add file`, 401))
  }

  const pathChat = config.fileUploadPathChat + '/' + chat.id

  if (!fs.existsSync(pathChat)) {
    fs.mkdirSync(pathChat);
  }

  file.name = `c${chat.id}_u${chat.userId}_t${chat.teacherId}_${Date.now()}${path.parse(file.name).ext}`;

  const finalPath = `${pathChat}/${file.name}`

  file.mv(finalPath, async (err) => {
    if (err) {
      console.error(err);

      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
  });

  res.json({
    success: true,
    data: config.appUrl + '/api/media/chat/' + file.name
  })
})

exports.getMedia = asyncHandler(async (req, res, next) => {
  const { params: fileName } = req.params;

  if (!fileName) return next(new ErrorResponse(`please add fileName in the params`, 422));

  const fileNameArr = fileName.split("_")

  const chatId = fileNameArr[0].substring(1);
  const userId = fileNameArr[1].substring(1);
  const teacherId = fileNameArr[2].substring(1);


  let chat
  if (req.user) {
    chat = await Chat.findOne({
      where: {
        id: chatId,
        userId,
      }
    });
  } else if (req.teacher) {
    chat = await Chat.findOne({
      where: {
        id: chatId,
        teacherId,
      }
    });
  }

  if (!chat) return next(new ErrorResponse(`Chat is not found`, 404))

  const pathChat = config.fileUploadPathChat + '/' + chatId + "/" + fileName

  if (!fs.existsSync(pathChat)) return next(new ErrorResponse(`File is not exists`, 404))

  const imagePath = process.cwd() + `${pathChat}`.substring(1);

  res.sendFile(imagePath)
})