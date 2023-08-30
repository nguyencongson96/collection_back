import express, { Router } from "express";
import recipeController from "../../controllers/drinks/recipe";
import verifyJWT from "../../middleware/verifyJWT";

const router: Router = express.Router();

router.route("/").post(verifyJWT, recipeController.addNew);

export default router;
