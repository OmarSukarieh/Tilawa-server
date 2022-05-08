const router = require("express").Router();
const { protectUserTeacher, protectUser } = require("../middleware/auth");
const { createMedia, getMedia } = require("../controller/media.controller");

router.route('/chat/:params').get(protectUserTeacher, getMedia).post(protectUserTeacher, createMedia)

module.exports = router;