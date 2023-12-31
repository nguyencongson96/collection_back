import jwt from "jsonwebtoken";
import asyncWrapper from "./asyncWrapper";
import _throw from "../utils/_throw";
import { Response, NextFunction } from "express";
import "dotenv/config";
// import connection from "../config/database";
import { UserRequest } from "../types/custom";
import Users from "../models/users";

const verifyJWT = asyncWrapper(async (req: UserRequest, res: Response, next: NextFunction) => {
  const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET || "";

  // Get the authorization header from the request
  const authHeader: string = req.headers.authorization || "";

  // If the authorization header doesn't start with "Bearer ", throw an error
  if (authHeader) {
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
      try {
        err && _throw({ code: 403, message: "invalid token" });
      } catch (error) {
        next(error);
      }
    });

    // Find the token in the database, if the token is not found in the database, return a 403 Forbidden status code
    const foundUser = await Users.findOne({ accessToken });

    if (!foundUser)
      _throw({
        code: 403,
        message: "outdated token",
      });
    else res.locals.userInfo = foundUser;

    // const result: any[] = await connection.query(`SELECT * FROM users WHERE accessToken=?`, [accessToken]);
    // const row: User[] = result[0];
    // row.length === 0 && _throw({ code: 404, message: "user not found" });

    // req.userInfo = row[0];
  } else _throw({ code: 401, message: "auth header not found" });

  // Call the next middleware function
  next();
});

export default verifyJWT;
