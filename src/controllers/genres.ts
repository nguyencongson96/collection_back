import { Request, Response } from "express";
import connection from "../config/database";
import _throw from "../utils/_throw";
import asyncWrapper from "../middleware/asyncWrapper";

const genreController = {
  getList: asyncWrapper(async function (req: Request, res: Response) {
    const sql = `SELECT genre_id, content, image FROM genres`;

    const result: any[] = await connection.query(sql, []);
    const row: any[] = result[0];
    row.length === 0 && _throw({ code: 404, message: "genres not found" });

    return res.status(200).json({ data: row, message: "retrieve successfully" });
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
};

export default genreController;
