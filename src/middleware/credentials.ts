import { Response, Request, NextFunction } from "express";

// Cross Origin Resource Sharing
const credentials = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
};

export default credentials;
