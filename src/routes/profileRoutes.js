const express = require("express");
const profileRouter = express.Router();
const profileHandler = require("../controller/profileController");
const middleware = require("../middleware/auth");

profileRouter.get("/user-detail", profileHandler.getUserDetail);
profileRouter.get(
	"/user-exercise",
	middleware.authMiddleware,
	profileHandler.getUserExercise
);
profileRouter.get(
	"/user-task",
	middleware.authMiddleware,
	profileHandler.getUserTask
);

module.exports = profileRouter;
