import { Heart, LogOut, ShoppingCart, User, UserCog } from "lucide-react"
import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import NavList from "@/components/admin/Nav"

const NAVS = [
    {
        text: "Personal Details",
        href: "/profile",
        icon: <User className="size-6" />,
    },
    {
        text: "Admin Panel",
        href: "/admin",
        icon: <UserCog className="size-6" />,
        isAdmin: true,
    },
    {
        text: "Orders",
        href: "/profile/orders",
        icon: <ShoppingCart className="size-6" />,
    },
    {
        text: "Wishlist",
        href: "/profile/wishlist",
        icon: <Heart className="size-6" />,
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
    if (!user) redirect("/")

    return <NavList list={NAVS}>{children}</NavList>
}
