import { createSoftDeleteExtension } from "prisma-extension-soft-delete"
import { PrismaClient } from "@prisma/client"

const createPrismaClient = () => {
    return new PrismaClient().$extends(
        createSoftDeleteExtension({
            models: {
                User: true,
            },
            defaultConfig: {
                field: "deletedAt",
                createValue(deleted) {
                    if (deleted) return new Date()
                    return null
                },
            },
        })
    )
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof createPrismaClient>
}

const prisma = globalThis.prismaGlobal ?? createPrismaClient()

export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma
