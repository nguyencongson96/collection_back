import express, { Router } from "express";
import authController from "../controllers/auth";
import verifyJWT from "../middleware/verifyJWT";

const route: Router = express.Router();

route.route("/login").post(authController.login);
route.route("/logout").post(verifyJWT, authController.logout);
route.route("/register").post(authController.register);
route.route("/forgot/:email").post(authController.forgot);
route.route("/reset").post(authController.reset);

export default route;
