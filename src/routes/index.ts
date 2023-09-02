import authRoute from "./auth";
import testRoute from "./test";
import drinkRoute from "./drinks/drinks";
import genreRoute from "./genre/genres";
import flavorRoute from "./flavors";
import playlistRoute from "./genre/playlists";
import RecipeRoute from "./drinks/recipe";
import rateRoute from "./drinks/rates";
import { Router } from "express";

const routes: { path: string; route: Router }[] = [
  { path: "/auth", route: authRoute },
  { path: "/test", route: testRoute },
  { path: "/drink", route: drinkRoute },
  { path: "/genre", route: genreRoute },
  { path: "/flavor", route: flavorRoute },
  { path: "/playlist", route: playlistRoute },
  { path: "/recipe", route: RecipeRoute },
  { path: "/rate", route: rateRoute },
];

export default routes;
