const express = require("express");
const pickedTaskRoutes = express.Router();
const pickedTaskHandler = require("../controller/pickedTaskController");

pickedTaskRoutes.post("/submit-task", pickedTaskHandler.submitTask);

module.exports = pickedTaskRoutes;
