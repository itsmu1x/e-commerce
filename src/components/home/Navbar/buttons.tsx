"use client"
import { ShoppingBag, Star, User2 } from "lucide-react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function NavButtons() {
    const user = useAuth()
    const cart = useCart()

    return (
        <div className="flex items-center gap-2">
            <Button
                aria-label="Wishlist"
                className="relative"
                variant="ghost"
                size="icon"
                disabled={!user}
            >
                <Star className="size-6" />
                <Badge
                    className="px-1.5 absolute -top-0.5 -right-0.5"
                    variant="destructive"
                >
                    2
                </Badge>
                <span className="sr-only">Wishlist</span>
            </Button>

            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        aria-label="Cart"
                        className="relative"
                        variant="ghost"
                        size="icon"
                        disabled={!user}
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

                    <div className="space-y-2">
                        {cart.cart?.items.map((item) => (
                            <Card key={item.id}>
                                <CardContent className="mt-5">
                                    <div className="flex items-center space-x-2">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={175}
                                            height={175}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div className="flex flex-col space-y-1">
                                            <Link
                                                href={`/product/${item.id}`}
                                                className="text-sm font-medium text-gray-900"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="text-sm text-gray-500">
                                                description
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
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
