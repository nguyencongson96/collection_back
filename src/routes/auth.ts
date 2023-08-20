import express, { Router } from "express";
import authController from "../controllers/auth";
import verifyJWT from "../middleware/verifyJWT";

const router: Router = express.Router();

router.route("/login").post(authController.login);
router.route("/logout").post(verifyJWT, authController.logout);
router.route("/").put(verifyJWT, authController.update);
router.route("/register").post(authController.register);
router.route("/forgot/:email").post(authController.forgot);
router.route("/reset").post(authController.reset);

export default router;
