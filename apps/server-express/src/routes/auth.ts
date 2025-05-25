import { Router } from 'express';
import { sendVerifyCode, signin, singup, sigininByEmail } from '@/service/auth';

const routes = Router();
/**
 * @swagger
 * /auth/login/{type}:
 *   post:
 *     summary: User login endpoint
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [password, email]
 *         description: Login type (password or email)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid login type
 */
routes.post('/login/:type', async function (req, res, next) {
    const { type } = req.params;

    try {
        if (type === 'password') {
            // Use the existing signin function for password login
            signin(req, res, next);
        } else if (type === 'email') {
            const { email, code } = req.body;
            const result = await sigininByEmail(email, code);
            res.send({ code: 0, msg: 'ok', data: result });
        } else {
            res.send({ code: 400, msg: '无效的登录类型' });
        }
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: User registration endpoint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration successful
 */
routes.post('/signup', async function (req, res, next) {
    try {
        await singup(req.body);
        res.send({ code: 0, msg: 'ok' });
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 * /auth/mail/code/{type}:
 *   post:
 *     summary: Send verification code email
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: Type of verification code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Verification code sent successfully
 */
routes.post('/mail/code/:type', async function (req, res, next) {
    try {
        await sendVerifyCode(req.body.email, req.params.type);
        res.send({ code: 0, msg: 'ok' });
    } catch (e) {
        next(e);
    }
});
export default routes;
