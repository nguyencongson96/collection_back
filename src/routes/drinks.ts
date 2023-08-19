import express, { Router } from "express";
import drinkController from "../controllers/drinks";

const router: Router = express.Router();

router.route("/").get(drinkController.match);
router.route("/:id").get(drinkController.getOne);

export default router;
