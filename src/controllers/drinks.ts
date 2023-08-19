import { Request, Response } from "express";
import connection from "../config/database";
import _throw from "../utils/_throw";
import asyncWrapper from "../middleware/asyncWrapper";

const drinkController = {
  match: asyncWrapper(async function (req: Request, res: Response) {
    const { genre_id, flavor_id } = req.query;
    const sql = `SELECT d.drink_id, d.name as drink_name, d.image as drink_image, d.summary as drink_summary, g.content as genre, g.description as genre_summary, p.url as playlist
      FROM drink_links dl 
      LEFT JOIN drinks d ON dl.drink_id=d.drink_id
      LEFT JOIN genres g ON dl.genre_id=g.genre_id
      LEFT JOIN playlists p ON dl.genre_id=p.genre_id
      WHERE dl.genre_id=? and dl.flavor_id=?
      ORDER BY RAND()
      LIMIT 1;`;

    const result: any[] = await connection.query(sql, [genre_id, flavor_id]);
    const row: any[] = result[0];
    row.length === 0 && _throw({ code: 404, message: "there is no match" });

    return res.status(200).json({ data: row[0], message: "match successfully" });
  }),

  getOne: asyncWrapper(async function (req: Request, res: Response) {
    const { id } = req.params;
    const sql = `SELECT name, image, content FROM drinks WHERE drink_id=?`;

    const result: any[] = await connection.query(sql, [id]);
    const row: any[] = result[0];
    row.length === 0 && _throw({ code: 404, message: "drink not found" });

    return res.status(200).json({ data: row[0], message: "retrieve successfully" });
  }),
};

export default drinkController;
