const express = require("express");
const authRouter = express.Router();
const authHandler = require("../controller/authController");
const middleware = require("../middleware/auth")

authRouter.post("/login", authHandler.login);
authRouter.post("/register", authHandler.register);
authRouter.get("/profile/:id", middleware.authMiddleware, authHandler.profile);

module.exports = authRouter;
