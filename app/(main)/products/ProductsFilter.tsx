"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Star } from "lucide-react"

interface Category {
  id: string
  name: string
}

export default function ProductFilters({
  selectedCategory,
  minPrice,
  maxPrice,
  searchQuery,
}: {
  selectedCategory?: string
  minPrice?: number
  maxPrice?: number
  searchQuery?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [priceRange, setPriceRange] = useState({
    min: minPrice || "",
    max: maxPrice || "",
  })
  const [search, setSearch] = useState(searchQuery || "")

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories?type=MACHINE")
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (categoryId === selectedCategory) {
      params.delete("category")
    } else {
      params.set("category", categoryId)
    }

    // Reset to page 1 when changing filters
    params.set("page", "1")

    router.push(`/products?${params.toString()}`)
  }

  const handlePriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (priceRange.min) {
      params.set("minPrice", priceRange.min.toString())
    } else {
      params.delete("minPrice")
    }

    if (priceRange.max) {
      params.set("maxPrice", priceRange.max.toString())
    } else {
      params.delete("maxPrice")
    }

    // Reset to page 1 when changing filters
    params.set("page", "1")

    router.push(`/products?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }

    // Reset to page 1 when searching
    params.set("page", "1")

    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold mb-2">Department</h3>
        <ul className="space-y-1 text-sm">
          <li className="text-primary">All Products</li>
          {!loading &&
            categories.map((category) => (
              <li
                key={category.id}
                className={`cursor-pointer hover:text-primary ${category.id === selectedCategory ? "text-primary font-medium" : ""}`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </li>
            ))}
        </ul>
      </div>

      <Separator />

      <div>
        <h3 className="font-bold mb-2">Customer Reviews</h3>
        <ul className="space-y-1">
          {[5, 4, 3, 2, 1].map((rating) => (
            <li key={rating} className="flex items-center cursor-pointer hover:text-primary">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-1 text-sm">& Up</span>
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      <div>
        <h3 className="font-bold mb-2">Price</h3>
        <ul className="space-y-1 text-sm">
          <li className="cursor-pointer hover:text-primary">Under ₹1,000</li>
          <li className="cursor-pointer hover:text-primary">₹1,000 - ₹5,000</li>
          <li className="cursor-pointer hover:text-primary">₹5,000 - ₹10,000</li>
          <li className="cursor-pointer hover:text-primary">₹10,000 - ₹20,000</li>
          <li className="cursor-pointer hover:text-primary">Over ₹20,000</li>
        </ul>
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              className="h-8"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="Max"
              className="h-8"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            />
          </div>
          <Button onClick={handlePriceFilter} size="sm" className="w-full bg-[#F7CA00] hover:bg-[#F0B800] text-black">
            Go
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-bold mb-2">Deals & Discounts</h3>
        <ul className="space-y-1 text-sm">
          <li className="cursor-pointer hover:text-primary">Today&apos;s Deals</li>
          <li className="cursor-pointer hover:text-primary">Discounts 10% Off or More</li>
          <li className="cursor-pointer hover:text-primary">Discounts 25% Off or More</li>
          <li className="cursor-pointer hover:text-primary">Discounts 50% Off or More</li>
        </ul>
      </div>

      <Separator />

      <div>
        <h3 className="font-bold mb-2">Availability</h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="in-stock" />
          <Label htmlFor="in-stock" className="text-sm cursor-pointer">
            Include Out of Stock
          </Label>
        </div>
      </div>
    </div>
  )
}

