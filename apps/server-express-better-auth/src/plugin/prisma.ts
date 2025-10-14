import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as {
    prisma: PrismaClient;
}

const prsima = globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate())

export default prsima