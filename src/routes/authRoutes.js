const express = require("express");
const authRouter = express.Router();
const authHandler = require("../controller/authController");

authRouter.post("/login", authHandler.login);
authRouter.post("/register", authHandler.createUser);
authRouter.get("/profile", authHandler.profile);

module.exports = authRouter;
