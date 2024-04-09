import { LogOut, User2, Blocks, Boxes, Compass } from "lucide-react"
import { notFound } from "next/navigation"
import { getUser } from "@/lib/auth"
import NavList from "@/components/admin/Nav"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Admin Panel",
}

const NAVS = [
    {
        text: "Statistics",
        href: "/admin",
        icon: <Compass className="size-6" />,
    },
    {
        text: "Products",
        href: "/admin/products",
        icon: <Blocks className="size-6" />,
    },
    {
        text: "Categories",
        href: "/admin/categories",
        icon: <Boxes className="size-6" />,
    },
    {
        text: "Profile",
        href: "/profile",
        icon: <User2 className="size-6" />,
    },
    {
        text: "Logout",
        href: "/auth/logout",
        icon: <LogOut className="size-6" />,
    },
]

export default async function Layout({
    children,
}: {
    children?: React.ReactNode
}) {
    const user = await getUser()
    if (!user || !user.isAdmin) notFound()

    return <NavList list={NAVS}>{children}</NavList>
}
