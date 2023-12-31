import { Request, Response } from "express";
// import connection from "../config/database";
// import { v4 as uuidv4 } from "uuid";
import _throw from "../utils/_throw";
import asyncWrapper from "../middleware/asyncWrapper";
import bcrypt from "bcrypt";
import { UserRequest, Login, Register } from "../types/custom";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import sendEmail from "../utils/sendEmail";
import Users from "../models/users";

const authController = {
  login: asyncWrapper(async function (req: Request, res: Response) {
    const { username, password }: Login = req.body;

    //Get User from database
    const foundUser = await Users.findOne({ $or: [{ username: username }, { email: username }] });

    if (foundUser) {
      // Evaluate password
      const match = await bcrypt.compare(password, foundUser.password);
      !match && _throw({ code: 400, message: "password not match" });

      //Create new Access Token and save to DB
      const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET || "";
      const accessTokenExpire: string = process.env.ACCESS_TOKEN_EXPIRATION || "";
      const accessToken = jwt.sign({ username: foundUser.username }, accessTokenSecret, {
        expiresIn: accessTokenExpire,
      });

      //Save token to database to prevent previousToken still take effect
      foundUser.accessToken = accessToken;
      foundUser.createdAt = new Date();
      await foundUser.save();
    } else _throw({ code: 404, message: "user not found" });

    // //Throw an error if query return empty array
    // const result: any[] = await connection.query(`SELECT * FROM users WHERE username=?`, [username]);
    // const row: User[] = result[0];
    // row.length === 0 && _throw({ code: 404, message: "user not found" });

    // // Evaluate password
    // const foundUser: User = row[0];
    // const { user_id } = foundUser;
    // const match = await bcrypt.compare(password, foundUser.password);
    // !match && _throw({ code: 400, message: "password not match" });

    //Update userInfo in DB
    // await connection.query(`UPDATE users SET accessToken=?, lastUpdatedAt=? WHERE user_id=?`, [accessToken, new Date(), user_id]);

    //Send to front
    return res.json({ data: { accessToken: foundUser?.accessToken }, message: "login successfully" });
  }),

  register: asyncWrapper(async function (req: Request, res: Response) {
    const { username, password, email }: Register = req.body;

    //Check for duplicate username in database
    const duplicate = await Users.findOne({ $or: [{ username }, { email }] }).lean();
    if (duplicate) {
      _throw({ code: 400, message: "username or email has already been existed" });
    } else {
      //Create new user and validate infor
      const newUser = new Users(req.body);
      await newUser.validate();

      //Save hashedPwd
      const hashedPwd = await bcrypt.hash(password, 10);
      newUser.password = hashedPwd;

      //Save to database
      newUser.createdAt = new Date();
      await newUser.save();
    }

    // const result: any[] = await connection.query(`SELECT * FROM users where username=? or email=?`, [username, email]);
    // const row: User[] = result[0];
    // row.length > 0 && _throw({ code: 400, message: "username or email has already been existed" });

    // //Save hashedPwd
    // const hashedPwd = await bcrypt.hash(password, 10);

    // //Create new user and validate infor
    // await connection.query(
    //   `INSERT INTO users (username, email, password, createdAt, lastUpdatedAt)
    // VALUES (?, ?, ?, ?, ?)`,
    //   [username, email, hashedPwd, new Date(), new Date()]
    // );

    return res.json({ message: "Register successfully" });
  }),

  logout: asyncWrapper(async function (req: UserRequest, res: Response) {
    const foundUser = res.locals.userInfo;

    foundUser.accessToken = "";
    await foundUser.save();

    // //Update userInfo in DB
    // await connection.query(`UPDATE users SET accessToken=? WHERE user_id=?`, ["", foundUser?.user_id]);

    //Send to front
    return res.status(200).json({ message: "log out successfully" });
  }),

  update: asyncWrapper(async (req: UserRequest, res: Response) => {
    const foundUser = res.locals.userInfo;
    const { username, password } = req.body;

    if (username) foundUser.username = username;
    if (password) {
      const newPassword = await bcrypt.hash(password, 10);
      foundUser.password = newPassword;
    }

    await foundUser.save();

    // let sql: string = `UPDATE users SET `,
    //   vars: string[] = [];

    // //Update sql statement and vars array if username existed
    // if (username) {
    //   sql += "username = ?";
    //   vars.push(username);
    // }

    // //Update sql statement and vars array if password existed
    // if (password) {
    //   if (username) sql += ", ";
    //   const hashedPwd = await bcrypt.hash(password, 10);
    //   sql += "password = ?";
    //   vars.push(hashedPwd);
    // }

    // //Send sql statement to DB
    // await connection.query(`${sql} WHERE user_id=?`, [vars.concat(foundUser.user_id)]);

    //Send to front
    return res.status(201).json({ message: `update account ${foundUser.username} successfully` });
  }),

  forgot: asyncWrapper(async (req: Request, res: Response) => {
    //Get email from req.query
    const { email } = req.params;

    //Found user based on email
    const foundUser = await Users.findOne({ email });

    if (foundUser) {
      //Get new passwordToken and save to foundUser
      const passwordToken = new mongoose.Types.ObjectId().toString();
      foundUser.passwordToken = passwordToken;

      //Send passwordToken to email got from req.query
      await sendEmail({ email: email, token: passwordToken });
    }
    //Throw an error if cannot find matched user
    else
      _throw({
        code: 400,
        errors: { field: "email", message: "email is not register in server" },
        message: "email is not register in server",
      });

    // //Found user based on email
    // const result: any[] = await connection.query(`SELECT * FROM users WHERE email=?`, [email]);
    // const row: User[] = result[0];

    // //Throw an error if cannot find matched user
    // row.length === 0 && _throw({ code: 404, message: "email is not register in server" });

    // //Get new passwordToken and save to foundUser
    // const foundUser = row[0];
    // const passwordToken = uuidv4();
    // await connection.query(`UPDATE users SET passwordToken=? WHERE user_id=?`, [passwordToken, foundUser?.user_id]);

    //Send to front
    return res.status(200).json({ message: "send reset password email successfully" });
  }),

  reset: asyncWrapper(async (req: Request, res: Response) => {
    //Get new Password and secretToken from req.body
    const { password, passwordToken } = req.body;

    //Find user based on secretToken
    const foundUser = await Users.findOne({ passwordToken });

    if (foundUser) {
      // Get new hash password and save it to database
      const hashNewPwd = await bcrypt.hash(password, 10);
      foundUser.password = hashNewPwd;
      await foundUser.save();
    }

    //Throw an error if cannot find user
    else
      _throw({
        code: 400,
        errors: { field: "passwordToken", message: "invalid passwordToken" },
        message: "invalid passwordToken",
      });

    // //Find user based on secretToken
    // const result: any[] = await connection.query(`SELECT * FROM users WHERE passwordToken=?`, [passwordToken]);
    // const row: User[] = result[0];

    // //Throw an error if cannot find user
    // row.length === 0 &&
    //   _throw({
    //     code: 400,
    //     errors: { field: "passwordToken", message: "invalid passwordToken" },
    //     message: "invalid passwordToken",
    //   });

    // const hashedPwd = await bcrypt.hash(password, 10);
    // await connection.query(`UPDATE users SET password=?, passwordToken=? WHERE passwordToken=?`, [hashedPwd, "", passwordToken]);

    // Send to front
    return res.status(200).json({ message: "user reset password successfully" });
  }),
};

export default authController;
