import authRoute from "./auth";
import testRoute from "./test";
import drinkRoute from "./drinks";
import genreRoute from "./genres";
import { Router } from "express";

const routes: { path: string; route: Router }[] = [
  { path: "/auth", route: authRoute },
  { path: "/test", route: testRoute },
  { path: "/drink", route: drinkRoute },
  { path: "/genre", route: genreRoute },
];

export default routes;
