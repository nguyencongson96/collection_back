import express, { Router } from "express";
import drinkController from "../../controllers/drinks/drinks";
import genreFlavorController from "../../controllers/drinks/genre_flavor";
import verifyJWT from "../../middleware/verifyJWT";

const router: Router = express.Router();

router.route("/").get(drinkController.match).post(verifyJWT, drinkController.addNew);
router.route("/link").post(verifyJWT, genreFlavorController.addNew);
router.route("/:id").get(drinkController.getOne);

export default router;
