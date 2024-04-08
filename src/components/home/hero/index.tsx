import { Button } from "@/components/ui/button"
import Link from "next/link"

const asd = "asd"

export default function Hero() {
    return (
        <div className="bg-[#e4e7e3] px-4 py-12 md:py-40 bg-[url(/hero-background.webp)] bg-cover bg-no-repeat bg-center w-full">
            <div className="flex items-center justify-start md:justify-center">
                <div className="px-4 w-60 md:w-220">
                    <div className="space-y-1 md:space-y-2.5">
                        <h1 className="text-2xl md:text-5xl font-bold">
                            The Purl Knit Cardigan
                        </h1>

                        <p className="text-muted text-sm md:text-lg">
                            Here is your chance to upgrade your wardrobe with a
                            variation.
                        </p>
                    </div>

                    <div className="mt-5">
                        <Button
                            aria-label="Shop"
                            className="uppercase select-none text-sm font-semibold rounded-none bg-white text-black hover:scale-105 shadow-md hover:bg-white hover:text-black transition-transform"
                            variant="default"
                            size="lg"
                        >
                            <Link aria-label="Shop" href="/shop">
                                SHOP THE LOOK
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
