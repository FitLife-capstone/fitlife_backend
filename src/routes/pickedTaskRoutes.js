const express = require("express");
const pickedTaskRoutes = express.Router();
const pickedTaskHandler = require("../controller/pickedTaskController");

const multer = require("multer");

const upload = multer({ dest: "src/uploads/" });

pickedTaskRoutes.post(
	"/submit-task",
	upload.single("image"),
	pickedTaskHandler.submitTask
);

module.exports = pickedTaskRoutes;
