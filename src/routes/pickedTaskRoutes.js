const express = require("express");
const pickedTaskRoutes = express.Router();
const pickedTaskHandler = require("../controller/pickedTaskController");
const middleware = require("../middleware/auth");

const multer = require("multer");

const upload = multer({ dest: "src/uploads/" });

pickedTaskRoutes.post(
	"/submit-task",
	middleware.authMiddleware,
	upload.single("image"),
	pickedTaskHandler.submitTask
);

module.exports = pickedTaskRoutes;
