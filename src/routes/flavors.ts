import express, { Router } from "express";
import flavorController from "../controllers/flavors";
import verifyJWT from "../middleware/verifyJWT";

const router: Router = express.Router();

router.route("/").get(flavorController.getList).post(verifyJWT, flavorController.addNew);
router.route("/:id").get(flavorController.getGenreMatch);

export default router;
