type ListProps = {
    items: {
        text: string
        href?: string
    }[]
}

type ItemsProps = {
    title: string
    items: {
        text: string
        href?: string
    }[]
}

export function List({ items }: ListProps) {
    return (
        <ul className="mt-4 flex flex-col gap-2.5">
            {items.map((item) => (
                <li key={item.text}>
                    <a
                        href={item.href ?? "#"}
                        className="text-white/75 font-semibold"
                    >
                        {item.text}
                    </a>
                </li>
            ))}
        </ul>
    )
}

export default function Items({ title, items }: ItemsProps) {
    return (
        <div>
            <h1 className="text-lg font-bold uppercase">{title}</h1>

            <List items={items} />
        </div>
    )
}
