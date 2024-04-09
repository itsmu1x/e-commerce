import type { Metadata, Viewport } from "next"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/components/contexts/auth"
import { CartProvider } from "@/components/contexts/cart"
import { getUser } from "@/lib/auth"
import { Toaster } from "sonner"
import { fetchCart } from "@/actions/cart"
import Features from "@/components/home/Features"
import Footer from "@/components/home/Footer"
import Navbar from "@/components/home/Navbar"
import "./styles.css"

export const viewport: Viewport = {
    themeColor: "#2196f3",
}

export const metadata: Metadata = {
    title: {
        default: "MegaStore",
        template: "MegaStore | %s",
    },
    description:
        "Your fashion fix. Find top trends & timeless classics. Shop now for effortless style.",
    openGraph: {
        type: "website",
        url: `${process.env.ORIGIN}/`,
        title: "MegaStore",
        description:
            "Your fashion fix. Find top trends & timeless classics. Shop now for effortless style.",
    }, // could make this better with an image and make the same thing for twitter.
    icons: {
        icon: "/favicon.png",
    },
    authors: {
        name: "itsMU1X",
        url: "https://github.com/itsMU1X",
    },
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const cart = await fetchCart()
    const user = await getUser()

    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <CartProvider initialCart={cart}>
                    <AuthProvider initialUser={user}>
                        <TooltipProvider delayDuration={350}>
                            <Navbar />

                            {children}

                            <div className="container divide-bottom">
                                <Features />
                            </div>

                            <Footer />
                        </TooltipProvider>
                    </AuthProvider>
                </CartProvider>

                <Toaster
                    containerAriaLabel="Toaster"
                    duration={3250}
                    closeButton
                    position="bottom-right"
                    theme="light"
                    richColors
                />
            </body>
        </html>
    )
}
