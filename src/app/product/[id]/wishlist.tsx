"use client"

import { wishlistProduct } from "@/actions/auth"
import { useAuth } from "@/components/contexts/auth"
import { Button } from "@/components/ui/button"
import { Star, StarOff } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function Wishlist({ productId }: { productId: string }) {
    const user = useAuth()
    const [loading, setLoading] = useState(false)

    const wishlist = async () => {
        if (loading) return
        setLoading(true)
        const response = await wishlistProduct(productId)
        if (typeof response === "boolean") {
            toast.success(
                response ? "Added to wishlist" : "Removed from wishlist"
            )
        } else {
            toast.error(response)
        }
        setLoading(false)
    }

    return (
        <Button
            onClick={wishlist}
            disabled={loading || !user}
            variant="outline"
            className="rounded-full"
            size="icon"
        >
            {user && user.wishlist.includes(productId) ? (
                <StarOff className="size-5" />
            ) : (
                <Star className="size-5" />
            )}
        </Button>
    )
}
