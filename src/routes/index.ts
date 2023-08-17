import authRoute from "./auth";
import { Router } from "express";

const routes: { path: string; route: Router }[] = [{ path: "/auth", route: authRoute }];

export default routes;
