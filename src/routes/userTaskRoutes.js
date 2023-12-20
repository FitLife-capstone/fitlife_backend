const express = require("express");
const userTaskRoutes = express.Router();
const userTaskController = require("../controller/userTaskController");
const middleware = require("../middleware/auth");

userTaskRoutes.get(
  "/user-task",
  middleware.authMiddleware,
  userTaskController.getAllUserTask
);
userTaskRoutes.put(
  "/accept-task/:userId/:taskId",
  middleware.authMiddleware,
  userTaskController.acceptUserTask
);
userTaskRoutes.put(
  "/reject-task/:userId/:taskId",
  middleware.authMiddleware,
  userTaskController.rejectUserTask
);

module.exports = userTaskRoutes;
