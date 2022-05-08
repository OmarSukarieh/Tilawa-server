const router = require("express").Router();
const { protectUserTeacher, protectUser } = require("../middleware/auth");
const { createMedia, getMedia } = require("../controller/media.controller");

router.route('/').post(protectUserTeacher, createMedia)
router.route('/:fileName').get(protectUserTeacher, getMedia)

module.exports = router;