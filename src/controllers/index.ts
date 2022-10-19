import express from 'express';
import {AuthMiddleware} from "../middlewares";
import {FileServices} from "../services/file-services";
import {UserController} from "./user-controller";
import {UserService} from "../services/user-service";
import {LogoutService} from "../services/logout-service";

export class RootController {
    public readonly router = express.Router();

    constructor() {
        const auth = new AuthMiddleware();

        this.router.use('/', new UserController().router)
        this.router.use('/file', auth.use(), new FileServices().router);
        this.router.use('/info', auth.use(), new UserService().router);
        this.router.use('/logout', auth.use(), new LogoutService().router);
    }
}