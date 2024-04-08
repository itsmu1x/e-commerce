import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
    return (
        <div className="min-h-70 grid place-items-center h-px">
            <div className="flex flex-col items-center">
                <h1 className="text-9xl text-center">404</h1>
                <p className="text-center text-2xl font-medium inline-flex gap-1 items-center">
                    Page not found!
                </p>

                <Link href="/" className="mt-4" aria-label="Go Home">
                    <Button>Home</Button>
                </Link>
            </div>
        </div>
    )
}
