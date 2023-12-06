const express = require("express");
const pickedExerciseRoutes = express.Router();
const pickedExerciseHandler = require("../controller/pickedExerciseController");

pickedExerciseRoutes.post(
	"/submit-exercise",
	pickedExerciseHandler.submitExercise
);

module.exports = pickedExerciseRoutes;
