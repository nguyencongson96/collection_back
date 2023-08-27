import { Request, Response } from "express";
import _throw from "../../utils/_throw";
import asyncWrapper from "../../middleware/asyncWrapper";
import GenreFlavor from "../../models/drinks/genre_flavor";

const genreFlavorController = {
  addNew: asyncWrapper(async function (req: Request, res: Response) {
    const foundUser = res.locals.userInfo;
    for (const { drinkId, genreId, flavorId } of req.body) {
      await GenreFlavor.create({
        drinkId,
        genreId,
        flavorId,
        createdBy: foundUser._id,
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      });
    }
    return res.status(201).json({ message: "created successfully" });
  }),
};

export default genreFlavorController;
