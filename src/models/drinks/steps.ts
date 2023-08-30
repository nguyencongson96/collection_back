import { Schema, Types, model } from "mongoose";
// import validator from "validator";
import _throw from "../../utils/_throw";
import Users from "../users";
import Drinks from "./drinks";

interface IStep {
  _id: Types.ObjectId;
  drinkId: Types.ObjectId;
  index: Number;
  content: String;
  createdBy: Types.ObjectId;
  createdAt: Date;
  lastUpdatedAt: Date;
}

const stepSchema = new Schema<IStep>({
  drinkId: {
    type: Schema.ObjectId,
    required: true,
    validate: async (value: Types.ObjectId) => {
      const foundDrink = await Drinks.findById(value);
      !foundDrink && _throw({ code: 400, message: "invalid drink" });
    },
  },

  index: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },

  content: {
    type: String,
    require: true,
    maxlength: 10000,
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

const Steps = model("steps", stepSchema);

export default Steps;
