"use client"
import { removeProductFromCart } from "@/actions/cart"
import {
    type Dispatch,
    type SetStateAction,
    createContext,
    useContext,
    useState,
} from "react"
import { toast } from "sonner"

const CartContext = createContext<{
    cart: Cart
    setCart: Dispatch<SetStateAction<Cart>>
    itemsCount: number
    totalCents: number
    removeFromCart: (productId: string) => any
    hasProduct: (productId: string) => boolean
} | null>(null)

type ProviderProps = {
    children: React.ReactNode
    initialCart: Cart
}

export const useCart = () => useContext(CartContext)!
export function CartProvider({ children, initialCart }: ProviderProps) {
    const [cart, setCart] = useState(initialCart)

    const value = {
        cart,
        setCart,
        hasProduct(productId: string) {
            if (!this.cart) return false
            return this.cart.items.some((item) => item.id === productId)
        },
        get totalCents() {
            if (!cart) return 0
            return cart.items.reduce(
                (total, item) => total + item.quantity * item.price,
                0
            )
        },
        get itemsCount() {
            if (!cart) return 0
            return cart.items.reduce((count, item) => count + item.quantity, 0)
        },
        async removeFromCart(productId: string) {
            try {
                const result = await removeProductFromCart(productId)
                if (typeof result === "string") toast.error(result)
                else {
                    this.setCart(result)
                    toast.success("Product removed from cart")
                }
            } catch {
                toast.error("Failed to remove from the cart")
            }
        },
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
