import { Schema, Types, model } from "mongoose";
import validator from "validator";
import _throw from "../../utils/_throw";
import Users from "../users";
import Genres from "./genres";

interface IPlaylist {
  _id: Types.ObjectId;
  genreId: Types.ObjectId;
  url: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  lastUpdatedAt: Date;
}

const playListSchema = new Schema<IPlaylist>({
  genreId: {
    type: Schema.Types.ObjectId,
    required: true,
    validate: async (value: Types.ObjectId) => {
      const foundGenre = await Genres.findById(value);
      if (!foundGenre) _throw({ code: 400, message: "invalid genre" });
    },
  },

  url: {
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

const PlayLists = model("playlists", playListSchema);

export default PlayLists;
