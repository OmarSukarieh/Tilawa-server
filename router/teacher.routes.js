const router = require("express").Router();
const { getMe, getTeacher, getTeachers } = require("../controller/teacher.controller");

const { protectEmployee, protectTeacher, protectUserTeacher, protectUser } = require('../middleware/auth')

router.route("/").get(protectEmployee, getTeachers);
router.route("/me").get(protectTeacher, getMe);
router.route("/teacher-info/:teacherId").get(protectUser, getTeacher);
router.route("/:teacherId").get(protectEmployee, getTeacher);

module.exports = router;