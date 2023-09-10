import { Request, Response } from "express";
import { UserRequest } from "../../types/custom";
// import connection from "../../config/database";
import _throw from "../../utils/_throw";
import asyncWrapper from "../../middleware/asyncWrapper";
import PlayLists from "../../models/genre/playlists";
// import Genres from "../../models/genre/genres";

const playlistController = {
    getList: asyncWrapper(async function (req: Request, res: Response) {
        const result = await PlayLists.aggregate([
            {
                $lookup: {
                    from: "genres",
                    localField: "genreId",
                    foreignField: "_id",
                    as: "genre",
                    pipeline: [{ $project: { title: 1 } }],
                },
            },
            { $unwind: "$genre" },
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdBy",
                    pipeline: [{ $project: { username: 1 } }],
                },
            },
            { $unwind: "$createdBy" },
            { $project: { genreId: 0, __v: 0 } },
        ]);
        // const sql = `SELECT genre_id, content, image FROM genres`;

        // const result: any[] = await connection.query(sql, []);
        // const row: any[] = result[0];
        // row.length === 0 && _throw({ code: 404, message: "genres not found" });

        return res.status(200).json({ data: result, message: "retrieve successfully" });
    }),

    addNew: asyncWrapper(async function (req: UserRequest, res: Response) {
        const { genreId, url } = req.body;
        const foundUser = res.locals.userInfo;

        await PlayLists.create({
            genreId: genreId,
            url: url,
            createdBy: foundUser._id,
            createdAt: new Date(),
            lastUpdatedAt: new Date(),
        });

        //Send to front
        return res.status(201).json({ message: "created succesfully" });
    }),
};

export default playlistController;
