"use client"

import * as React from "react"
import { ProductListBlock } from "@/components"
import type { ProductListItem } from "@/components"

export default function ExampleProductsPage() {
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(5)
  const [items, setItems] = React.useState<ProductListItem[]>([])
  const [view, setView] = React.useState<"table" | "grid" | "list">("grid")
  const [isLoading, setIsLoading] = React.useState(false)

  // Fake API loader (replace later with your real API)
  const loadPage = React.useCallback(async (pageNumber: number) => {
    setIsLoading(true)
    setTotalPages(5)

    // simulate API delay
    await new Promise((r) => setTimeout(r, 600))

    const fakeData: ProductListItem[] = Array.from({ length: 20 }).map((_, i) => {
      const id = (pageNumber - 1) * 8 + i + 1
      return {
        id,
        name: `Apple MacBook Air M1 13" ${id}`,
        subtitle: "256 GB | 512 GB",
        imageUrl:
          "https://images.unsplash.com/photo-1585314614250-d213876625e1?q=80&w=2428&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        //   "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
        price: 2304,
        oldPrice: 2500,
        rating: 5,
        soldCount: 3500 + id,
        colors: [
          { id: "c1", hex: "#111827" },
          { id: "c2", hex: "#f97316" },
          { id: "c3", hex: "#facc15" },
        ],
      }
    })

    setItems(fakeData)
    setIsLoading(false)
  }, [])

  // Load first page on mount
  React.useEffect(() => {
    loadPage(page)
  }, [page, loadPage])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <div className="mx-auto">
      <ProductListBlock
        items={items}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        viewType={view}
        onViewTypeChange={setView}
        title="Apple Products"
        onItemClick={(item) => console.log("Clicked:", item)}
        // onItemAction={(item) => console.log("Action:", item)}
        itemActionLabel="Details"
      />

      {isLoading && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Loading...
        </div>
      )}
    </div>
  )
}
