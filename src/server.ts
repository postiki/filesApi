import app from './app';
import config from './config';
import * as http from 'http';
import {db} from "./db";

class Server {
    private static server = http.createServer(app);

    public static async start(): Promise<void> {

        await db.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }

            console.log('connected as id ' + db.threadId);
        });

        await this.listen()

        console.log(`listening at :${config.port}`);
    }

    private static listen(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server.on('listening', resolve);
            this.server.on('error', (err) => {
                console.error(err);
                reject(err);
            });
            this.server.listen(config.port);
        });
    }
}

Server.start().catch((err) => {
    console.error(err);
});