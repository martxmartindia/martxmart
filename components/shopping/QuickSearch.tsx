"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface QuickSearchProps {
  initialSearch?: string
  onSearch?: (query: string) => void
}

export default function QuickSearch({ initialSearch = "", onSearch }: QuickSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([])
        return
      }
      
      setLoading(true)
      try {
        const response = await fetch(`/api/shopping/products?suggestions=true&q=${encodeURIComponent(searchQuery)}`)
        if (response.ok) {
          const data = await response.json()
          setSuggestions(data.suggestions || [])
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleSearch = (query: string) => {
    if (!query.trim()) return

    // Save to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))

    // Perform search
    if (onSearch) {
      onSearch(query)
    } else {
      router.push(`/shopping/products?search=${encodeURIComponent(query)}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    if (onSearch) {
      onSearch("")
    }
  }

  const removeRecentSearch = (searchToRemove: string) => {
    const updated = recentSearches.filter(s => s !== searchToRemove)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setShowSuggestions(true)
          }}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && searchQuery.length >= 2 && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 p-2 bg-white shadow-lg border">
          <div className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded text-sm"
                onClick={() => {
                  setSearchQuery(suggestion)
                  handleSearch(suggestion)
                  setShowSuggestions(false)
                }}
              >
                <Search className="inline h-3 w-3 mr-2 text-gray-400" />
                {suggestion}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Searches */}
      {recentSearches.length > 0 && !searchQuery && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Recent Searches</h4>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-gray-200 text-xs"
                onClick={() => {
                  setSearchQuery(search)
                  handleSearch(search)
                }}
              >
                {search}
                <X
                  className="h-3 w-3 ml-1 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeRecentSearch(search)
                  }}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Popular Searches */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Popular Searches</h4>
        <div className="flex flex-wrap gap-2">
          {["Electronics", "Fashion", "Home & Garden", "Sports", "Books"].map((term) => (
            <Badge
              key={term}
              variant="outline"
              className="cursor-pointer hover:bg-orange-50 hover:border-orange-200 text-xs"
              onClick={() => {
                setSearchQuery(term)
                handleSearch(term)
              }}
            >
              {term}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}