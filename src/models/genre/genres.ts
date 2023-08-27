import { Schema, Types, model } from "mongoose";
import validator from "validator";
import _throw from "../../utils/_throw";
import Users from "../users";

interface IGenre {
  _id: string;
  title: string;
  summary: string;
  image: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  lastUpdatedAt: Date;
}

const genreSchema = new Schema<IGenre>({
  title: {
    type: String,
    maxlength: 16,
    required: true,
  },

  summary: {
    type: String,
    require: true,
  },

  image: {
    type: String,
    maxlength: 1000,
    require: true,
    validate: (value: string) => {
      !validator.isURL(value) && _throw({ code: 400, message: "Invalid image URL" });
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

const Genres = model("genres", genreSchema);

export default Genres;
