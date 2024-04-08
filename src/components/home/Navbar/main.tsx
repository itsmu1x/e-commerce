import Image from "next/image"
import logo from "@/assets/logo.png"
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import NavButtons from "./buttons"

export default function MainNavbar() {
    return (
        <nav className="z-40 min-h-12 md:min-h-20 w-full shadow-md bg-body sticky top-0 left-0 border-b">
            <div className="container py-4 flex justify-between">
                <div className="inline-flex items-center gap-1">
                    <Tooltip>
                        <TooltipTrigger className="md:hidden" asChild>
                            <Button
                                aria-label="Menu"
                                variant="ghost"
                                size="icon"
                            >
                                <MenuIcon className="size-8 md:size-12" />
                                <span className="sr-only">Menu</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Menu</TooltipContent>
                    </Tooltip>

                    <div className="inline-flex items-center gap-2">
                        <Image
                            alt="MegaStore"
                            src={logo}
                            className="aspect-square w-8 md:w-12"
                            width={48}
                            height={48}
                        />

                        <h1 className="text-2xl font-bold hidden md:block">
                            MegaStore
                        </h1>
                    </div>
                </div>

                <NavButtons />
            </div>
        </nav>
    )
}