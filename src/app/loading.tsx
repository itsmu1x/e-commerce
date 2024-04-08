import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <main className="grid min-h-dvh place-items-center">
            <Loader2 className="size-20 animate-spin" />
        </main>
    )
}
