"use server"

import { fetchProducts } from "@/lib/auth"
import { z } from "zod"

const schema = z.strictObject({
    category: z.string().optional().transform((value) => parseInt(value ?? "")),
    cursor: z.string().optional(),
    order: z.string().optional(),
    color: z.string().min(7).max(7).optional(),
    size: z.string().max(3).optional()
})

export async function orderProducts(values: any) {
    const result = schema.safeParse(values)
    if (!result.success) return null

    return await fetchProducts(result.data)
}

export async function loadMoreProducts(values: any, id: string) {
    const result = schema.safeParse(values)
    if (!result.success) return null

    const products = await fetchProducts({
        ...result.data, cursor: id
    })

    return {
        products,
        finsihed: products.length < 10
    }
}