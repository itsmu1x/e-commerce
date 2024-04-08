import { removeCookie } from "@/lib/auth"
import { redirect } from "next/navigation"

export const GET = async () => {
    removeCookie()
    redirect("/")
}
