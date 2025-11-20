"use client"

import Link from "next/link"
import { Grid3X3, List } from "lucide-react"

interface ProductViewControlsProps {
  sort: string
  view: string
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function ProductViewControls({ sort, view, searchParams }: ProductViewControlsProps) {
  const handleSortChange = (value: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set("sort", value)
    window.location.href = url.toString()
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <span className="text-sm mr-2">Sort by:</span>
        <select
          className="text-sm border rounded-md px-2 py-1"
          defaultValue={sort}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="newest">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Avg. Customer Review</option>
        </select>
      </div>

      <div className="h-6 w-px bg-gray-200" />

      <div className="flex items-center gap-1">
        <Link
          href={{ pathname: "/products", query: { ...searchParams, view: "grid" } }}
          className={`p-1 rounded-md ${view === "grid" ? "bg-gray-100" : ""}`}
        >
          <Grid3X3 className="h-4 w-4" />
        </Link>
        <Link
          href={{ pathname: "/products", query: { ...searchParams, view: "list" } }}
          className={`p-1 rounded-md ${view === "list" ? "bg-gray-100" : ""}`}
        >
          <List className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}