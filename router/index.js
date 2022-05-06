const router = require("express").Router();

router.use("/api/auth", require("./auth.routes"));
router.use("/api/employee", require("./employee.routes"));
router.use("/api/user", require("./user.routes"));
router.use("/api/teacher", require("./teacher.routes"));

module.exports = router;