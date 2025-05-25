import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

const transporter = nodemailer.createTransport({
    service: '163',
    host: 'pop.163.com',
    port: 110,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

export default transporter;

/**
 * @description Send an email using nodemailer transport
 * @param {string} email - Recipient email address
 * @param {Mail.Options} options - Additional email options to override defaults
 * @returns {Promise<any>} Promise that resolves with mail info or rejects with error
 */
export function sendMail(email: string, options: Mail.Options): Promise<any> {
    return new Promise((resolve, reject) => {
        // Merge default options with provided options
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: `${process.env.PROJECT_NAME} 发来一条消息`,
            html: '这是一条消息',
            ...options
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(info);
        });
    });
}
