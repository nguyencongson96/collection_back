import { Request, Response } from "express";
import connection from "../config/database";
import _throw from "../utils/_throw";
import asyncWrapper from "../middleware/asyncWrapper";

const genreController = {
  getList: asyncWrapper(async function (req: Request, res: Response) {
    const sql = `SELECT genre_id, content, image FROM genres`;

    const result: any[] = await connection.query(sql, []);
    const row: any[] = result[0];
    row.length === 0 && _throw({ code: 404, message: "drink not found" });

    return res.status(200).json({ data: row, message: "retrieve successfully" });
  }),

  getMatch: asyncWrapper(async function (req: Request, res: Response) {
    const { id } = req.params;
    const sql = `SELECT * FROM drink_links dl
    JOIN flavors f
	ON dl.flavor_id=f.flavor_id
    WHERE dl.genre_id=?`;

    const result: any[] = await connection.query(sql, [id]);
    const row: any[] = result[0];
    row.length === 0 && _throw({ code: 404, message: "drink not found" });

    return res.status(200).json({ data: row, message: "retrieve successfully" });
  }),
};

export default genreController;
