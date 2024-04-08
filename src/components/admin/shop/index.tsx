"use client"
import type { Prisma } from "@prisma/client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Item from "@/components/home/Item/item"
import { Button } from "@/components/ui/button"
import { Filter, Loader2 } from "lucide-react"
import { loadMoreProducts, orderProducts } from "@/actions/shop"
import { useDebouncedCallback } from "@/lib/useDebounce"
import { cn, getHexesFromProducts, getSizesFromProducts } from "@/lib/utils"
import Colors from "../colors"
import Sizes from "../sizes"

type Props = {
    initialProducts: Prisma.ProductGetPayload<{}>[]
    categories: Prisma.CategoryGetPayload<{}>[]
}

export default function Shop({ initialProducts, categories }: Props) {
    const [products, setProducts] =
        useState<typeof initialProducts>(initialProducts)
    const [loading, setLoading] = useState<boolean | null>(() =>
        initialProducts.length < 10 ? null : false
    )
    const [opened, setOpened] = useState(false)

    const ref = useRef<HTMLDivElement>(null)
    const params = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()
    const colorState = useState<string | null>(params.get("color") || null)
    const sizeState = useState<string | null>(params.get("size") || null)

    useEffect(() => {
        const handler = (event: MouseEvent) => {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node) &&
                !event.defaultPrevented
            ) {
                setOpened(false)
            }
        }
        document.addEventListener("click", handler, true)
        return () => document.removeEventListener("click", handler, true)
    }, [])

    useEffect(() => {
        if (!sizeState[0] && !params.get("size")) return
        sizise(sizeState[0])
    }, [sizeState[0]])

    useEffect(() => {
        if (!colorState[0] && !params.get("color")) return
        colorize(colorState[0])
    }, [colorState[0]])

    const setCategory = useDebouncedCallback(async (categoryId: number) => {
        const newParams = new URLSearchParams(params.toString())
        if (categoryId === parseInt(params.get("category") ?? "")) {
            newParams.delete("category")
        } else {
            newParams.set("category", `${categoryId}`)
        }
        router.replace(`${pathname}?${newParams.toString()}`)

        const newProducts = await orderProducts(
            Object.fromEntries(newParams.entries())
        )
        if (newProducts) setProducts(newProducts)
    }, 400)

    const orderize = useDebouncedCallback(async (order: string) => {
        if (order === params.get("order")) return

        const newParams = new URLSearchParams(params.toString())
        if (order !== "unset") {
            newParams.set("order", order)
        } else {
            newParams.delete("order")
        }
        router.replace(`${pathname}?${newParams.toString()}`)

        const newProducts = await orderProducts(
            Object.fromEntries(newParams.entries())
        )
        if (newProducts) setProducts(newProducts)
    }, 400)

    // let's just not talk about the function names.. xd
    const sizise = useDebouncedCallback(async (size: string) => {
        if (size === params.get("size")) return

        const newParams = new URLSearchParams(params.toString())
        if (size) {
            newParams.set("size", size)
        } else {
            newParams.delete("size")
        }
        router.replace(`${pathname}?${newParams.toString()}`)

        const newProducts = await orderProducts(
            Object.fromEntries(newParams.entries())
        )
        if (newProducts) setProducts(newProducts)
    }, 400)

    const colorize = useDebouncedCallback(async (color: string) => {
        if (color === params.get("color")) return

        const newParams = new URLSearchParams(params.toString())
        if (color) {
            newParams.set("color", color)
        } else {
            newParams.delete("color")
        }
        router.replace(`${pathname}?${newParams.toString()}`)

        const newProducts = await orderProducts(
            Object.fromEntries(newParams.entries())
        )
        if (newProducts) setProducts(newProducts)
    }, 400)

    const loadMore = async () => {
        if (loading) return
        setLoading(true)

        const newProducts = await loadMoreProducts(
            Object.fromEntries(params.entries()),
            products[products.length - 1].id
        )

        if (newProducts) {
            if (newProducts.products.length > 0) {
                setProducts((old) => [...old, ...newProducts.products])
            }

            if (newProducts.finsihed) {
                setLoading(null)
            } else {
                setLoading(false)
            }
        } else {
            setLoading(false)
        }
    }

    return (
        <div className="container divide-top">
            <div className="grid gap-6 grid-cols-4">
                <div
                    className={cn(
                        "fixed left-0 top-0 duration-300 h-full lg:sticky lg:top-36 lg:h-fit w-full z-50 lg:z-10 lg:col-span-1 bg-black/70 backdrop-blur-sm",
                        {
                            "translate-x-0": opened,
                            "-translate-x-full lg:translate-x-0": !opened,
                        }
                    )}
                >
                    <div
                        ref={ref}
                        className="p-4 py-10 bg-white w-72 lg:w-full h-full"
                    >
                        <h1 className="text-2xl font-semibold">Filters</h1>

                        <Accordion className="mt-4" type="multiple">
                            <AccordionItem value="categories">
                                <AccordionTrigger>Categories</AccordionTrigger>
                                <AccordionContent>
                                    <ul className="flex flex-col gap-2">
                                        {categories.map((category) => (
                                            <li
                                                key={category.id}
                                                className="cursor-pointer hover:underline w-fit"
                                                onClick={() =>
                                                    setCategory(category.id)
                                                }
                                            >
                                                {category.name}
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="colors">
                                <AccordionTrigger>Colors</AccordionTrigger>
                                <AccordionContent>
                                    <Colors
                                        state={colorState}
                                        colors={getHexesFromProducts(products)}
                                    />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="sizes">
                                <AccordionTrigger>Sizes</AccordionTrigger>
                                <AccordionContent>
                                    <Sizes
                                        state={sizeState}
                                        sizes={getSizesFromProducts(products)}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>

                <div className="col-span-4 lg:col-span-3 bg-white">
                    <div className="flex justify-between p-4">
                        <h1 className="text-2xl font-semibold">Shop</h1>

                        <div className="flex w-full max-w-64 gap-2">
                            <Select
                                defaultValue={params.get("order") ?? ""}
                                onValueChange={(value) => orderize(value)}
                            >
                                <SelectTrigger aria-label="Sort by">
                                    <SelectValue placeholder="Sort by.." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">
                                        Latest
                                    </SelectItem>
                                    <SelectItem value="oldest">
                                        Oldest
                                    </SelectItem>
                                    <SelectItem value="price-low">
                                        Price: low to high
                                    </SelectItem>
                                    <SelectItem value="price-high">
                                        Price: high to low
                                    </SelectItem>
                                    <SelectItem value="unset">Unset</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                className="lg:hidden"
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setOpened((d) => !d)}
                            >
                                <Filter className="size-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="border-y mb-6 grid gap-4 grid-cols-auto p-4">
                        {products.length === 0 ? (
                            <h1 className="font-medium">No results found.</h1>
                        ) : (
                            products.map((product) => (
                                <Item key={product.id} product={product} />
                            ))
                        )}
                    </div>

                    <div className="flex justify-center">
                        {loading !== null && (
                            <Button
                                disabled={loading}
                                className="mb-6 font-semibold flex gap-1.5 items-center"
                                onClick={loadMore}
                            >
                                {loading && (
                                    <Loader2 className="animate-spin" />
                                )}
                                Load more
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
