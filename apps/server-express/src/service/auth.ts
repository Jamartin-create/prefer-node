import { pbkdf2 } from '@/utils/common';
import crypto from 'crypto';
import { PrismaClient } from 'db/prisma/client';

const prisma = new PrismaClient();

interface SignupData {
    username: string;
    password: string;
    provider: 'password' | 'email';
    email?: string;
}

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
