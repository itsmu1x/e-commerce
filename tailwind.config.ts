import type { Config } from "tailwindcss"

const config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                md: "731px",
                lg: "1165px",
            },
        },
        extend: {
            gridTemplateColumns: {
                auto: "repeat(auto-fill, minmax(min(12rem,100%), 1fr))",
            },
            minHeight: {
                70: "70dvh",
            },
            screens: {
                md: "768px",
                lg: "1280px",
            },
            colors: {
                body: "#f7f7f7",
                muted: "#666",
            },
            width: {
                220: "55rem",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
