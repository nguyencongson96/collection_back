import { Schema, Types, model } from "mongoose";
// import validator from "validator";
import _throw from "../../utils/_throw";
import Users from "../users";
import Drinks from "./drinks";
import RateSummaries from "./rate_summaries";

interface IRate {
  _id: Types.ObjectId;
  drinkId: Types.ObjectId;
  rate: number;
  createdBy: Types.ObjectId;
  createdAt: Date;
  lastUpdatedAt: Date;
}

const rateSchema = new Schema<IRate>({
  drinkId: {
    type: Schema.ObjectId,
    required: true,
    validate: async (value: Types.ObjectId) => {
      const foundDrink = await Drinks.findById(value);
      !foundDrink && _throw({ code: 400, message: "invalid drink" });
    },
  },

  rate: {
    type: Number,
    required: true,
    validate: (value: number) => {
      (value > 5 || value < 1) && _throw({ code: 400, message: "rate must be in range from 1 to 5" });
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

rateSchema.post("save", async function (doc) {
  const data = await Rates.aggregate([
    { $match: { drinkId: doc.drinkId } },
    { $group: { _id: null, average: { $avg: "$rate" } } },
    { $project: { average: { $round: ["$average", 2] } } },
  ]);
  await RateSummaries.findOneAndUpdate(
    { drinkId: doc.drinkId },
    { average: data[0].average },
    { runValidators: true, upsert: true }
  );
});

const Rates = model("rates", rateSchema);

export default Rates;
