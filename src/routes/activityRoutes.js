const express = require("express");
const activityRoutes = express.Router();
const activityHandler = require("../controller/activityController");

activityRoutes.get("/activities", activityHandler.getAllActivity);
activityRoutes.get("/activity/:id", activityHandler.getActivity);

module.exports = activityRoutes;
