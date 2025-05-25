import { authLogger } from '@/plugin/logger';
import { sendMail } from '@/plugin/nodemailer';
import { deleteCache, getCache, setCache } from '@/plugin/redisCache';
import { PrismaClient } from 'db/prisma/client';

const prismaClient = new PrismaClient();

/**
 * Send verification code to user's email
 * @param email The email address to send verification code to
 * @throws {Error} When verification code was sent within 55 seconds
 * @throws {Error} When email sending fails
 */
export async function sendVerifyCode(email: string, type: string) {
    if (!['registry', 'login'].includes(type)) {
        throw new Error('未知邮件类型');
    }

    if (type === 'registry') {
        const user = await prismaClient.users.findUnique({
            where: { email }
        });

        if (user) throw new Error('用户已存在');
    }

    const key = `verify_code_${type}:${email}`;

    const cache = await getCache(key);

    if (cache && Date.now() - cache.cti < 55 * 1000) {
        throw new Error('验证码已发送，请稍后再试');
    }

    if (cache) {
        await deleteCache(key);
    }

    const code = Math.floor(Math.random() * 1000000);
    const mailOptions = {
        subject: `${process.env.PROJECT_NAME} 注册验证码`,
        html: `您的验证码是：${code}，有效期为5分钟`
    };

    try {
        await sendMail(email, mailOptions);
        authLogger.info('邮件发送成功');

        setCache(key, { code, cti: Date.now() }, 5 * 60);
    } catch (e) {
        authLogger.error('邮件发送失败', e);
        throw new Error('邮件发送失败');
    }
}

/**
 * Verify the code sent to user's email
 * @param email The email address to verify
 * @param code The verification code to check
 * @returns {Promise<boolean>} True if verification succeeds, false otherwise
 */
export async function verifyCode(email: string, type: string, code: string) {
    const key = `verify_code_${type}:${email}`;
    const cache = await getCache(key);

    if (!cache) return false;

    if (cache.code.toString() === code) {
        await deleteCache(key);
        return true;
    }

    return false;
}
