const router = require("express").Router();
const { getAiController } = require("../controller/ai.controller")

router.route("/").post(getAiController);

module.exports = router;