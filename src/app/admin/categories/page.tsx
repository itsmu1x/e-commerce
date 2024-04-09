import { DataTable } from "./data-table"
import { columns } from "./columns"
import prisma from "@/lib/prisma"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Categories",
}

export default async function Categories() {
    const categories = await prisma.category.findMany({
        include: {
            _count: true,
        },
    })

    return <DataTable columns={columns} data={categories} />
}
