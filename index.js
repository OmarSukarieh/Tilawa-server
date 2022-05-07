const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const { sequelize } = require("./models");
const express = require("express");
const colors = require("colors");
const path = require("path");
const http = require('http')

// TODO
const xss = require("xss-clean");
const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp");

const folderChecking = require("./utils/folderChecking")
const errorHandler = require("./middleware/error");
const config = require("./config/app");
const router = require("./router");

folderChecking();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, "images")));

app.use(router);
app.use(errorHandler);

const server = http.createServer(app);
const SocketServer = require("./socket");
SocketServer(server);

server.listen(config.appPort, async () => {
  console.log(
    `server running on port ${config.NODE_ENV
      ? config.appUrl + ":" + config.appPort
      : `http://127.0.0.1:${config.appPort}`
      } running in ${config.NODE_ENV || "development"} mode`.yellow
  );
  await sequelize.authenticate();
  console.log("DB Connected".green);
});
