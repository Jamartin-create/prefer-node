import localStrategy from 'passport-local';

import { PrismaClient } from 'db/prisma/client';
import { pbkdf2 } from '@/utils/common';
import { authLogger } from 'logger';

const pc = new PrismaClient();

/**
 * Local authentication strategy using username and password
 * Verifies user credentials against database
 * Uses PBKDF2 for password hashing
 */
export default new localStrategy.Strategy(async function verify(
    username: string,
    password: string,
    cb?: any
) {
    try {
        const user = await pc.users.findUnique({
            where: { username: username }
        });
        if (!user) throw new Error('empty user');

        const authication = await pc.usersIdentities.findFirst({
            where: { user_id: user.id, provider: 'password' }
        });

        if (!authication) throw new Error();

        const [err, hashedPwd] = await pbkdf2(password, authication.salt!);

        if (err || hashedPwd !== authication.password_hash) {
            authLogger.warn(`${user.username} try to login failed`);
            throw new Error();
        }
        authLogger.info(`${user.username} login`);
        return cb(null, user);
    } catch (e) {
        authLogger.error(e);
        return cb(null, false, { message: '用户名或密码错误' });
    }
});
