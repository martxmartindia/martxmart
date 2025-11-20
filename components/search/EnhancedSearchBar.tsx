"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, X, Filter, Mic, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  showFilters?: boolean;
  onFilterClick?: () => void;
}

export default function EnhancedSearchBar({ 
  className, 
  placeholder = "Search for machinery, parts, tools...",
  showFilters = false,
  onFilterClick 
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Fetch suggestions
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (query.trim()) {
      timeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}&limit=8`);
          if (response.ok) {
            const data = await response.json();
            setSuggestions(data.suggestions || []);
          }
        } catch (error) {
          console.error("Search suggestions error:", error);
        }
      }, 150);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setShowSuggestions(false);
    
    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    
    try {
      await router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <div className={cn("relative w-full", className)} ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Input
            type="search"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="w-full h-12 pl-4 pr-32 rounded-full border-2 border-gray-200 focus:border-orange-500 focus:ring-0 text-base"
            disabled={isLoading}
          />
          
          {/* Action Buttons */}
          <div className="absolute right-1 flex items-center gap-1">
            {/* Voice Search */}
            {/* <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-10 w-10 rounded-full hover:bg-gray-100"
              title="Voice Search"
            >
              <Mic className="h-4 w-4" />
            </Button> */}
            
            {/* Visual Search */}
            {/* <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-10 w-10 rounded-full hover:bg-gray-100"
              title="Visual Search"
            >
              <Camera className="h-4 w-4" />
            </Button> */}
            
            {/* Filter Button */}
            {showFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onFilterClick}
                className="h-10 w-10 rounded-full hover:bg-gray-100"
                title="Filters"
              >
                <Filter className="h-4 w-4" />
              </Button>
            )}
            
            {/* Search Button */}
            <Button
              type="submit"
              className="h-10 px-6 rounded-full bg-orange-600 hover:bg-orange-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (query.trim() || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border z-50 overflow-hidden"
          >
            <ScrollArea className="max-h-96">
              {/* Current Query Suggestions */}
              {suggestions.length > 0 && (
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 px-3 py-2">
                    Suggestions
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 rounded-lg transition-colors"
                      onClick={() => {
                        setQuery(suggestion);
                        handleSearch(suggestion);
                      }}
                    >
                      <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm truncate">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Recent Searches */}
              {recentSearches.length > 0 && !query.trim() && (
                <div className="p-2 border-t">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-xs font-medium text-gray-500">
                      Recent Searches
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-400 hover:text-gray-600 h-auto p-1"
                    >
                      Clear all
                    </Button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 rounded-lg transition-colors group"
                      onClick={() => {
                        setQuery(search);
                        handleSearch(search);
                      }}
                    >
                      <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm truncate flex-1">{search}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 hover:bg-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = recentSearches.filter(s => s !== search);
                          setRecentSearches(updated);
                          localStorage.setItem("recentSearches", JSON.stringify(updated));
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Popular Categories */}
              {!query.trim() && (
                <div className="p-2 border-t">
                  <div className="text-xs font-medium text-gray-500 px-3 py-2">
                    Popular Categories
                  </div>
                  <div className="flex flex-wrap gap-2 px-3 pb-2">
                    {["CNC Machines", "Packaging Equipment", "Food Processing", "Textile Machinery"].map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="cursor-pointer hover:bg-orange-100 hover:text-orange-700"
                        onClick={() => {
                          setQuery(category);
                          handleSearch(category);
                        }}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}