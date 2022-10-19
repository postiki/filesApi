import express, {Request, Response, NextFunction} from 'express';
import createError from "http-errors";
import {db} from "../db";

export class FileServices {
    public readonly router = express.Router();

    constructor() {
        this.router.post('/upload', this.uploadFile);
        this.router.get('/list', this.getFiles);
        this.router.delete('/delete/:id', this.deleteFile);
        this.router.get('/:id', this.getDataFile);
        this.router.get('/download/:id', this.downloadFile);
        this.router.put('/update/:id', this.updateFile);
    }

    private async uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {name, extension, type, size} = req.body;
        const edited = Date.now() / 10000

        let addToDb = `INSERT INTO files (name, extension, type, size, edited)
                       VALUES ("${name}", "${extension}", "${type}", "${size}", "${edited}")`;

        try {
            db.query(addToDb, async (err) => {
                if (err) throw err;
                res.send('ok')
            });

        } catch (e: unknown) {
            console.error(e);
            next(createError(500, 'Internal error'));
        }
    }

    private async getFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
        const sqlSearch = `SELECT *
                           FROM files LIMIT ${req.body.size || 1}`

        try {
            db.query(sqlSearch, async (err, result) => {
                if (err) throw err;
                res.send({result})
            });

        } catch (e: unknown) {
            console.error(e);
            next(createError(500, 'Internal error'));
        }
    }

    private async deleteFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        const sqlDelete = `DELETE
                           FROM files
                           WHERE name = '${req.params.id}'`
        try {
            await db.query(sqlDelete, async (err) => {
                if (err) throw err;
                res.send('ok')
            });
        } catch (e: unknown) {
            console.error(e);
            next(createError(500, 'Internal error'));
        }
    }

    private async getDataFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {id} = req.params;

        const sqlSearch = `SELECT *
                           FROM files
                           WHERE name = '${id}'`

        try {
            db.query(sqlSearch, async (err, result) => {
                if (err) throw err;
                res.send({result})
            })
        } catch (e: unknown) {
            console.error(e);
            next(createError(500, 'Internal error'));
        }
    }

    private async downloadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {id} = req.params;

        const sqlSearch = "SELECT * FROM files WHERE name = ?"
        const searchQuery = db.format(sqlSearch, [id])

        try {
            db.query(searchQuery, async (err, result) => {
                if (err) throw err;
                res.send({result})
            })
        } catch (e: unknown) {
            console.error(e);
            next(createError(500, 'Internal error'));
        }
    }

    private async updateFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {name, extension} = req.body;
        const sql = `UPDATE files
                     SET '${name}' '${extension}'
                     WHERE name = '${req.params.id}'`
        try {
            db.query(sql, async (err) => {
                if (err) throw err;
                res.send('ok')
            })
        } catch (e: unknown) {
            console.error(e);
            next(createError(500, 'Internal error'));
        }
    }
}