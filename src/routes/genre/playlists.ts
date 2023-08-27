import express, { Router } from "express";
import playlistController from "../../controllers/genres/playlist";
import verifyJWT from "../../middleware/verifyJWT";

const router: Router = express.Router();

router.route("/").get(playlistController.getList).post(verifyJWT, playlistController.addNew);

export default router;
