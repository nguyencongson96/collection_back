import express, { Router } from "express";
import genreController from "../../controllers/genres/genres";
import verifyJWT from "../../middleware/verifyJWT";

const router: Router = express.Router();

router.route("/").get(genreController.getList).post(verifyJWT, genreController.addNew);
router.route("/:id").get(genreController.getFlavorMatch);

export default router;
