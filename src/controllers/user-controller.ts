import express, {Request, Response, NextFunction} from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import {db} from "../db";

export class UserController {
    public readonly router = express.Router();

    constructor() {
        this.router.post('/signup', this.register);
        this.router.post('/signin', this.login);
        this.router.post('/signin/new_token', this.refreshToken);
    }

    private async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {userName, password} = req.body;
        const logged = 0

        let addToDb = `INSERT INTO users (userName, password, logged)
                       VALUES ("${userName}", "${password}", "${logged}")`;

        const sqlSearch = "SELECT * FROM users WHERE userName = ?"
        const search_query = db.format(sqlSearch, [userName])

        try {
            const token = await jwt.sign({
                username: userName,
                expiresIn: process.env.TOKEN_EXP
            }, process.env.TOKEN_SECRET);
            const refreshToken = await jwt.sign({username: userName}, process.env.TOKEN_REFRESH);

            await db.query(search_query, async (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    res.send('User exist')
                } else {
                    await db.query(addToDb, async (err) => {
                        if (err) throw err;
                        res.send({
                            token: token,
                            refreshToken: refreshToken,
                        })
                    });
                }
            });

        } catch (e: unknown) {
            console.error(e);
            next(createError(500, 'Internal error'));
        }
    }

    private async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {userName, password} = req.body

        const sqlSearch = "SELECT * FROM users WHERE userName = ?"
        const search_query = db.format(sqlSearch, [userName])

        try {
            const token = await jwt.sign({
                username: userName,
                expiresIn: process.env.TOKEN_EXP
            }, process.env.TOKEN_SECRET);

            await db.query(search_query, async (err, result) => {
                if (err) throw err

                if (result[0]?.password === password) {
                    return res.json({token});
                } else {
                    return res.status(406).json({
                        message: 'Invalid credentials'
                    });
                }
            })
        } catch (e: unknown) {
            console.error(e);
            next(createError(500, 'Internal error'));
        }
    }

    private async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {refreshToken} = req.body

        try {
            const decoded = await jwt.verify(refreshToken, process.env.TOKEN_REFRESH);

            const token = await jwt.sign({
                username: decoded.username,
                expiresIn: process.env.TOKEN_EXP
            }, process.env.TOKEN_SECRET);


            res.send({token})
        } catch (e: unknown) {
            console.error(e);
            next(createError(500, 'Internal error'));
        }
    }
}