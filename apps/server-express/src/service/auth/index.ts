import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';

import { getResponse, jwtSign, pbkdf2 } from '@/utils/common';
import { PrismaClient, Users } from 'db/prisma/client';
import passport from '@/plugin/passport';
import stragetyPwd from './stragety-pwd';

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

interface SignupData {
    username: string;
    password: string;
    provider: 'password' | 'email';
    email?: string;
}

/**
 * Create a new user account using username and password
 * @param username The username for the new account
 * @param password The password to hash and store
 * @throws {Error} If there's an error during password hashing or database operations
 * @returns {Promise<void>}
 */
async function signupByPwd(username: string, password: string) {
    const salt = crypto.randomBytes(16).toString('hex');
    const [err, hashedPassword] = await pbkdf2(password, salt);

    if (err) throw err;

    await prisma.$transaction(async pc => {
        const user = await pc.users.create({
            data: { username }
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

/**
 * Create a new user account with the provided signup data
 * @param data The signup data containing username, password, provider type and optional email
 * @throws {Error} If required fields are missing or there's an error during signup
 * @returns {Promise<void>}
 */
export async function singup(data: SignupData) {
    const { username, password, provider, email } = data;

    if (
        (provider === 'email' && !email) ||
        (provider === 'password' && !password)
    ) {
        throw new Error('email is required');
    }

    if (provider === 'password') {
        await signupByPwd(username, password);
    }
}
