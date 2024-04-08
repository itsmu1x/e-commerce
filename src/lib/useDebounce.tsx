import { useCallback, useRef } from "react"

export function useDebouncedCallback<T extends Function>(
    func: T,
    wait: number = 1000
) {
    const timeout = useRef<NodeJS.Timeout>()

    return useCallback(
        (...args: any) => {
            const later = () => {
                clearTimeout(timeout.current)
                func(...args)
            }

            clearTimeout(timeout.current)
            timeout.current = setTimeout(later, wait)
        },
        [func, wait]
    )
}
