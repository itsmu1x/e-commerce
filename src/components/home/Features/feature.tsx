import type { LucideIcon } from "lucide-react"

type FeatureProps = {
    icon: LucideIcon
    title: string
    description: string
}

export default function Feature({
    icon: Icon,
    title,
    description,
}: FeatureProps) {
    return (
        <div className="flex flex-col lg:flex-row gap-2 items-center">
            <Icon className="size-8" />

            <div>
                <h1 className="text-sm md:text-base text-center lg:text-start font-semibold">
                    {title}
                </h1>
                <p className="text-xs text-muted hidden lg:block">
                    {description}
                </p>
            </div>
        </div>
    )
}
