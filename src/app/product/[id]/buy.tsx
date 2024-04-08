"use client"

import Colors from "@/components/admin/colors"
import Sizes from "@/components/admin/sizes"
import type { Product } from "@prisma/client"
import { useRef, useState } from "react"
import ntc from "ntcjs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Minus, PackageMinus, PackagePlus, Plus } from "lucide-react"
import { addProductToCart, removeProductFromCart } from "@/actions/cart"
import { toast } from "sonner"
import { useCart } from "@/components/contexts/cart"

type Props = {
    product: Product
}

export default function Buy({ product }: Props) {
    const cart = useCart()
    const ref = useRef<HTMLInputElement>(null)
    const colorState = useState<string | null>(product.hexes[0])
    const sizeState = useState<string | null>(product.sizes[0])
    const [loading, setLoading] = useState(false)
    const name = colorState[0] ? ntc.name(colorState[0])[1] : null

    const removeFromCart = async () => {
        if (loading) return
        setLoading(true)
        await cart.removeFromCart(product.id)
        setLoading(false)
    }

    const addToCart = async () => {
        if (loading) return
        setLoading(true)
        const result = await addProductToCart({
            id: product.id,
            quantity: parseInt(ref.current?.value || "1"),
            size: sizeState[0],
            color: colorState[0],
        })

        if (typeof result === "string") toast.error(result)
        else {
            cart.setCart(result)
            colorState[1](product.hexes[0])
            sizeState[1](product.sizes[0])
            if (ref.current) {
                ref.current.value = "1"
            }
            toast.success("Product added to cart")
        }
        setLoading(false)
    }

    const edit = (amount: number) => {
        if (ref.current) {
            let newAmount = (ref.current.valueAsNumber % 100) + amount
            if (newAmount < parseInt(ref.current.min)) {
                newAmount = 1
            }

            ref.current.valueAsNumber = newAmount
        }
    }

    return (
        <>
            <div>
                <p>Color: {name ?? "??"}</p>
                <Colors colors={product.hexes} state={colorState} />
            </div>

            <div>
                <p>Size: {sizeState[0] ?? "??"}</p>
                <Sizes sizes={product.sizes} state={sizeState} />
            </div>

            <div>
                <p>Quantity</p>

                <div className="flex gap-2 mt-2 max-w-full">
                    <div className="relative flex">
                        <Input
                            type="number"
                            autoComplete="off"
                            min={1}
                            max={100}
                            ref={ref}
                            inputMode="numeric"
                            className="select-none clean-input text-center min-w-44"
                            defaultValue={1}
                        />

                        <Button
                            onClick={() => edit(1)}
                            className="absolute left-0"
                            variant="outline"
                            size="icon"
                        >
                            <Plus className="size-6" />
                        </Button>

                        <Button
                            onClick={() => edit(-1)}
                            className="absolute right-0"
                            variant="outline"
                            size="icon"
                        >
                            <Minus className="size-6" />
                        </Button>
                    </div>

                    {cart.hasProduct(product.id) ? (
                        <Button
                            onClick={removeFromCart}
                            disabled={loading}
                            variant="outline"
                            className="flex w-full gap-1 items-center"
                        >
                            {loading ? (
                                <Loader2 className="size-5 animate-spin" />
                            ) : (
                                <PackageMinus className="size-5" />
                            )}
                            {loading ? "Removing..." : "Remove from cart"}
                        </Button>
                    ) : (
                        <Button
                            onClick={addToCart}
                            disabled={loading}
                            variant="outline"
                            className="flex w-full gap-1 items-center"
                        >
                            {loading ? (
                                <Loader2 className="size-5 animate-spin" />
                            ) : (
                                <PackagePlus className="size-5" />
                            )}
                            {loading ? "Adding..." : "Add to cart"}
                        </Button>
                    )}
                </div>
            </div>
        </>
    )
}
