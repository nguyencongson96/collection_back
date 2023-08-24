import mongoose from "mongoose";
import validator from "validator";
import _throw from "../utils/_throw";

interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  accessToken: string;
  passwordToken: string;
  createdAt: Date;
  lastUpdatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    trim: true,
    required: true,
    maxlength: 16,
    validate: (value: string) => {
      !validator.isAlphanumeric(value, "en-US", { ignore: "-_'." }) &&
        _throw({
          code: 400,
          message: "Invalid username",
        });
    },
  },

  email: {
    type: String,
    required: true,
    validate: (value: string) => {
      !validator.isEmail(value) &&
        _throw({
          code: 400,
          message: "Invalid email",
        });
    },
  },

  password: {
    type: String,
    minlength: 8,
    validate: (value: string) => {
      !validator.isStrongPassword(value, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 0, minSymbols: 0 }) &&
        _throw({
          code: 400,
          message: "password is weak",
        });
    },
  },

  accessToken: {
    type: String,
  },

  passwordToken: {
    type: String,
  },

  createdAt: {
    type: Date,
  },

  lastUpdatedAt: {
    type: Date,
    default: new Date(),
  },
});

const Users = mongoose.model("users", userSchema);

export default Users;
