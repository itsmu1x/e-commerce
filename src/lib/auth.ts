import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import prisma from "./prisma"
import { Prisma } from "@prisma/client"

type Payload = {
    id: string
}

const DEFAULT_SELECT = {
    id: true,
    name: true,
    email: true,
    createdAt: true,
    isAdmin: true,
    wishlist: true,
}

function secretKey() {
    return new TextEncoder().encode(process.env.JWT_SECRET)
}

function cookieOptions(remove: boolean = false) {
    return {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        expires: remove
            ? new Date(0)
            : new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
    } as const
}

export function removeCookie() {
    const cookieStore = cookies()
    cookieStore.set(
        process.env.NEXT_PUBLIC_COOKIE_NAME,
        "",
        cookieOptions(true)
    )
}

export function setTokenCookie(token: string) {
    const cookieStore = cookies()
    cookieStore.set(process.env.NEXT_PUBLIC_COOKIE_NAME, token, cookieOptions())
}

export function createUserJwtToken(payload: Payload) {
    return new SignJWT(payload)
        .setIssuedAt()
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setExpirationTime("30d")
        .sign(secretKey())
}

export async function verifyUserJwtToken(token: string) {
    if (!token) return null

    try {
        return (await jwtVerify(token, secretKey())).payload as Payload
    } catch {
        return null
    }
}

export async function verifyUserJwt(token: string) {
    const payload = await verifyUserJwtToken(token)
    if (!payload?.id) return null
    return payload
}

export function getUserCookie() {
    const cookieStore = cookies()
    return cookieStore.get(process.env.NEXT_PUBLIC_COOKIE_NAME)?.value
}

export async function isValidToken() {
    const token = getUserCookie()
    if (!token) return false
    const payload = await verifyUserJwtToken(token)
    return payload != null
}

export async function getUser(select: Prisma.UserSelect = {}) {
    const token = getUserCookie()
    if (!token) return null

    const payload = await verifyUserJwt(token)
    if (!payload) return null

    return await prisma.user.findFirst({
        where: {
            id: payload.id,
        },
        select: {
            ...DEFAULT_SELECT,
            ...select,
        },
    })
}

type ProductsProps = Partial<{
    cursor: string
    category: number
    order: string
    color: string
    size: string
}>

function orderize(order?: string): [string, string] {
    switch (order?.toLowerCase()) {
        case "oldest": return ["createdAt", "asc"]
        case "price-low": return ["cents", "asc"]
        case "price-high": return ["cents", "desc"]
        default: return ["createdAt", "desc"]
    }
}

export async function fetchProducts({ cursor, category, order, color, size }: ProductsProps = {}) {
    const orderBy = orderize(order)
    const data: any = {
        orderBy: {
            [orderBy[0]]: orderBy[1],
        },
        take: 10,
        skip: 1,
        cursor: {
            id: cursor
        },
        where: {
            categoryId: !category || isNaN(category) ? undefined : category,
            hexes: !color ? undefined : {
                has: color
            },
            sizes: !size ? undefined : {
                has: size
            }
        }
    }

    if (!cursor) {
        delete data["skip"]
        delete data["cursor"]
    }

    if (!color) {
        delete data["where"]["color"]
    }

    if (!size) {
        delete data["where"]["size"]
    }

    if (!category || isNaN(category)) {
        delete data["where"]["categoryId"]
    }

    return await prisma.product.findMany(data)
}