import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Dispatch, SetStateAction } from "react"

type SizesProps = {
    sizes: string[]
    state: [string | null, Dispatch<SetStateAction<string | null>>]
}
type SizeProps = {
    size: string
    active?: boolean
    select: () => any
}

export default function Sizes({ sizes, state }: SizesProps) {
    return (
        <div className="flex flex-wrap gap-1 p-0.5">
            {sizes.map((size) => (
                <Size
                    key={size}
                    select={() =>
                        state[1]((old) => (old === size ? null : size))
                    }
                    active={size === state[0]}
                    size={size}
                />
            ))}
        </div>
    )
}

export function Size({ size, active, select }: SizeProps) {
    return (
        <Button
            size="icon"
            variant="outline"
            onClick={select}
            className={cn({
                "border-black border-2": active,
            })}
        >
            {size}
        </Button>
    )
}
