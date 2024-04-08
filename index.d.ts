import type { Prisma } from "@prisma/client"

declare global {
    type User =
        | Omit<
            Prisma.UserGetPayload<{}>,
            "password" | "deletedAt" | "updatedAt"
        >
        | null
        | undefined

    type CartItem = Prisma.ProductGetPayload<{
        select: {
            id: true
            name: true
        }
    }> & {
        size: string
        color: string
        price: number // cents
        quantity: number
        image: string
    }

    type Cart = {
        items: CartItem[]
        discount?: string
    } | null

    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_COOKIE_NAME: string
            ORIGIN: string

            JWT_SECRET: string
            DATABASE_URL: string
            CIPHER_KEY: string
            STRIPE_KEY: string

            // ImageKit
            IK_URL: string
            IK_PUBLIC: string
            IK_PRIVATE: string
        }
    }
}

export { }
