import {NextFunction, Request, Response} from 'express';
import createError from 'http-errors';
import {Middleware} from './middleware';
import jwt from 'jsonwebtoken';

export interface IGetUserAuthInfoRequest extends Request {
    user: string
}

export class AuthMiddleware extends Middleware {
    protected async handle(req: IGetUserAuthInfoRequest, _res: Response, next: NextFunction): Promise<void> {
        if (!req.headers.authorization) {
            return next(createError(401, 'No `Authorization` header present'));
        }

        const [type, token] = req.headers.authorization.split(' ');
        if (type !== 'Bearer' || !token) {
            return next(createError(401, 'Invalid token'));
        }

        try {
            const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);
            const exp = decoded.iat + (Number(decoded.expiresIn) / 1000)
            const dateNow = Date.now() / 1000

            if ((exp - dateNow) < 0) {
                _res.send('Token expired')
                return
            }

            jwt.verify(token, process.env.TOKEN_SECRET, (err: any, user: any) => {
                console.log(err)

                if (err) return _res.sendStatus(403)

                req.user = user

                next()
            })
        } catch (e) {
            console.log(e)
        }
    }
}