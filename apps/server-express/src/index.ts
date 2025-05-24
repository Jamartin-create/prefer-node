import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { catchException } from '@/utils/exceptions';
import routes from '@/routes';
import Log from '@/plugin/log';

dotenv.config({
    path: `.env.${process.env.NODE_ENV || 'dev'}`
});

const app = express();
const server = http.createServer(app);

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes); // 挂载路由
app.use(catchException); // 全局异常捕获

function init() {
    server.listen(process.env.SERVER_PORT, () => {
        Log.success('Server start success!');
    });
}

init();
