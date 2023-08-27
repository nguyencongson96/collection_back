import { Schema, Types, model } from "mongoose";
import validator from "validator";
import _throw from "../utils/_throw";
import Users from "./users";

interface IFlavor {
  _id: Types.ObjectId;
  title: string;
  image: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  lastUpdatedAt: Date;
}

const flavorSchema = new Schema<IFlavor>({
  title: {
    type: String,
    required: true,
    validate: (value: string) => {
      !validator.isAlpha(value) && _throw({ code: 400, message: "invalid content" });
    },
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

const Flavors = model("flavors", flavorSchema);

export default Flavors;
