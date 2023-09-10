import express, { Router } from "express";
import drinkController from "../../controllers/drinks/drinks";
import genreFlavorController from "../../controllers/drinks/genre_flavor";
import verifyJWT from "../../middleware/verifyJWT";

const router: Router = express.Router();

router.route("/").get(drinkController.getList).post(verifyJWT, drinkController.addNew);
router.route("/match").get(drinkController.match);
router.route("/link").post(verifyJWT, genreFlavorController.addNew);
router.route("/history").get(verifyJWT, drinkController.getHistoryMatch);
router.route("/:id").get(drinkController.getDetail);

export default router;
