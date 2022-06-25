const router = require("express").Router();

router.use("/api/auth", require("./auth.routes"));
router.use("/api/employee", require("./employee.routes"));
router.use("/api/user", require("./user.routes"));
router.use("/api/teacher", require("./teacher.routes"));
router.use("/api/chat", require("./chat.routes"));
router.use("/api/message", require("./message.routes"));
router.use("/api/media", require("./media.routes"));
router.use("/api/ai", require("./ai.routes"));

module.exports = router;