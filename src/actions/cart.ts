"use server"

import { getCartCookie, getCartIvCookie, setCartCookie, setCartIvCookie } from "@/lib/cart"
import { decrypt, encrypt } from "@/lib/cipher"
import prisma from "@/lib/prisma"
import { z } from "zod"

// uhm it will handle the actions for the cart, adding items, clearing the cart, etc.

function zodCart() {
    return z.strictObject({
        iv: z.string().min(1),
        cart: z.string().min(1)
    }).safeParse({
        iv: getCartIvCookie(),
        cart: getCartCookie()
    })
}

export async function fetchCart() {
    const result = zodCart()
    if (!result.success) return null

    const { iv, cart } = result.data
    return decrypt<Cart>(iv, cart)
}

export async function addProductToCart(values: any) {
    const result = z.strictObject({
        id: z.string().min(1),
        quantity: z.number().min(1).max(100),
        size: z.string().min(1).max(3),
        color: z.string().min(7).max(7)
    }).safeParse(values)
    if (!result.success) return "Something went wrong"

    const { id, quantity, size, color } = result.data
    const product = await prisma.product.findFirst({
        where: {
            id,
            sizes: {
                has: size,
            },
            hexes: {
                has: color
            }
        }
    })
    if (!product) return "Couldn't find the product"

    const cart = await fetchCart() || { items: [] }
    if (cart.items.some(item => item.id === id)) return "This product is already in the cart"

    cart.items.push({ id, name: product.name, image: product.images[0], size, color, quantity, price: product.cents })
    const [iv, cartHash] = encrypt(cart)
    setCartIvCookie(iv)
    setCartCookie(cartHash)

    return cart
}

export async function removeProductFromCart(value: string) {
    const result = z.string().min(1).safeParse(value)
    if (!result.success) return "Something went wrong"

    const product = await prisma.product.findFirst({
        where: {
            id: result.data
        }
    })
    if (!product) return "Couldn't find the product"

    const cart = await fetchCart() || { items: [] }
    cart.items = cart.items.filter(item => item.id !== product.id)

    const [iv, cartHash] = encrypt(cart)
    setCartIvCookie(iv)
    setCartCookie(cartHash)

    return cart
}
