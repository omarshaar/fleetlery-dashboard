/**
 * @file useDebouncedSearch.ts
 * @description Custom hook to debounce search input for server-side search
 * Supports async callbacks and cleanup
 */
import { useEffect, useRef } from "react"

export function useDebouncedSearch(
  value: string,
  delay: number,
  callback?: (term: string) => void | Promise<void>,
) {
  const handler = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!callback) return
    if (handler.current) clearTimeout(handler.current)
    handler.current = setTimeout(() => {
      callback(value)
    }, delay)
    return () => {
      if (handler.current) clearTimeout(handler.current)
    }
  }, [value, delay, callback])
}
