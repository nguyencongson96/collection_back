import { Request } from "express";

export interface User {
  user_id: string;
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  lastUpdatedAt: Date;
  passwordToken?: string;
}

export interface Throw {
  errors?: { field: string; message: string };
  meta?: string;
  message?: string;
  code: number;
}

export interface UserRequest extends Request {
  userInfo: User;
}

export interface Login {
  username: string;
  password: string;
}

export interface Register {
  email: string;
  username: string;
  password: string;
}

export interface sendEmail {
  email: string;
  token: string;
  url?: string;
}
