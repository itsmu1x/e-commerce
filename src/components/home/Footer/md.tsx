import NewsLetter from "./newsletter"
import Items from "./items"
import data from "./data"

export default function MDFooter() {
    return (
        <div className="hidden md:grid container gap-6 grid-cols-3 lg:grid-cols-4">
            {data.map(([title, items]) => (
                <Items key={title} title={title} items={items} />
            ))}

            <NewsLetter title />
        </div>
    )
}
