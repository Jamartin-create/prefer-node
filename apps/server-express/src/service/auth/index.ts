import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';

import { getResponse, jwtSign, pbkdf2 } from '@/utils/common';
import { PrismaClient, Users } from 'db/prisma/client';
import passport from '@/plugin/passport';
import stragetyPwd from './stragety-pwd';
import { verifyCode } from './mail-verify';

export { sendVerifyCode } from './mail-verify';

const prisma = new PrismaClient();
passport.use(stragetyPwd);

/**
 * Authenticate user login using passport local strategy
 * @param req Express request object containing login credentials
 * @param res Express response object
 * @param next Express next middleware function
 * @returns {Promise<void>} Returns authentication result
 */
export async function signin(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', function (err: any, user: Users, info: any) {
        if (err) return next(err);
        if (!user) {
            res.send(getResponse(401, info.message));
            return;
        }
        const auth = { token: jwtSign({ id: user.id }) };
        res.send(getResponse(0, 'ok', { user, auth }));
    })(req, res, next);
}

export async function sigininByEmail(email: string, code: string) {
    const flag = await verifyCode(email, 'login', code);

    if (!flag) {
        throw new Error('验证码错误');
    }

    const user = await prisma.users.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error('用户不存在');
    }

    const auth = { token: jwtSign({ id: user.id }) };
    return { user, auth };
}

interface SignupData {
    username: string;
    password: string;
    code: string;
    email: string;
}

/**
 * Create a new user account with the provided signup data
 * @param data SignupData object containing:
 *             - username: User's display name
 *             - password: User's password in plain text
 *             - email: User's email address
 *             - code: Email verification code
 * @throws {Error} If email, password or verification code is missing
 * @throws {Error} If verification code is invalid
 * @throws {Error} If password hashing fails
 * @returns {Promise<void>} Returns nothing on success
 */
export async function singup(data: SignupData) {
    const { username, password, email, code } = data;

    if (!email || !password || !code) {
        throw new Error('缺少必要参数');
    }

    if (!(await verifyCode(email, 'registry', code))) {
        throw new Error('验证码错误');
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const [err, hashedPassword] = await pbkdf2(password, salt);

    if (err) throw err;

    await prisma.$transaction(async pc => {
        const user = await pc.users.create({
            data: { username, email }
        });
        await pc.usersIdentities.create({
            data: {
                provider: 'password',
                user_id: user.id,
                salt: salt,
                password_hash: hashedPassword
            }
        });
        return user;
    });
}
