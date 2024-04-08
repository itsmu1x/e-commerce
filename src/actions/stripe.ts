"use server"

import { getUser } from "@/lib/auth"
import stripe from "@/lib/stripe"
import { fetchCart } from "./cart"
import { redirect } from "next/navigation"
import { clearCartCookies } from "@/lib/cart"
import { isRedirectError } from "next/dist/client/components/redirect"
import prisma from "@/lib/prisma"

export async function makeCheckout() {
    const user = await getUser()
    if (!user) return "Unauthorized"

    const cart = await fetchCart()
    if (!cart) return "Your cart is empty!"

    try {
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            shipping_address_collection: {
                allowed_countries: ["US", "CA", "PS", "EG", "IL", "PS"],
            },
            phone_number_collection: {
                enabled: true,
            },
            success_url: `${process.env.ORIGIN}/checkout/{CHECKOUT_SESSION_ID}`,
            cancel_url: process.env.ORIGIN,
            line_items: cart.items.map((item) => ({
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: item.name,
                        images: [item.image],
                        description: `Buying ${item.name} x${item.quantity} from MegaStore!`,
                        metadata: {
                            userId: user.id,
                            productId: item.id,
                        },
                    },
                    unit_amount: item.price
                },
                quantity: item.quantity
            }))
        })

        if (!session?.url) return "Couldn't create the checkout session"
        await prisma.order.create({
            data: {
                id: session.id,
                userId: user.id,
                cart,
            }
        })

        clearCartCookies()
        redirect(session.url)
    } catch (error) {
        if (isRedirectError(error)) throw error
        return "Failed to create the checkout session"
    }
}