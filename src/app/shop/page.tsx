import { fetchProducts } from "@/lib/auth"
import Shop from "@/components/admin/shop"
import prisma from "@/lib/prisma"

type Props = {
    searchParams: Record<string, string>
}

export default async function ShopPage({ searchParams }: Props) {
    const categories = await prisma.category.findMany()
    const products = await fetchProducts({
        category: parseInt(searchParams.category ?? ""),
        order: searchParams.order,
    })

    return <Shop categories={categories} initialProducts={products} />
}
