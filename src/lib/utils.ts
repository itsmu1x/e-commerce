import type { Product } from "@prisma/client"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getHexesFromProducts(products: Product[]) {
    return products.reduce((hexes: string[], product: Product): string[] => {
        for (const hex of product.hexes) {
            if (hexes.includes(hex)) continue
            hexes.push(hex)
        }

        return hexes
    }, [])
}

export function getSizesFromProducts(products: Product[]) {
    return products.reduce((sizes: string[], product: Product): string[] => {
        for (const size of product.sizes) {
            if (sizes.includes(size)) continue
            sizes.push(size)
        }

        return sizes
    }, [])
}
