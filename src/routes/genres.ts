import express, { Router } from "express";
import genreController from "../controllers/genres";

const router: Router = express.Router();

router.route("/").get(genreController.getList);
router.route("/:id").get(genreController.getFlavorMatch);

export default router;
