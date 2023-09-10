import { Response } from "express";
import { Types } from "mongoose";
import _throw from "../../utils/_throw";
import asyncWrapper from "../../middleware/asyncWrapper";
import { UserRequest } from "../../types/custom";
import Drinks from "../../models/drinks/drinks";
import Ingredients from "../../models/drinks/ingredients";
import Steps from "../../models/drinks/steps";
import SavedDrinks from "../../models/drinks/saved_drinks";

interface Ingredients {
  ingredient: string;
  amount: string;
  calUnit: string;
}

const recipeController = {
  addNew: asyncWrapper(async function (req: UserRequest, res: Response) {
    const foundUser = res.locals.userInfo;
    const { ingredients, steps, drinkId } = req.body;

    const foundDrink = await Drinks.findById(drinkId);
    const foundIngredient = await Ingredients.findOne({ drinkId });
    if (!foundDrink) _throw({ code: 400, message: "drink not existed" });
    else if (foundIngredient) _throw({ code: 400, message: "drink already has ingredients" });
    else {
      let promiseArray: any[] = [];

      ingredients.forEach((item: Ingredients) => {
        const { ingredient, amount, calUnit } = item;
        promiseArray.push(
          Ingredients.create({
            drinkId,
            ingredient,
            amount,
            calUnit,
            createdBy: foundUser._id,
            createdAt: new Date(),
            lastUpdatedAt: new Date(),
          })
        );
      });

      steps.forEach((content: string, index: number) => {
        promiseArray.push(
          Steps.create({
            drinkId,
            index: (index += 1),
            content,
            createdBy: foundUser._id,
            createdAt: new Date(),
            lastUpdatedAt: new Date(),
          })
        );
      });

      await Promise.all(promiseArray);
    }

    return res.status(201).json({ message: "created successfully" });
  }),

  saved: asyncWrapper(async function (req: UserRequest, res: Response) {
    const foundUser = res.locals.userInfo;
    const { drinkId } = req.body;
    if (!drinkId) _throw({ code: 400, message: "invalid" });

    let message;
    const foundSave = await SavedDrinks.findOne({ drinkId });

    if (foundSave) {
      await SavedDrinks.deleteOne({ drinkId: drinkId });
      message = "unsaved successfully";
    } else {
      await SavedDrinks.create({
        drinkId: drinkId,
        createdBy: foundUser._id,
        lastUpdatedAt: new Date(),
      });
      message = "update successfully";
    }

    return res.status(201).json({ message });
  }),

  getSavedList: asyncWrapper(async function (req: UserRequest, res: Response) {
    const foundUser = res.locals.userInfo;

    const result = await SavedDrinks.aggregate([
      { $match: { createdBy: new Types.ObjectId(foundUser._id) } },
      { $lookup: { from: "drinks", localField: "drinkId", foreignField: "_id", as: "drink" } },
      { $unwind: "$drink" },
      {
        $lookup: {
          from: "rate_summaries",
          localField: "drinkId",
          foreignField: "drinkId",
          as: "rate",
          pipeline: [{ $project: { average: 1 } }],
        },
      },
      { $unwind: "$rate" },
      {
        $project: {
          lastUpdatedAt: 1,
          _id: "$drinkId",
          title: "$drink.title",
          name: "$drink.name",
          image: "$drink.image",
          rate: "$rate.average",
        },
      },
    ]);

    return res.status(200).json({ data: result, message: "retrieve successfully" });
  }),
};

export default recipeController;
