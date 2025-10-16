import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { openAPI, username } from 'better-auth/plugins'
import prsima from '../prisma';

export const auth = betterAuth({
    account: {
        accountLinking: {
            allowDifferentEmails: true
        }
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            enabled: true
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
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