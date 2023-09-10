import express, { Router } from "express";
import recipeController from "../../controllers/drinks/recipe";
import verifyJWT from "../../middleware/verifyJWT";

const router: Router = express.Router();

router.use(verifyJWT);

router.route("/").post(recipeController.addNew);
router.route("/save").post(recipeController.saved).get(recipeController.getSavedList)

export default router;
