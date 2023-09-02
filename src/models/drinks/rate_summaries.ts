import { Schema, Types, model } from "mongoose";
// import validator from "validator";
import _throw from "../../utils/_throw";
import Drinks from "./drinks";

interface IRateSummary {
  _id: Types.ObjectId;
  drinkId: Types.ObjectId;
  average: number;
  lastUpdatedAt: Date;
}

const rateSummarySchema = new Schema<IRateSummary>({
  drinkId: {
    type: Schema.ObjectId,
    required: true,
    validate: async (value: Types.ObjectId) => {
      const foundDrink = await Drinks.findById(value);
      !foundDrink && _throw({ code: 400, message: "invalid drink" });
    },
  },

  average: {
    type: Number,
    required: true,
    validate: (value: number) => {
      (value > 5 || value < 1) && _throw({ code: 400, message: "rate must be in range from 1 to 5" });
    },
  },

  lastUpdatedAt: {
    type: Date,
    default: new Date(),
  },
});

const RateSummaries = model("rate_summaries", rateSummarySchema);

export default RateSummaries;
