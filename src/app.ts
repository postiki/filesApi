import express from 'express';
import cors from 'cors';

import { RootController } from './controllers';

const app = express();

app.use(cors());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));

app.use('/', new RootController().router);

export default app;