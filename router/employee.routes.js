const router = require("express").Router();
const { createEmployee, getAllEmployee, loginEmployee } = require("../controller/employee.controller");
const { protectEmployee } = require("../middleware/auth");

router.route('/').get(protectEmployee, getAllEmployee)
router.route("/create").post(protectEmployee, createEmployee);
router.route("/login").post(loginEmployee);

module.exports = router;