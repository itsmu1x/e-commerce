import { Metadata } from "next"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import prisma from "@/lib/prisma"

export const metadata: Metadata = {
    title: "Products",
}

export default async function Products() {
    const categories = await prisma.category.findMany()
    const products = await prisma.product.findMany({
        include: { category: true },
    })

    return (
        <DataTable categories={categories} columns={columns} data={products} />
    )
}
