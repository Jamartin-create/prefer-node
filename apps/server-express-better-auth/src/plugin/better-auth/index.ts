import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { openAPI, username } from 'better-auth/plugins'
import prsima from '../prisma';

export const auth = betterAuth({
    socialProviders: {
        github: {
            clientId: 'Ov23liIdnwm9j0sdCF1k',
            clientSecret: "776db6ae9b27c6a678b3ddc71428088ed5fac502",
            enabled: true
        }
    },
    plugins: [
        username(),
        openAPI()
    ],
    emailAndPassword: {
        enabled: true,
        disableSignUp: false,
        sendVerificationEmail: false,
        signUp: {
            autoSignIn: true,
            sendVerificationEmail: false,
        }
    },
    // @ts-ignore
    database: prismaAdapter(prsima, {
        provider: 'mysql'
    }),
    trustedOrigins: [
        'http://localhost:5173',
    ]
});