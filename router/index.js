const router = require("express").Router();

router.use("/api/auth", require("./auth.routes"));
router.use("/api/employee", require("./employee.routes"));
router.use("/api/user", require("./user.routes"));
router.use("/api/teacher", require("./teacher.routes"));
router.use("/api/chat", require("./chat.routes"));
router.use("/api/message", require("./message.routes"));

module.exports = router;