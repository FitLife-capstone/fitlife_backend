const express = require("express");
const taskRoutes = express.Router();
const taskHandler = require("../controller/taskController");
const middleware = require("../middleware/auth")

taskRoutes.get("/tasks", taskHandler.getAllTask);
taskRoutes.get("/active-tasks", taskHandler.getAllActiveTask);
taskRoutes.get("/task/:id", taskHandler.getTask);
taskRoutes.post("/create-task", middleware.authMiddleware, taskHandler.createTask);

module.exports = taskRoutes;
