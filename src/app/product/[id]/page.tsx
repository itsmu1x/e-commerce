import { Card } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Carousel from "./carousel"
import { Button } from "@/components/ui/button"
import { Package, Star, Truck } from "lucide-react"
import payments from "@/assets/payments.webp"
import Image from "next/image"
import Buy from "./buy"

export default async function Page({
    params: { id },
}: {
    params: { id: string }
}) {
    const product = await prisma.product.findFirst({
        where: {
            OR: [{ id }, { slug: id }],
        },
    })
    if (!product) notFound()

    return (
        <div className="container divide-top">
            <Card className="grid gap-4 p-6 grid-cols-2">
                <Carousel product={product} />

                <div className="col-span-2 md:col-span-1 space-y-6">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            {product.name}
                        </h1>

                        <div className="flex justify-between">
                            <p className="text-xl font-medium text-muted">
                                ${product.cents / 100}
                            </p>

                            <Button
                                variant="outline"
                                className="rounded-full"
                                size="icon"
                            >
                                <Star className="size-5" />
                            </Button>
                        </div>
                    </div>

                    <Buy product={product} />

                    <hr className="my-4" />

                    <div className="flex flex-col lg:flex-row justify-center gap-2.5 lg:gap-4">
                        <div>
                            <p className="text-sm flex gap-1 items-center font-medium text-muted">
                                <Truck className="size-6" /> Estimated Delivery
                            </p>

                            <p className="text-sm">
                                {new Date().toLocaleDateString()} -{" "}
                                {new Date(
                                    Date.now() + 1000 * 60 * 60 * 24 * 7
                                ).toLocaleDateString(undefined)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm flex gap-1 items-center font-medium text-muted">
                                <Package className="size-6" /> Free Shipping &
                                Returns
                            </p>

                            <p className="text-sm">
                                On all orders over $200.00
                            </p>
                        </div>
                    </div>

                    <div className="p-4 rounded flex flex-col items-center justify-center gap-1 bg-body">
                        <Image src={payments} alt="Payments" />
                        <p className="text-sm">
                            Guaranteed safe & secure checkout
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
