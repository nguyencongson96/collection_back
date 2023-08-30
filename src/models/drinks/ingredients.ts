import { Schema, Types, model } from "mongoose";
// import validator from "validator";
import _throw from "../../utils/_throw";
import Users from "../users";
import Drinks from "./drinks";

interface IIngredient {
  _id: Types.ObjectId;
  drinkId: Types.ObjectId;
  ingredient: String;
  amount: String;
  calUnit?: String;
  createdBy: Types.ObjectId;
  createdAt: Date;
  lastUpdatedAt: Date;
}

const ingredientSchema = new Schema<IIngredient>({
  drinkId: {
    type: Schema.ObjectId,
    required: true,
    validate: async (value: Types.ObjectId) => {
      const foundDrink = await Drinks.findById(value);
      !foundDrink && _throw({ code: 400, message: "invalid drink" });
    },
  },

  ingredient: {
    type: String,
    required: true,
    maxlength: 1000,
  },

  amount: {
    type: String,
    require: true,
    maxlength: 1000,
  },

  calUnit: {
    type: String,
    maxlength: 100,
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

const Ingredients = model("ingredients", ingredientSchema);

export default Ingredients;
