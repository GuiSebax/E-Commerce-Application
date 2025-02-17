import { PrismaClient } from "@prisma/client";

// Instancia o PrismaClient
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

export default prisma;