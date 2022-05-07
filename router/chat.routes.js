const router = require("express").Router();
const { protectUserTeacher, protectUser } = require("../middleware/auth");
const { getAllMyChat, getAllTeacher } = require("../controller/chat.controller");

router.route('/').get(protectUserTeacher, getAllMyChat)
router.route('/teachers').get(protectUser, getAllTeacher)

module.exports = router;