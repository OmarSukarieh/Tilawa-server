const jwt = require("jsonwebtoken");
const configApp = require("../config/app")

const socketIo = require("socket.io");
const {
  User,
  Teacher,
  Chat,
  Message
} = require("../models");

const users = new Map();
const userSockets = new Map();

const teachers = new Map();
const teacherSockets = new Map();

const SocketServer = (server) => {

  const io = socketIo(server, {
    cors: {
      origin: "*",
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.headers.auth || socket.handshake.auth.token;
    try {
      const decoded = jwt.verify(token, configApp.jwtSecret);
      // ---------------------------------------------------------------------------------------------------------------------------------------------------------
      // if (decoded.type && decoded.id)
      //   next();
      // ---------------------------------------------------------------------------------------------------------------------------------------------------------
      // typeUserTeacher = decoded.type
      // if (decoded.type === "user") {
      //   userData = await User.findByPk(decoded.id);
      //   if (userData) {
      //     userTeacherSocket.set(socket.id, { type: "user", ...userData.dataValues });
      //     users.set(userData.id, socket.id)
      //     next();
      //   }
      // } else if (decoded.type === "teacher") {
      //   teacherData = await Teacher.findByPk(decoded.id);
      //   if (teacherData) {
      //     userTeacherSocket.set(socket.id, { type: "teacher", ...teacherData.dataValues })
      //     teachers.set(teacherData.id, socket.id)
      //     next();
      //   }
      // }
      // ---------------------------------------------------------------------------------------------------------------------------------------------------------
      if (decoded.type === "user") {
        if (users.has(decoded.id) && users.get(decoded.id).sockets.indexOf(socket.id) === -1) {
          const existingUser = users.get(decoded.id);
          existingUser.sockets = [...existingUser.sockets, ...[socket.id]];
          users.set(decoded.id, existingUser);
          userSockets.set(socket.id, decoded.id);
        } else if (!users.has(decoded.id)) {
          users.set(decoded.id, {
            id: decoded.id,
            sockets: [socket.id],
          });
          userSockets.set(socket.id, decoded.id);
        }
        next();
      } else if (decoded.type === "teacher") {
        if (teachers.has(decoded.id) && teachers.get(decoded.id).sockets.indexOf(socket.id) === -1) {
          const existingTeacher = teachers.get(decoded.id);
          existingTeacher.sockets = [...existingTeacher.sockets, ...[socket.id]];
          teachers.set(decoded.id, existingTeacher);
          teacherSockets.set(socket.id, decoded.id);
        } else if (!teachers.has(decoded.id)) {
          teachers.set(decoded.id, {
            id: decoded.id,
            sockets: [socket.id],
          });
          teacherSockets.set(socket.id, decoded.id);
        }
        next();
      } else {
        next(new Error("not authorized"));
      }
    } catch (error) {
      next(new Error("not authorized"));
    }
  });

  io.on("connection", (socket, next) => {
    socket.on("disconnect", async () => {
      console.log("Disconnect")
      const typeUser = userSockets.get(socket.id) ? "user" : teacherSockets.get(socket.id) ? "teacher" : null

      if (typeUser === "user") {
        if (userSockets.has(socket.id)) {
          const user = users.get(userSockets.get(socket.id));
          user.sockets = user.sockets.filter((sock) => {
            if (sock !== socket.id) return true;
            userSockets.delete(sock);
            return false;
          });
          users.set(user.id, user);
        }
      } else if (typeUser === "teacher") {
        if (teacherSockets.has(socket.id)) {
          const teacher = teachers.get(teacherSockets.get(socket.id));
          teacher.sockets = teacher.sockets.filter((sock) => {
            if (sock !== socket.id) return true;
            teacherSockets.delete(sock);
            return false;
          });
          teachers.set(teacher.id, teacher);
        }
      }
    });

    socket.on("message", async (msg) => {
      const typeUserTeacher = userSockets.get(socket.id) ? { type: "user", id: userSockets.get(socket.id) } : teacherSockets.get(socket.id) ? { type: "teacher", id: teacherSockets.get(socket.id) } : null

      if (!typeUserTeacher) next(new Error("not authorized"));

      let teacherId;
      let userId;

      if (typeUserTeacher.type === "user") {
        teacherId = msg.teacherId;
        userId = typeUserTeacher.id;
      } else if (typeUserTeacher.type === "teacher") {
        teacherId = typeUserTeacher.id;
        userId = msg.userId;
      } else {
        next(new Error("not authorized"));
      }

      const findChat = await Chat.findOne({
        where: { teacherId, userId },
      });

      let chatId;
      if (!findChat) {
        const createChat = await Chat.create({ teacherId, userId });
        chatId = createChat.id;
      } else {
        chatId = findChat.id;
      }

      let createMessage;
      if (typeUserTeacher.type === "user") {
        createMessage = await Message.create({
          chatId,
          message: msg.message,
          messageType: msg.type,
          fromUserId: userId,
        });
        teachers?.get(teacherId)?.sockets?.map((e) => {
          if (teacherSockets.has(e)) {
            io.to(e).emit("receive", createMessage);
          }
        });
      } else if (typeUserTeacher.type === "teacher") {
        createMessage = await Message.create({
          chatId,
          message: msg.message,
          messageType: msg.type,
          fromTeacherId: teacherId,
        });
        users?.get(userId)?.sockets?.map((e) => {
          if (userSockets.has(e)) {
            io.to(e).emit("receive", createMessage);
          }
        });
      }
    });
  });
};

module.exports = SocketServer;