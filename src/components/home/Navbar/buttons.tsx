"use client"
import { ShoppingBag, Star, Trash2, User2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/contexts/auth"
import Link from "next/link"
import { useCart } from "@/components/contexts/cart"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import ntc from "ntcjs"
import { useState } from "react"
import { makeCheckout } from "@/actions/stripe"
import { toast } from "sonner"

type WishlistProps = {
    disabled?: boolean
    number?: number
}

function WishlistButton({ disabled, number }: WishlistProps) {
    return (
        <Button
            aria-label="Wishlist"
            className="relative"
            variant="ghost"
            size="icon"
            disabled={disabled}
        >
            <Star className="size-6" />
            <Badge
                className="px-1.5 absolute -top-0.5 -right-0.5"
                variant="destructive"
            >
                {number ?? 0}
            </Badge>
            <span className="sr-only">Wishlist</span>
        </Button>
    )
}

export default function NavButtons() {
    const user = useAuth()
    const cart = useCart()
    const [loading, setLoading] = useState(false)

    const checkout = async () => {
        if (loading) return
        setLoading(true)
        const result = await makeCheckout()
        if (result) toast.error(result)
        setLoading(false)
    }

    return (
        <div className="flex items-center gap-2">
            {user ? (
                <Link href="/profile/wishlist">
                    <WishlistButton number={user.wishlist.length} />
                </Link>
            ) : (
                <WishlistButton disabled />
            )}

            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        aria-label="Cart"
                        className="relative"
                        variant="ghost"
                        size="icon"
                    >
                        <ShoppingBag className="size-6" />
                        <Badge
                            className="px-1.5 absolute -top-0.5 -right-0.5"
                            variant="destructive"
                        >
                            {cart.itemsCount}
                        </Badge>
                        <span className="sr-only">Cart</span>
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Cart</SheetTitle>
                        <SheetClose />
                    </SheetHeader>

                    <div className="flex flex-col h-full overflow-y-auto gap-4">
                        <div className="absolute bottom-0 left-0 rounded p-4 w-full min-h-44 bg-body">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h1 className="text-lg font-semibold text-muted">
                                        Subtotal
                                    </h1>

                                    <p className="text-sm font-medium text-muted">
                                        ${(cart.totalCents / 100).toFixed(2)}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <h1 className="text-lg font-semibold text-muted">
                                        Shipping
                                    </h1>

                                    <p className="text-sm font-medium uppercase text-muted">
                                        free shipping
                                    </p>
                                </div>
                            </div>

                            <hr className="my-2" />

                            <div className="flex items-center justify-between">
                                <h1 className="text-lg font-semibold text-muted">
                                    Total
                                </h1>

                                <p className="text-sm font-medium text-muted">
                                    ${(cart.totalCents / 100).toFixed(2)}
                                </p>
                            </div>

                            <Button
                                disabled={loading}
                                onClick={checkout}
                                type="button"
                                className="uppercase mt-4 w-full"
                            >
                                checkout
                            </Button>
                        </div>

                        {cart.cart?.items.map((item) => (
                            <div key={item.id} className="flex gap-6 py-2.5">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={175}
                                    height={175}
                                    className="size-16 my-auto md:size-20"
                                />

                                <div className="flex my-auto flex-col space-y-1">
                                    <div>
                                        <Link
                                            href={`/product/${item.id}`}
                                            className="text-sm font-medium text-gray-900"
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="text-sm text-muted">
                                            {ntc.name(item.color)[1]} |{" "}
                                            {item.size}
                                        </p>
                                    </div>

                                    <p className="flex items-center gap-1 text-sm text-muted">
                                        ${(item.price / 100).toFixed(2)} x
                                        {item.quantity}
                                        <Trash2
                                            onClick={() =>
                                                cart.removeFromCart(item.id)
                                            }
                                            className="size-6 text-red-600 cursor-pointer"
                                        />
                                    </p>
                                </div>
                            </div>
                        ))}

                        {cart.itemsCount === 0 && (
                            <div>
                                <h1 className="text-lg">
                                    Oops! Your cart is empty.
                                </h1>

                                <Link
                                    href="/shop"
                                    className="text-sm text-muted"
                                >
                                    Add some items to your cart to get started.
                                </Link>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            <Link
                aria-label={user ? "Your Account" : "Login"}
                href={user ? "/profile" : "/auth/login"}
            >
                <Button
                    aria-label={user ? "Your Account" : "Login"}
                    variant="link"
                    size="icon"
                >
                    <User2 className="size-6" />
                    <span className="sr-only">
                        {user ? "Your Account" : "Login"}
                    </span>
                </Button>
            </Link>
        </div>
    )
}
