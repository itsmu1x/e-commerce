import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { cn } from "@/lib/utils"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Your Orders",
}

export default async function Orders() {
    const user = await getUser()
    const orders = await prisma.order.findMany({
        where: {
            userId: user!.id,
        },
    })

    return (
        <div>
            <h1 className="text-lg font-bold uppercase">Orders</h1>
            <p className="text-xs text-muted">View and manage your orders!</p>

            <div className="mt-6">
                {orders.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">#</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Total
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order, idx) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">
                                        {idx + 1}.
                                    </TableCell>
                                    <TableCell>
                                        {order.createdAt.toLocaleString(
                                            "en-GB",
                                            {
                                                dateStyle: "long",
                                            }
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={cn({
                                                "bg-yellow-600":
                                                    !order.completedAt,
                                                "bg-green-600":
                                                    order.completedAt != null,
                                            })}
                                        >
                                            {order.completedAt
                                                ? "Completed"
                                                : "Pending"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        $
                                        {(
                                            ((order.cart as Cart)?.items.reduce(
                                                (total, item) =>
                                                    total +
                                                    item.price * item.quantity,
                                                0
                                            ) ?? 0) / 100
                                        ).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3}>Total</TableCell>
                                <TableCell className="text-right">
                                    $
                                    {(
                                        orders
                                            .map((d) => d.cart as Cart)
                                            .map((d) => d?.items)
                                            .reduce(
                                                (total, items) =>
                                                    total +
                                                    (items?.reduce(
                                                        (total, item) =>
                                                            total +
                                                            item.price *
                                                                item.quantity,
                                                        0
                                                    ) ?? 0),
                                                0
                                            ) / 100
                                    ).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                ) : (
                    <h1 className="font-medium text-xl">
                        You have no orders yet!
                    </h1>
                )}
            </div>
        </div>
    )
}
