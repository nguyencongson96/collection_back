import { Schema, Types, model } from "mongoose";
import validator from "validator";
import _throw from "../../utils/_throw";
import Users from "../users";

interface IDrink {
  _id: string;
  name: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  lastUpdatedAt: Date;
}

const drinkSchema = new Schema<IDrink>({
  name: {
    type: String,
    required: true,
    maxlength: 100,
    validate: (value: string) => {
      !validator.isAlpha(value, "en-US", { ignore: " -" }) && _throw({ code: 400, message: "invalid name" });
    },
  },

  title: {
    type: String,
    required: true,
  },

  summary: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
    validate: (value: string) => {
      !validator.isURL(value) && _throw({ code: 400, message: "invalid image" });
    },
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    validate: async (value: Schema.Types.ObjectId) => {
      const foundUser = await Users.findById(value);
      if (!foundUser) _throw({ code: 400, message: "invalid user" });
    },
  },

  createdAt: {
    type: Date,
  },

  lastUpdatedAt: {
    type: Date,
    default: new Date(),
  },
});

const Drinks = model("drinks", drinkSchema);

export default Drinks;
