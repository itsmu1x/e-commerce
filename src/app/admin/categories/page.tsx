import { DataTable } from "./data-table"
import { columns } from "./columns"
import prisma from "@/lib/prisma"

export default async function Categories() {
    const categories = await prisma.category.findMany({
        include: {
            _count: true,
        },
    })

    return <DataTable columns={columns} data={categories} />
}
