import express, {Request, Response, NextFunction} from 'express';
import createError from "http-errors";

export class LogoutService {
    public readonly router = express.Router();

    constructor() {
        this.router.post('/', this.logout);

    }

    private async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.send('ok')
        } catch (e: unknown) {
            console.error(e);
            next(createError(500, 'Internal error'));
        }
    }
}