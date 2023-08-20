import { Request, Response } from "express";
import connection from "../config/database";
import _throw from "../utils/_throw";
import asyncWrapper from "../middleware/asyncWrapper";

const flavorController = {
  getList: asyncWrapper(async function (req: Request, res: Response) {
    const sql = `SELECT flavor_id, name, image FROM flavors`;

    const result: any[] = await connection.query(sql, []);
    const row: any[] = result[0];
    row.length === 0 && _throw({ code: 404, message: "flavors not found" });

    return res.status(200).json({ data: row, message: "retrieve successfully" });
  }),

  getGenreMatch: asyncWrapper(async function (req: Request, res: Response) {
    const { id } = req.params;
    const sql = `SELECT g.genre_id, g.name as genre_name, IF(ISNULL(dl.link_id), false, true) as isMatched 
    FROM genres g
    LEFT JOIN drink_links dl
	  ON dl.genre_id=g.genre_id AND dl.flavor_id=?
    `;

    const result: any[] = await connection.query(sql, [id]);
    const row: any[] = result[0];
    row.length === 0 && _throw({ code: 404, message: "no match" });

    return res.status(200).json({ data: row, message: "retrieve successfully" });
  }),
};

export default flavorController;
