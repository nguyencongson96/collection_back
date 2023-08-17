import jwt from "jsonwebtoken";
import asyncWrapper from "./asyncWrapper";
import _throw from "../utils/_throw";
import { Request, Response, NextFunction } from "express";
import "dotenv/config";

const verifyJWT = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET || "";

  // Get the authorization header from the request
  const authHeader: string = req.headers.authorization || "";

  // If the authorization header doesn't start with "Bearer ", throw an error
  !authHeader && _throw({ code: 401, message: "auth header not found" });

  //Throw an error if token do not start with "Bearer"
  !authHeader.startsWith("Bearer ") &&
    _throw({
      code: 403,
      errors: { field: "accessToken", message: "invalid" },
      message: "invalid token",
    });

  const accessToken = authHeader.split(" ")[1];

  // Verify the access token using the secret key
  jwt.verify(accessToken, accessTokenSecret, async (err, decoded) => {
    err && _throw({ code: 403, message: "invalid token" });
    // req.username = decoded.username;
  });

  // Call the next middleware function
  next();
});

export default verifyJWT;
