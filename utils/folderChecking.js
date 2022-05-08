var fs = require("fs");
const path = require("path");

module.exports = function (next) {
  const dir = path.join(__dirname, "../images");
  const dir1 = path.join(__dirname, "../images/chat");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  if (!fs.existsSync(dir1)) {
    fs.mkdirSync(dir1, { recursive: true });
  }
};
