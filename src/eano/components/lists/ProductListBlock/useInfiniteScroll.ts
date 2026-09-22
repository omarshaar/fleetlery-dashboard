import { useEffect, useRef } from "react"

interface UseInfiniteScrollOptions {
  isLoading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  rootMargin?: string
}

/**
 * Simple IntersectionObserver wrapper for infinite scroll.
 * Returns a ref to attach to a "sentinel" div at the end of the list.
 */
export function useInfiniteScroll({
  isLoading,
  hasMore,
  onLoadMore,
  rootMargin = "300px",
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!onLoadMore) return
    if (!hasMore) return

    const node = sentinelRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isLoading) {
          onLoadMore()
        }
      },
      { root: null, rootMargin, threshold: 0.1 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [isLoading, hasMore, onLoadMore, rootMargin])

  return { sentinelRef }
}
