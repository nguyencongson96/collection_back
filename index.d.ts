import { Express } from "express-serve-static-core";
import { User } from "./src/types/custom";

export {};

declare module "express-serve-static-core" {
  interface Request {
    userInfo: User;
  }
}
