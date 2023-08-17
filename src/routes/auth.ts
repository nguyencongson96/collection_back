import express, { Router } from "express";
import authController from "../controllers/auth";

const route: Router = express.Router();

route.route("/login").post(authController.login);
route.route("/register").post(authController.register);

export default route;
