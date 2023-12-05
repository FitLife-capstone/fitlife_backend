const express = require("express");
const profileRouter = express.Router();
const profileHandler = require("../controller/profileController");

profileRouter.get("/user-detail", profileHandler.getUserDetail);
profileRouter.get("/user-exercise", profileHandler.getUserExercise);
profileRouter.get("/user-task", profileHandler.getUserTask);

module.exports = profileRouter;
