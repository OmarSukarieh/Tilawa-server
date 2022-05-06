const router = require("express").Router();
const { registerUserTeacher, loginUserTeacher } = require("../controller/auth.controller")

router.route("/register").post(registerUserTeacher);
router.route("/login").post(loginUserTeacher);

module.exports = router;