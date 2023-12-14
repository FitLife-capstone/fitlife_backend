const express = require("express");
const pickedExerciseRoutes = express.Router();
const pickedExerciseHandler = require("../controller/pickedExerciseController");
const middleware = require("../middleware/auth");

const multer = require("multer");

const upload = multer({ dest: "src/uploads/" });

pickedExerciseRoutes.post(
	"/submit-exercise",
	middleware.authMiddleware,
	upload.single("image"),
	pickedExerciseHandler.submitExercise
);

module.exports = pickedExerciseRoutes;
