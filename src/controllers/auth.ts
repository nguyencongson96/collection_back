import { Request, Response } from "express";
import connection from "../config/database";
import _throw from "../utils/_throw";
import asyncWrapper from "../middleware/asyncWrapper";
import bcrypt from "bcrypt";
import { User } from "../config/type";

interface Login {
  username: string;
  password: string;
}

interface Register {
  email: string;
  username: string;
  password: string;
}

const authController = {
  login: asyncWrapper(async function (req: Request, res: Response) {
    const { username, password }: Login = req.body;

    //Throw an error if query return empty array
    const result: any[] = await connection.query(`SELECT * FROM users where username=?`, [username]);
    const row: User[] = result[0];
    row.length === 0 && _throw({ code: 404, message: "user not found" });

    // Evaluate password
    const match = await bcrypt.compare(password, row[0].password);
    !match && _throw({ code: 400, message: "password not match" });

    //Send to front
    return res.json({ data: row[0], message: "login successfully" });
  }),

  register: asyncWrapper(async function (req: Request, res: Response) {
    const { username, password, email }: Register = req.body;
    const result: any[] = await connection.query(`SELECT * FROM users where username=? or email=?`, [username, email]);
    const row: User[] = result[0];
    row.length > 0 && _throw({ code: 400, message: "username or email has already been existed" });

    //Save hashedPwd
    const hashedPwd = await bcrypt.hash(password, 10);

    //Create new user and validate infor
    await connection.query(
      `INSERT INTO users (username, email, password, createdAt, lastUpdatedAt) 
    VALUES (?, ?, ?, ?, ?)`,
      [username, email, hashedPwd, new Date(), new Date()]
    );

    return res.json({ message: "Register successfully" });
  }),
};

export default authController;
