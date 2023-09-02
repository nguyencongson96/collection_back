import { Response } from "express";
import _throw from "../../utils/_throw";
import asyncWrapper from "../../middleware/asyncWrapper";
import { UserRequest } from "../../types/custom";
import Drinks from "../../models/drinks/drinks";
import Rates from "../../models/drinks/rates";

const rateController = {
  addNew: asyncWrapper(async function (req: UserRequest, res: Response) {
    const foundUser = res.locals.userInfo;
    const { drinkId, rate } = req.body;

    let message;
    const foundDrink = await Drinks.findById(drinkId);
    if (!foundDrink) _throw({ code: 400, message: "drink not existed" });

    const foundRate = await Rates.findOne({ drinkId, createdBy: foundUser._id });
    if (foundRate) {
      foundRate.rate = Number(rate);
      foundRate.lastUpdatedAt = new Date();
      await foundRate.save();
      message = "updated successfully";
    } else {
      await Rates.create({
        drinkId,
        rate,
        createdBy: foundUser._id,
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      });
      message = "created successfully";
    }
    return res.status(201).json({ message });
  }),

  // updateAverage: asyncWrapper(async function (req: Request, res: Response) {
  //   return res.json({ message: "123" });
  // }),
};

export default rateController;
