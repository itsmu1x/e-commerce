"use client"

import type { Prisma } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import {
    MoreHorizontal,
    ArrowUpDown,
    Circle,
    CircleEllipsis,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import ntc from "ntcjs"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export type Product = Prisma.ProductGetPayload<{
    include: {
        category: true
    }
}>

export const columns: ColumnDef<Product>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header({ column }) {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "category.name",
        header({ column }) {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "cents",
        accessorFn(row) {
            return "$" + (row.cents / 100).toFixed(2)
        },
        header({ column }) {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "colors",
        cell({ row }) {
            return (
                <div className="flex gap-0.5">
                    {row.original.hexes.map((hex) => {
                        const name = ntc.name(hex)[1]

                        return (
                            <Tooltip key={hex}>
                                <TooltipTrigger>
                                    <div
                                        style={{ backgroundColor: hex }}
                                        className="size-6 rounded-full"
                                    >
                                        <span className="sr-only">{name}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>{name}</TooltipContent>
                            </Tooltip>
                        )
                    })}
                </div>
            )
        },
        header: "Colors",
    },
    {
        accessorFn(row) {
            return row.sizes.join(", ")
        },
        header: "Sizes",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(product.id)
                            }
                        >
                            Copy ID
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
