import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import data from "./data"
import { List } from "./items"
import NewsLetter from "./newsletter"

export default function SMFooter() {
    return (
        <div className="container md:hidden">
            <Accordion type="single" collapsible className="*:border-none">
                {data.map(([title, items]) => (
                    <AccordionItem key={title} value={title}>
                        <AccordionTrigger>{title}</AccordionTrigger>
                        <AccordionContent>
                            <List items={items} />
                        </AccordionContent>
                    </AccordionItem>
                ))}

                <AccordionItem value="newsletter">
                    <AccordionTrigger className="uppercase">
                        newsletter
                    </AccordionTrigger>
                    <AccordionContent>
                        <NewsLetter />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
