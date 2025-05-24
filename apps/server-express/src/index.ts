import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { globLogger } from 'logger';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { expressjwt } from 'express-jwt';

import routes from '@/routes';
import passport from '@/plugin/passport';
import { connectRedis } from '@/plugin/redisCache';
import { catchException } from '@/utils/exceptions';

dotenv.config({ path: `.env` });

const app = express();

app.use(
    expressjwt({
        secret: process.env.SERVER_JWT_SALT as any,
        requestProperty: 'auth',
        algorithms: ['HS256']
    }).unless({
        path: [new RegExp('^\/v1\/auth\/.*')]
    })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SERVER_SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(routes); // 挂载路由

app.use(catchException); // 全局异常捕获

connectRedis();

const server = http.createServer(app);
server.listen(process.env.SERVER_PORT, () => {
    globLogger.info(`Server listen on port ${process.env.SERVER_PORT}`);
});
