import payments from "@/assets/payments.webp"
import Image from "next/image"
import MDFooter from "./md"
import SMFooter from "./sm"

export default function Footer() {
    return (
        <footer className="bg-black text-white py-12">
            <SMFooter />
            <MDFooter />

            <div className="container mt-12 mb-4">
                <hr className="border-slate-700" />
            </div>

            <div className="container flex gap-4 flex-col md:flex-row items-center md:justify-between">
                <p className="text-center text-sm md:text-base">
                    &copy; 2024 Minimog Theme. All rights reserved.
                </p>

                <Image src={payments} alt="Payments" width={291} height={22} />
            </div>
        </footer>
    )
}
