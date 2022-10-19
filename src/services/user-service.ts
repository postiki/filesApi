import express, {Request, Response, NextFunction} from 'express';
import createError from "http-errors";
import jwt from 'jsonwebtoken';
import {db} from "../db";

export class UserService {
    public readonly router = express.Router();

    constructor() {
        this.router.get('/', this.getUserId);

    }

    private async getUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        const [type, token] = req.headers.authorization.split(' ');
        if (type !== 'Bearer' || !token) {
            return next(createError(401, 'Invalid token'));
        }


        try {
            const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);
            const sqlSearch = "SELECT * FROM users WHERE userName = ?"
            const search_query = db.format(sqlSearch, [decoded.username])
            await db.query(search_query, async (err, result) => {
                res.send({id: result[0].userName})
            })
        } catch (e: unknown) {
            console.error(e);
            next(createError(500, 'Internal error'));
        }
    }
}