import Item from "@/components/home/Item/item"
import { getUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Wishlist",
}

export default async function Wishlist() {
    const user = await getUser()
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: user!.wishlist,
            },
        },
    })

    return (
        <div>
            <h1 className="text-lg font-bold uppercase">Wishlist</h1>
            <p className="text-xs text-muted">
                Add or remove products from your wishlist
            </p>

            <div className="mt-6 grid grid-cols-auto">
                {products.map((product) => (
                    <Item product={product} key={product.id} padding />
                ))}
            </div>
        </div>
    )
}
