import prisma from "@/lib/prisma"
import stripe from "@/lib/stripe"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

// some basic code to handle the order it self, and it could be improved but this is for demo purposes.
export const GET = async (_req: NextRequest, { params: { id } }: { params: { id: string } }) => {
    const order = await prisma.order.findUnique({
        where: {
            id,
        }
    })
    if (!order) redirect("/")
    if (order.completedAt) redirect("/")

    const session = await stripe.checkout.sessions.retrieve(id)
    if (!session || session.status !== "complete" || session.payment_status !== "paid") redirect("/")

    await prisma.order.update({
        data: {
            completedAt: new Date(),
        },
        where: {
            id: session.id,
        }
    })

    redirect("/profile/orders")
}