"use client"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/contexts/auth"
import profile from "@/assets/profile.png"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

type NavProps = {
    children?: React.ReactNode
    list: {
        text: string
        href: string
        icon: React.ReactNode
        isAdmin?: boolean
    }[]
}

export default function NavList({ list, children }: NavProps) {
    const [opened, setOpened] = useState(false)
    const pathname = usePathname()
    const user = useAuth()

    return (
        <div className="container divide-top">
            <div className="flex divide-x bg-white shadow-md">
                <aside
                    className={cn(
                        "z-40 lg:z-0 bg-white h-full w-72 fixed top-0 lg:top-32 duration-300 left-0 lg:sticky",
                        opened && "translate-x-0",
                        !opened && "-translate-x-full lg:translate-x-0"
                    )}
                >
                    <div className="relative">
                        <div className="p-5 space-y-2">
                            <div className="relative flex justify-center">
                                <Image
                                    className="aspect-square rounded-full"
                                    src={profile}
                                    alt={user.name}
                                    width={108}
                                    height={108}
                                />

                                <Badge
                                    variant="secondary"
                                    className={cn(
                                        {
                                            "text-rose-700": user.isAdmin,
                                            "text-sky-600": !user.isAdmin,
                                        },
                                        "absolute bottom-0 left-1/2 -translate-x-1/2"
                                    )}
                                >
                                    {user.isAdmin ? "Admin" : "Member"}
                                </Badge>
                            </div>

                            <div>
                                <h1 className="text-xl text-center font-bold">
                                    {user.name}
                                </h1>

                                <p className="text-center text-muted text-sm">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <ul className="text-lg font-medium py-4">
                            {list
                                .filter((item) => !item.isAdmin || user.isAdmin)
                                .map(({ href, text, icon, isAdmin }) => (
                                    <li key={text}>
                                        <a
                                            className={cn(
                                                "p-2 px-6 flex items-center gap-2",
                                                {
                                                    "hover:bg-body text-muted hover:text-black duration-300":
                                                        href !== pathname,
                                                    "text-black bg-body":
                                                        href === pathname,
                                                    "text-red-600 hover:text-red-500":
                                                        isAdmin,
                                                }
                                            )}
                                            aria-label={text}
                                            href={href}
                                        >
                                            {icon}
                                            {text}
                                        </a>
                                    </li>
                                ))}
                        </ul>

                        <Button
                            onClick={() => setOpened((prev) => !prev)}
                            className="rounded-none duration-300 rounded-r-md absolute top-44 -end-10 lg:hidden"
                            size="icon"
                            aria-label="Menu"
                        >
                            <Menu className="size-6" />
                        </Button>
                    </div>
                </aside>
                <div className="p-5 flex-1 overflow-auto">{children}</div>
            </div>
        </div>
    )
}
