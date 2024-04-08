"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { type FormEvent, useState } from "react"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/admin/tables/view-options"
import { Plus, Trash2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { createProduct, deleteProducts } from "@/actions/admin"
import { toast } from "sonner"
import type { Prisma } from "@prisma/client"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    categories: Prisma.CategoryGetPayload<{}>[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
    categories,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    )

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    })

    const rem = async () => {
        const ids: string[] = table
            .getSelectedRowModel()
            .rows.map((d) => (d.original as any).id)
        const response = await deleteProducts(ids)
        if (response) {
            toast.error(response)
        } else {
            toast.success("Products deleted!")
        }
    }

    const add = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const response = await createProduct(formData)

        if (response) {
            toast.error(response)
        } else {
            toast.success("Product added")
            event.currentTarget?.reset()
        }
    }

    return (
        <div>
            <div className="flex items-center py-4">
                <div className="inline-flex gap-2">
                    <Input
                        placeholder="Filter products..."
                        value={
                            (table
                                .getColumn("name")
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn("name")
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-52"
                    />

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                aria-label="Add Product"
                                variant="outline"
                                size="icon"
                            >
                                <Plus className="size-6" />
                                <span className="sr-only">Create Product</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Product</DialogTitle>
                            </DialogHeader>

                            <form onSubmit={add} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="product_name">
                                        Product
                                    </Label>
                                    <Input
                                        type="text"
                                        id="product_name"
                                        name="product"
                                        placeholder="Product Name"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="category">Category</Label>
                                    <Select name="category">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={`${category.id}`}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="price">
                                        Price in cents
                                    </Label>
                                    <Input
                                        type="number"
                                        id="price"
                                        name="price"
                                        placeholder="Price"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="colors">Colors</Label>
                                    <Input
                                        type="text"
                                        id="colors"
                                        name="colors"
                                        placeholder="Colors, e.g. '#ffffff, #000000'"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="sizes">Sizes</Label>
                                    <Input
                                        type="text"
                                        id="sizes"
                                        name="sizes"
                                        placeholder="Sizes, e.g. 'sm, lg, xl'"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="images">Images</Label>
                                    <Input
                                        type="file"
                                        id="images"
                                        name="images"
                                        accept="image/x-png,image/jpeg,image/webp,image/avif"
                                        multiple
                                    />
                                </div>

                                <Button className="mt-4">Add</Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Button
                        aria-label="Delete"
                        size="icon"
                        variant="outline"
                        className="text-red-600"
                        onClick={rem}
                    >
                        <Trash2 className="size-6" />
                    </Button>
                </div>

                <DataTableViewOptions table={table} />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>

                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
