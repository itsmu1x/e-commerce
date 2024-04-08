import type { Prisma } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

type Props = {
    product: Prisma.ProductGetPayload<{}>
    padding?: boolean
}

export default function Item({ product, padding }: Props) {
    return (
        <div className={cn("flex flex-col gap-2", { "p-2": padding })}>
            <div className="relative w-full aspect-square">
                <Image
                    className={cn("absolute w-full h-full left-0 top-0 z-10", {
                        "hover:opacity-0 duration-700":
                            product.images.length > 1,
                    })}
                    src={product.images[0]}
                    alt={product.name}
                    width={175}
                    height={175}
                />

                {product.images.length > 1 && (
                    <Image
                        className="absolute w-full h-full left-0 top-0"
                        src={product.images[1]}
                        alt={product.name}
                        width={175}
                        height={175}
                    />
                )}
            </div>

            <div>
                <Link
                    className="text-sm font-bold"
                    href={`/product/${product.slug ?? product.id}`}
                >
                    {product.name}
                </Link>

                <p className="text-muted font-semibold">
                    ${product.cents / 100}
                </p>
            </div>

            <Link
                aria-label="Select Product"
                href={`/product/${product.slug ?? product.id}`}
                className="mt-auto"
            >
                <Button className="w-full">Select Product</Button>
            </Link>
        </div>
    )
}
