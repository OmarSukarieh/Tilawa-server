const jwt = require("jsonwebtoken");
const configApp = require("../config/app")

const socketIo = require("socket.io");
const {
  User,
  Teacher,
} = require("../models");


let userData = null;
let teacherData = null;

const users = new Map();
const userSockets = new Map();

const teacher = new Map();
const teacherSockets = new Map();

const SocketServer = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*",
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.headers.auth;
    try {
      const decoded = jwt.verify(token, configApp.jwtSecret);
      if (decoded.type === "user") {
        userData = await User.findByPk(decoded.id);
        if (userData) next();
      } else if (decoded.type === "teacher") {
        teacherData = await Teacher.findByPk(decoded.id);
        if (teacherData) next();
      }
    } catch (error) {
      socket.close();
    }
    next();
  });

  io.on("connection", (socket) => {
    socket.on("join", async (type) => {
      console.log("join", userData.id, userData.firstName, userData.lastName)
    });

    socket.on("disconnect", async () => {
      console.log("disconnect", userData.id, userData.firstName, userData.lastName)
    })
  });
};

module.exports = SocketServer;