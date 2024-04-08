import { Github, Instagram, Linkedin } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

type NewsProps = {
    title?: boolean
}

export default function NewsLetter({ title = false }: NewsProps) {
    return (
        <div>
            {title && (
                <h1 className="text-lg font-bold uppercase">NEWSLETTER</h1>
            )}

            <Input
                className="rounded-none text-black"
                placeholder="Your email"
                type="email"
            />

            <p className="text-white/75 text-sm mt-4">
                * By Signing up here i agree to receive MegaStore&#39;s email
                newsletter.
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
                <Link
                    aria-label="GitHub"
                    href="https://github.com/itsmu1x"
                    target="_blank"
                    className="w-fit duration-300 hover:scale-105 hover:rotate-3"
                >
                    <Github className="size-6" />
                </Link>

                <Link
                    aria-label="Instagram"
                    href="https://instagram.com/itsmu1x"
                    target="_blank"
                    className="w-fit duration-300 hover:scale-105 hover:rotate-3"
                >
                    <Instagram className="size-6" />
                </Link>

                <Link
                    aria-label="LinkedIN"
                    href="https://linkedin.com/in/itsmu1x"
                    target="_blank"
                    className="w-fit duration-300 hover:scale-105 hover:rotate-3"
                >
                    <Linkedin className="size-6" />
                </Link>
            </div>
        </div>
    )
}
