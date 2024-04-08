import Hero from "@/components/home/hero"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import prisma from "@/lib/prisma"
import Item from "@/components/home/Item/item"

export default async function Page() {
    const products = await prisma.product.findMany({
        take: 10,
        orderBy: {
            createdAt: "desc",
        },
    })
    const categories = await prisma.category.findMany({
        take: 4,
        include: {
            _count: true,
        },
        orderBy: {
            products: {
                _count: "desc",
            },
        },
    })

    return (
        <>
            <Hero />

            <div className="container mt-32">
                <div className="grid gap-8 gap-y-32 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="relative bg-white rounded-lg p-5"
                        >
                            <Link
                                aria-label="Item"
                                href={`/shop?category=${category.id}`}
                            >
                                <Image
                                    className="absolute -top-24 left-1/2 -translate-x-1/2"
                                    src={category.image}
                                    alt={category.name}
                                    width={128}
                                    height={128}
                                />

                                <hr className="my-5" />

                                <h1 className="text-xl font-semibold text-center">
                                    {category.name}
                                </h1>
                                <p className="text-center text-muted text-sm">
                                    {category._count.products} products
                                </p>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="border bg-white shadow-md divide-top">
                    <div className="p-5 border-b flex flex-col md:flex-row md:justify-between">
                        <h1 className="text-2xl font-bold">
                            Featured Products
                        </h1>
                        <Link
                            className="text-muted text-lg inline-flex gap-1 items-center"
                            aria-label="Shop all categories"
                            href="/shop"
                        >
                            Shop all categories
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-auto">
                        {products.map((product) => (
                            <Item padding key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
