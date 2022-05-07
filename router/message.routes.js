const router = require("express").Router();
const { protectUserTeacher, protectUser } = require("../middleware/auth");
const { sendMessage, getAllMessages } = require("../controller/message.controller");

router.route('/').get(protectUserTeacher, getAllMessages).post(protectUserTeacher, sendMessage);

module.exports = router;