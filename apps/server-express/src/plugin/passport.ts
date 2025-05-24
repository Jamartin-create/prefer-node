import passport from 'passport';
import localStrategy from 'passport-local';

import { PrismaClient } from 'db/prisma/client';
import { pbkdf2 } from '@/utils/common';
import { authLogger } from './logger';

const message = {
    username: '用户名或密码错误'
};

const pc = new PrismaClient();

const local = new localStrategy.Strategy(async function verify(
    username: string,
    password: string,
    cb?: any
) {
    try {
        const user = await pc.users.findUnique({
            where: { username: username }
        });
        if (!user) throw new Error();

        const authication = await pc.usersIdentities.findFirst({
            where: { user_id: user.id, provider: 'password' }
        });

        if (!authication) throw new Error();

        const [err, hashedPwd] = await pbkdf2(password, authication.salt!);

        if (err || hashedPwd !== authication.password_hash) throw new Error();

        return cb(null, user);
    } catch (e) {
        authLogger.error(e);
        return cb(null, false, { message: message.username });
    }
});

passport.serializeUser(function (user: any, cb) {
    cb(null, { id: user.id, username: user.username });
});
passport.deserializeUser(function (user: any, cb) {
    // @TODO：结合 redis
    cb(null, user);
});

passport.use(local);

export default passport;
