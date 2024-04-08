import { BoxIcon, CreditCard, DollarSign, Headset } from "lucide-react"
import Feature from "./feature"

export default function Features() {
    return (
        <div className="grid grid-cols-4 justify-center gap-8 divide-top">
            <Feature
                title="Free Shipping"
                description="Free Shipping for orders over £130"
                icon={BoxIcon}
            />

            <Feature
                title="Money Guarantee"
                description="Within 30 days for an exchange"
                icon={DollarSign}
            />

            <Feature
                title="Online Support"
                description="24 hours a day, 7 days a week"
                icon={Headset}
            />

            <Feature
                title="Flexible Payment"
                description="Pay with Multiple Credit Cards"
                icon={CreditCard}
            />
        </div>
    )
}
