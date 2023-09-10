import { Schema, Types, model } from "mongoose";
// import validator from "validator";
import _throw from "../../utils/_throw";
import Users from "../users";
import Drinks from "./drinks";

interface ISavedDrink {
  _id: string;
  drinkId: Types.ObjectId;
  createdBy: Types.ObjectId;
  lastUpdatedAt: Date;
}

const savedDrinkSchema = new Schema<ISavedDrink>({
  drinkId: {
    type: Schema.ObjectId,
    required: true,
    validate: async (value: Types.ObjectId) => {
      const foundDrink = await Drinks.findById(value);
      !foundDrink && _throw({ code: 400, message: "invalid drink" });
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

  lastUpdatedAt: {
    type: Date,
    default: new Date(),
  },
});

const SavedDrinks = model("saved_drinks", savedDrinkSchema);

export default SavedDrinks;
