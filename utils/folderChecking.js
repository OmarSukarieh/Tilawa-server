var fs = require("fs");
const path = require("path");

module.exports = function (next) {
  const dir = path.join(__dirname, "../images");
  const dir1 = path.join(__dirname, "../images/client");
  const dir2 = path.join(__dirname, "../images/project");
  const dir3 = path.join(__dirname, "../images/portfolio");
  const dir4 = path.join(__dirname, "../images/blog");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  if (!fs.existsSync(dir1)) {
    fs.mkdirSync(dir1, { recursive: true });
  }

  if (!fs.existsSync(dir2)) {
    fs.mkdirSync(dir2, { recursive: true });
  }

  if (!fs.existsSync(dir3)) {
    fs.mkdirSync(dir3, { recursive: true });
  }
  if (!fs.existsSync(dir3)) {
    fs.mkdirSync(dir3, { recursive: true });
  }
};
