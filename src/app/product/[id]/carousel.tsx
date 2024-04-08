"use client"
import type { Prisma } from "@prisma/client"
import {
    type CarouselApi,
    CarouselContent,
    CarouselItem,
    Carousel as XCarousel,
} from "@/components/ui/carousel"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

type Props = {
    product: Prisma.ProductGetPayload<{}>
}

export default function Carousel({ product }: Props) {
    const [api, setApi] = useState<CarouselApi>()

    return (
        <div className="col-span-2 md:col-span-1 flex gap-4">
            <XCarousel
                className="relative group lg:w-10/12"
                setApi={setApi}
                opts={{ loop: true }}
            >
                <CarouselContent>
                    {product.images.map((image) => (
                        <CarouselItem key={image}>
                            <Image
                                src={image}
                                alt={product.name}
                                width={500}
                                height={500}
                                className="aspect-square"
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <Button
                    className="absolute top-1/2 -translate-y-1/2 transition-all scale-0 group-hover:scale-100 focus:scale-100 duration-300 left-0 group-hover:left-12 focus:left-12"
                    variant="outline"
                    size="icon"
                    aria-label="Left"
                    disabled={!api?.canScrollPrev()}
                    onClick={() => api?.scrollPrev()}
                >
                    <ArrowLeft className="size-6" />
                </Button>

                <Button
                    className="absolute top-1/2 -translate-y-1/2 transition-all scale-0 focus:scale-100 group-hover:scale-100 duration-300 right-0 group-hover:right-12 focus:right-12"
                    variant="outline"
                    size="icon"
                    aria-label="Right"
                    disabled={!api?.canScrollNext()}
                    onClick={() => api?.scrollNext()}
                >
                    <ArrowRight className="size-6" />
                </Button>
            </XCarousel>
        </div>
    )
}
