import { cookies } from "next/headers"

export const IV_COOKIE_NAME = "__megastore_cartiv"
export const CART_COOKIE_NAME = "__megastore_cart"

function cookieOptions(remove: boolean = false) {
    return {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: false, // no worries if javascript can reach this cookie...
        sameSite: "lax",
        expires: remove
            ? new Date(0)
            : new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
    } as const
}

export function getCartCookie() {
    return cookies().get(CART_COOKIE_NAME)?.value
}

export function getCartIvCookie() {
    return cookies().get(IV_COOKIE_NAME)?.value
}

export function setCartIvCookie(value: string) {
    const cookieStore = cookies()
    cookieStore.set(IV_COOKIE_NAME, value, cookieOptions())
}

export function setCartCookie(value: string) {
    const cookieStore = cookies()
    cookieStore.set(CART_COOKIE_NAME, value, cookieOptions())
}

export function clearCartCookies() {
    const cookieStore = cookies()
    cookieStore.set(IV_COOKIE_NAME, "", cookieOptions(true))
    cookieStore.set(CART_COOKIE_NAME, "", cookieOptions(true))
}