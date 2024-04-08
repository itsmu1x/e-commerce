"use client"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRef } from "react"
import Link from "next/link"

export default function QuantityInput() {
    const ref = useRef<HTMLInputElement>(null)

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

            <Link aria-label="Add to cart" className="w-full" href="/">
                <Button variant="outline" className="w-full">
                    Add to cart
                </Button>
            </Link>
        </div>
    )
}
