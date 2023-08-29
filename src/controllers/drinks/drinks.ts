import { Request, Response } from "express";
// import connection from "../../config/database";
import _throw from "../../utils/_throw";
import asyncWrapper from "../../middleware/asyncWrapper";
import { UserRequest } from "../../types/custom";
import Drinks from "../../models/drinks/drinks";
import GenreFlavor from "../../models/drinks/genre_flavor";
import { Types } from "mongoose";

interface matchRequest extends Request {
  query: {
    genre_id: string;
    flavor_id: string;
  };
}

const drinkController = {
  match: asyncWrapper(async function (req: matchRequest, res: Response) {
    const { genre_id, flavor_id } = req.query;

    let result: any[];
    if (!genre_id && !flavor_id) {
      result = await Drinks.find().select({ _id: 1, name: 1, image: 1 });
    } else {
      result = (
        await GenreFlavor.aggregate([
          { $match: { genreId: new Types.ObjectId(genre_id), flavorId: new Types.ObjectId(flavor_id) } },
          { $sample: { size: 1 } },
          { $lookup: { from: "drinks", localField: "drinkId", foreignField: "_id", as: "drink" } },
          { $lookup: { from: "genres", localField: "genreId", foreignField: "_id", as: "genre" } },
          {
            $lookup: {
              from: "playlists",
              localField: "genreId",
              foreignField: "genreId",
              as: "playlist",
              pipeline: [{ $sample: { size: 1 } }],
            },
          },
          { $unwind: "$genre" },
          { $unwind: "$drink" },
          { $unwind: "$playlist" },
          {
            $project: {
              drink: { name: "$drink.name", summary: "$drink.summary", image: "$drink.image" },
              genre: { title: "$genre.title", summary: "$genre.summary", image: "$genre.image" },
              playlist: { url: "$playlist.url" },
            },
          },
        ])
      )[0];
    }

    if (result.length === 0) _throw({ code: 400, message: "did not match" });

    // const sql = `SELECT d.drink_id, d.name as drink_name, d.image as drink_image, d.summary as drink_summary, g.content as genre, g.description as genre_summary, p.url as playlist
    //   FROM drink_links dl
    //   LEFT JOIN drinks d ON dl.drink_id=d.drink_id
    //   LEFT JOIN genres g ON dl.genre_id=g.genre_id
    //   LEFT JOIN playlists p ON dl.genre_id=p.genre_id
    //   WHERE dl.genre_id=? and dl.flavor_id=?
    //   ORDER BY RAND()
    //   LIMIT 1;`;

    // const result: any[] = await connection.query(sql, [genre_id, flavor_id]);
    // const row: any[] = result[0];
    // row.length === 0 && _throw({ code: 404, message: "there is no match" });

    return res.status(200).json({ data: result, message: "match successfully" });
  }),

  getOne: asyncWrapper(async function (req: Request, res: Response) {
    const { id } = req.params;

    const foundDrink = await Drinks.findById(id);
    if (!foundDrink) _throw({ code: 400, message: "invalid drink" });
    // const sql = `SELECT name, image, content FROM drinks WHERE drink_id=?`;

    // const result: any[] = await connection.query(sql, [id]);
    // const row: any[] = result[0];
    // row.length === 0 && _throw({ code: 404, message: "drink not found" });

    return res.status(200).json({ data: foundDrink, message: "retrieve successfully" });
  }),

  addNew: asyncWrapper(async function (req: UserRequest, res: Response) {
    const foundUser = res.locals.userInfo;
    const { name, title, summary, content, image } = req.body;

    const foundDrink = await Drinks.findOne({ name });
    if (foundDrink) _throw({ code: 400, message: "drink existed" });
    else
      await Drinks.create({
        name,
        title,
        summary,
        content,
        image,
        createdBy: foundUser._id,
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      });

    return res.status(201).json({ message: "created successfully" });
  }),
};

export default drinkController;
