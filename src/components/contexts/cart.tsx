"use client"
import {
    type Dispatch,
    type SetStateAction,
    createContext,
    useContext,
    useState,
} from "react"

const CartContext = createContext<{
    cart: Cart
    setCart: Dispatch<SetStateAction<Cart>>
    itemsCount: number
    totalCents: number
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
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
