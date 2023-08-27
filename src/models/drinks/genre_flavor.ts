import { Schema, Types, model } from "mongoose";
// import validator from "validator";
import _throw from "../../utils/_throw";
import Users from "../users";
import Drinks from "./drinks";
import Genres from "../genre/genres";
import Flavors from "../flavors";

interface IGenreFlavor {
  _id: string;
  drinkId: Types.ObjectId;
  genreId: Types.ObjectId;
  flavorId: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  lastUpdatedAt: Date;
}

const genreFlavorSchema = new Schema<IGenreFlavor>({
  drinkId: {
    type: Schema.ObjectId,
    required: true,
    validate: async (value: Types.ObjectId) => {
      const foundDrink = await Drinks.findById(value);
      !foundDrink && _throw({ code: 400, message: "invalid drink" });
    },
  },

  genreId: {
    type: Schema.ObjectId,
    required: true,
    validate: async (value: Types.ObjectId) => {
      const foundGenre = await Genres.findById(value);
      !foundGenre && _throw({ code: 400, message: "invalid genre" });
    },
  },

  flavorId: {
    type: Schema.ObjectId,
    required: true,
    validate: async (value: Types.ObjectId) => {
      const foundFlavor = await Flavors.findById(value);
      !foundFlavor && _throw({ code: 400, message: "invalid flavor" });
    },
  },

  createdBy: {
    type: Schema.ObjectId,
    required: true,
    validate: async (value: Schema.Types.ObjectId) => {
      const foundUser = await Users.findById(value);
      if (!foundUser) _throw({ code: 400, message: "invalid user" });
    },
  },

  createdAt: {
    required: true,
    type: Date,
  },

  lastUpdatedAt: {
    type: Date,
    default: new Date(),
  },
});

const GenreFlavor = model("genre_flavor", genreFlavorSchema);

export default GenreFlavor;
