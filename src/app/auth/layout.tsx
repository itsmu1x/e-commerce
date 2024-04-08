import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const user = await getUser()
    if (user) redirect("/")

    return children
}
