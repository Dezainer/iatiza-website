import { useCallback, useSyncExternalStore } from "react"

/** Same edge as Tailwind's `max-md:` variant. */
export const MOBILE = "(width < 48rem)"

/**
 * Live result of a media query. The server, and hydration, always see false,
 * so anything switched by this renders its desktop shape first and swaps
 * straight after — keep it to things CSS alone cannot do.
 */
export const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener("change", onChange)
      return () => list.removeEventListener("change", onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}
