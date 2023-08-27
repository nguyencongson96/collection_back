import { Request, Response } from "express";
// import connection from "../config/database";
import _throw from "../utils/_throw";
import asyncWrapper from "../middleware/asyncWrapper";
import { UserRequest } from "../types/custom";
import Flavors from "../models/flavors";
import GenreFlavor from "../models/drinks/genre_flavor";
import mongoose from "mongoose";

const flavorController = {
  getList: asyncWrapper(async function (req: Request, res: Response) {
    const flavorList = await Flavors.find().select({ _id: 1, title: 1, image: 1 });
    // const sql = `SELECT flavor_id, name, image FROM flavors`;

    // const result: any[] = await connection.query(sql, []);
    // const row: any[] = result[0];
    // row.length === 0 && _throw({ code: 404, message: "flavors not found" });

    return res.status(200).json({ meta: { total: flavorList.length }, data: flavorList, message: "retrieve successfully" });
  }),

  getGenreMatch: asyncWrapper(async function (req: Request, res: Response) {
    const { id } = req.params;

    const foundGenreList = await GenreFlavor.aggregate([{ $match: { flavorId: new mongoose.Types.ObjectId(id) } }]);

    // const sql = `SELECT g.genre_id, g.name as genre_name, IF(ISNULL(dl.link_id), false, true) as isMatched
    // FROM genres g
    // LEFT JOIN drink_links dl
    // ON dl.genre_id=g.genre_id AND dl.flavor_id=?
    // `;

    // const result: any[] = await connection.query(sql, [id]);
    // const row: any[] = result[0];
    // row.length === 0 && _throw({ code: 404, message: "no match" });

    return res.status(200).json({ data: foundGenreList, message: "retrieve successfully" });
  }),

  addNew: asyncWrapper(async function (req: UserRequest, res: Response) {
    const foundUser = res.locals.userInfo;
    const { title, image } = req.body;

    const foundFlavor = await Flavors.findOne({ title: title.trim() });
    if (foundFlavor)
      await Flavors.create({
        title: title.trim(),
        image: image,
        createdBy: foundUser._id,
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      });
    else _throw({ code: 400, message: "flavor existed" });

    return res.status(201).json({ message: "created successfully" });
  }),
};

export default flavorController;
