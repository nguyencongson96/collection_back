import { Response } from "express";
import _throw from "../../utils/_throw";
import asyncWrapper from "../../middleware/asyncWrapper";
import { UserRequest } from "../../types/custom";
import Drinks from "../../models/drinks/drinks";
import Ingredients from "../../models/drinks/ingredients";
import Steps from "../../models/drinks/steps";

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
};

export default recipeController;
