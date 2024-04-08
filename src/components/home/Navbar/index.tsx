import MainNavbar from "./main"
import Link from "next/link"

const NAV_ITEMS: {
    text: string
    href?: string
}[] = [
    {
        text: "HOME",
        href: "/",
    },
    {
        text: "SHOP",
        href: "/shop",
    },
]

export default function Navbar() {
    return (
        <>
            <MainNavbar />

            <nav className="z-40 h-12 bg-body md:shadow-md sticky top-[81px] left-0 hidden md:flex justify-center border-b">
                <ul className="flex items-center gap-16 font-bold">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.text}>
                            <Link className="navItem" href={item.href ?? "#"}>
                                {item.text}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    )
}
