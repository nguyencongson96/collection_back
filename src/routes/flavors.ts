import express, { Router } from "express";
import flavorController from "../controllers/flavors";

const router: Router = express.Router();

router.route("/").get(flavorController.getList);
router.route("/:id").get(flavorController.getGenreMatch);

export default router;
