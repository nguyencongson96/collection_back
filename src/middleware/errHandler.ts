import { Request, Response, NextFunction } from "express";

const errHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err.stack); // Log the error stack trace to the console

  const { errors, message, meta, code } = err;
  switch (err.name) {
    case "TypeError":
      return res.status(400).json({ errors: err.message, meta, message: "TypeError" });

    case "CastError":
      return res.status(400).json({
        errors: [{ field: err.path, message: `Cast failed for value ${err.value}` }],
        meta,
        message: "CastError",
      });

    case "FirebaseError":
      return res.status(500).json({ errors: err.message, message: "FirebaseError" });

    case "ValidationError":
      const result = Object.keys(err.errors).reduce((obj, key) => Object.assign(obj, { [key]: err.errors[key].message }), {});
      return res.status(400).json({ errors: result, meta, message: "Validation Error" });

    case "MongooseError":
      return res.status(500).json({ errors: err.message, message: "Database Error" });

    case "MongoServerError":
      return res.status(500).json({ errors: err.message, message: "Database Error" });

    default:
      if (err.sql) return res.status(500).json({ message: err.message, meta: err.code });
      else return res.status(code || 500).json({ errors, meta, message });
  }
};

export default errHandler;
