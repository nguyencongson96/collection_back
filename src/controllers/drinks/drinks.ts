import { Request, Response } from "express";
// import connection from "../../config/database";
import { Types } from "mongoose";
import _throw from "../../utils/_throw";
import asyncWrapper from "../../middleware/asyncWrapper";
import { UserRequest } from "../../types/custom";
import Drinks from "../../models/drinks/drinks";
import GenreFlavor from "../../models/drinks/genre_flavor";
import Users from "../../models/users";
import HistoryMatches from "../../models/drinks/history_matches";

interface queryRequest extends Request {
  query: {
    genre_id: string;
    flavor_id: string;
    page: string;
    limit: string;
  };
}

const drinkController = {
  getList: asyncWrapper(async function (req: queryRequest, res: Response) {
    const page = Number(req.query.page ?? 1);
    const filter = req.query.flavor_id ?? "all";
    const limit = Number(req.query.limit ?? 9);

    let aggregateArr: any[] = [];
    if (filter !== "all") {
      aggregateArr = aggregateArr.concat([
        {
          $lookup: {
            from: "genre_flavors",
            localField: "_id",
            foreignField: "drinkId",
            as: "flavorId",
            pipeline: [{ $project: { flavorId: 1, _id: 0 } }],
          },
        },
        { $unwind: "$flavorId" },
        { $match: { "flavorId.flavorId": new Types.ObjectId(filter) } },
      ]);
    }

    aggregateArr = aggregateArr.concat([
      { $setWindowFields: { output: { total: { $count: {} } } } },
      { $addFields: { page: page, limit: limit, pages: { $ceil: { $divide: ["$total", limit] } } } },
      { $sort: { lastUpdatedAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $facet: {
          meta: [
            {
              $group: {
                _id: null,
                total: { $first: "$total" },
                limit: { $first: "$limit" },
                page: { $first: "$page" },
                pages: { $first: "$pages" },
              },
            },
            { $unset: "_id" },
          ],
          data: [{ $project: { _id: 1, title: 1, image: 1 } }],
        },
      },
      { $unwind: "$meta" },
    ]);

    const result = await Drinks.aggregate(aggregateArr);
    if (result.length === 0) _throw({ code: 400, message: "no data" });

    return res.status(200).json(Object.assign({ message: "retrieve successfully" }, result[0]));
  }),

  match: asyncWrapper(async function (req: queryRequest, res: Response) {
    const { genre_id, flavor_id } = req.query;

    let result: any[] = [];
    if (!genre_id && !flavor_id) _throw({ code: 400, message: "genre_id and flavor_id are required" });
    else {
      result = await GenreFlavor.aggregate([
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
            drink: { _id: "$drink._id", name: "$drink.name", summary: "$drink.summary", image: "$drink.image" },
            genre: { _id: "$genre._id", title: "$genre.title", summary: "$genre.summary", image: "$genre.image" },
            playlist: { _id: "$playlist._id", url: "$playlist.url" },
          },
        },
      ]);
      if (result.length === 0) _throw({ code: 400, message: "did not match" });
    }

    const authHeader: string = req.headers.authorization || "";
    if (authHeader) {
      !authHeader.startsWith("Bearer ") && _throw({ code: 403, message: "invalid token" });
      const accessToken = authHeader.split(" ")[1];
      const foundUser = await Users.findOne({ accessToken });

      if (foundUser)
        await HistoryMatches.create({
          drinkId: result[0].drink._id,
          genreId: genre_id,
          flavorId: flavor_id,
          createdAt: new Date(),
          createdBy: foundUser._id,
        });
      else _throw({ code: 403, message: "outdated token" });
    }

    return res.status(200).json({ data: result[0], message: "match successfully" });

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
  }),

  getDetail: asyncWrapper(async function (req: Request, res: Response) {
    const { id } = req.params;

    const result = await Drinks.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: "ingredients",
          localField: "_id",
          foreignField: "drinkId",
          as: "ingredients",
          pipeline: [{ $project: { ingredient: 1, amount: 1, calUnit: 1 } }],
        },
      },
      {
        $lookup: {
          from: "steps",
          localField: "_id",
          foreignField: "drinkId",
          as: "steps",
          pipeline: [{ $project: { index: 1, content: 1 } }],
        },
      },
      {
        $lookup: {
          from: "rate_summaries",
          localField: "_id",
          foreignField: "drinkId",
          as: "rate",
          pipeline: [{ $project: { average: 1 } }],
        },
      },
      { $unwind: "$rate" },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "author",
          pipeline: [{ $project: { name: "$username" } }],
        },
      },
      { $unwind: "$author" },
      {
        $project: {
          name: 1,
          title: 1,
          content: 1,
          image: 1,
          rate: "$rate.average",
          createdAt: 1,
          author: 1,
          steps: 1,
          ingredients: 1,
        },
      },
    ]);

    if (result.length === 0) _throw({ code: 400, message: "did not match" });

    return res.status(200).json({ data: result[0], message: "retrieve successfully" });
  }),

  getHistoryMatch: asyncWrapper(async function (req: UserRequest, res: Response) {
    const foundUser = res.locals.userInfo;

    const result = await HistoryMatches.aggregate([
      { $match: { createdBy: new Types.ObjectId(foundUser._id) } },
      {
        $lookup: {
          from: "drinks",
          localField: "drinkId",
          foreignField: "_id",
          as: "drink",
          pipeline: [{ $project: { _id: 1, name: 1, image: 1 } }],
        },
      },
      { $unwind: "$drink" },
      {
        $lookup: {
          from: "genres",
          localField: "genreId",
          foreignField: "_id",
          as: "genre",
          pipeline: [{ $project: { _id: 1, title: 1, image: 1 } }],
        },
      },
      { $unwind: "$genre" },
      {
        $lookup: {
          from: "flavors",
          localField: "flavorId",
          foreignField: "_id",
          as: "flavor",
          pipeline: [{ $project: { _id: 1, title: 1, image: 1 } }],
        },
      },
      { $unwind: "$flavor" },
    ]);

    return res.status(200).json(result);
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
