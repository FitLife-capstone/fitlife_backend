const express = require("express");
const taskRoutes = express.Router();
const taskHandler = require("../controller/taskController");

taskRoutes.get("/tasks", taskHandler.getAllTask);
taskRoutes.get("/task", taskHandler.getTask);
taskRoutes.post("/create-task", taskHandler.createTask);

module.exports = taskRoutes;
