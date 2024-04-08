import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import ntc from "ntcjs"
import type { Dispatch, SetStateAction } from "react"

type ColorsProps = {
    colors: string[]
    state: [string | null, Dispatch<SetStateAction<string | null>>] // why not? let's just use the whole state hehe
}

type ColorProps = {
    hex: string
    active?: boolean
    select: () => any
}

export default function Colors({ state, colors }: ColorsProps) {
    return (
        <div className="flex flex-wrap gap-1 p-0.5">
            {colors.map((hex) => (
                <Color
                    key={hex}
                    select={() => state[1]((old) => (old === hex ? null : hex))}
                    active={hex === state[0]}
                    hex={hex}
                />
            ))}
        </div>
    )
}

export function Color({ hex, active, select }: ColorProps) {
    const info = ntc.name(hex)

    return (
        <Tooltip>
            <TooltipTrigger>
                <div
                    className={cn(
                        "w-8 h-8 rounded-full bg-body duration-100 outline-1 hover:outline hover:border-4 hover:border-white",
                        {
                            "outline border-4 border-white": active,
                        }
                    )}
                    style={{ backgroundColor: hex }}
                    onClick={select}
                >
                    <span className="sr-only">{info[1]}</span>
                </div>
            </TooltipTrigger>
            <TooltipContent>{info[1]}</TooltipContent>
        </Tooltip>
    )
}
