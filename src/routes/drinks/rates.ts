import express, { Router } from "express";
import verifyJWT from "../../middleware/verifyJWT";
import rateController from "../../controllers/drinks/rates";

const router: Router = express.Router();

router.route("/").post(verifyJWT, rateController.addNew)

export default router