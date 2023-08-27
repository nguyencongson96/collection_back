import { Request, Response } from "express";
import { UserRequest } from "../../types/custom";
import connection from "../../config/database";
import _throw from "../../utils/_throw";
import asyncWrapper from "../../middleware/asyncWrapper";
import Genres from "../../models/genre/genres";

const genreController = {
  getList: asyncWrapper(async function (req: Request, res: Response) {
    const genresList = await Genres.find().select({ _id: 1, title: 1, image: 1 });

    // const sql = `SELECT genre_id, content, image FROM genres`;

    // const result: any[] = await connection.query(sql, []);
    // const row: any[] = result[0];
    // row.length === 0 && _throw({ code: 404, message: "genres not found" });

    return res.status(200).json({ meta: { total: genresList.length }, data: genresList, message: "retrieve successfully" });
  }),

  getFlavorMatch: asyncWrapper(async function (req: Request, res: Response) {
    const { id } = req.params;

    const sql = `SELECT f.flavor_id, f.name as flavor_name, IF(ISNULL(dl.link_id), false, true) as isMatched 
    FROM flavors f
    LEFT JOIN drink_links dl
	  ON dl.flavor_id=f.flavor_id AND dl.genre_id=?
    `;

    const result: any[] = await connection.query(sql, [id]);
    const row: any[] = result[0];
    row.length === 0 && _throw({ code: 404, message: "no match" });

    return res.status(200).json({ data: row, message: "retrieve successfully" });
  }),

  addNew: asyncWrapper(async function (req: UserRequest, res: Response) {
    const { title, summary, image } = req.body;
    const foundUser = res.locals.userInfo;

    //Find genre in DB
    const foundGenre = await Genres.findOne({ title: title.trim() });

    //Throw error if genre existed
    if (foundGenre) _throw({ code: 400, message: "genre already existed" });
    //Create new genre
    else {
      await Genres.create({
        title: title.trim(),
        summary: summary.trim(),
        image: image,
        createdBy: foundUser._id,
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      });
    }

    //Send to front
    return res.status(201).json({ message: "created succesfully" });
  }),
};

export default genreController;
