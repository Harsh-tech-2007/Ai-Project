const express = require("express");
const authRouter = express.Router();
const authController = require("../controller/auth_con");
const authMiddlewar = require("../middleware/auth_mid");


authRouter.post("/register", authController.registerUserController);
authRouter.post("/login", authController.loginUserController);
authRouter.post("/logout", authController.logoutUserController);
authRouter.get("/get-me", authMiddlewar.authUser, authController.getMeController); // add - changed POST to GET

module.exports = authRouter; 
