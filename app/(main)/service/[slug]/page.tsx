"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Search, ArrowRight, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import axios from "axios";
import ServiceCard from "@/components/ServiceCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  title: string;
  shortName: string;
  slug: string;
  description: string;
  priceAmount: number;
  category: string;
  imageUrl?: string;
  processingTime: string;
  governmentFee: string;
}

const businessSetupDropdown = {
  label: "Business Setup360°",
  dropdown: [
    { label: "Business Registration", href: "/service/business-registration" },
    { label: "Legal & IPR Services", href: "/service/legal-ipr" },
    { label: "Tax & Compliance", href: "/service/tax-compliance" },
    { label: "Licensing & Certification", href: "/service/licensing-certification" },
    { label: "Accounting & Financial Services", href: "/service/accounting-financial" },
    { label: "Closure & Conversion", href: "/service/closure-conversion" },
    { label: "Consulting & Support", href: "/service/consulting-support" },
  ],
};

const ServicesPage = () => {
  const { slug } = useParams();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "processingTime" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  // Map slugs to exact category names as stored in the database
  const slugToCategoryMap: { [key: string]: string } = {
    "business-registration": "Business Registration",
    "legal-ipr": "Legal & IPR Services",
    "tax-compliance": "Tax & Compliance",
    "licensing-certification": "Licensing & Certification",
    "accounting-financial": "Accounting & Financial Services",
    "closure-conversion": "Closure & Conversion",
    "consulting-support": "Consulting & Support",
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const category = slug ? slugToCategoryMap[slug.toString()] || "Business Registration" : "Business Registration";
      const res = await axios.get("/api/business", {
        params: { category },
      });
      const servicesData = res.data;
      setServices(servicesData);
      setFilteredServices(servicesData);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [slug]);

  const debouncedSearch = useCallback(
    debounce((value: string) => setSearchTerm(value), 300),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
    setPage(1);
  };

  const handleSort = (criteria: "price" | "processingTime") => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const toggleFavorite = (serviceId: string) => {
    const newFavorites = favorites.includes(serviceId)
      ? favorites.filter((id) => id !== serviceId)
      : [...favorites, serviceId];
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const processedServices = useMemo(() => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.title?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          service.description?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          service.category?.toLowerCase()?.includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        if (sortBy === "price") {
          return sortOrder === "asc" ? a.priceAmount - b.priceAmount : b.priceAmount - a.priceAmount;
        } else if (sortBy === "processingTime") {
          const timeA = parseInt(a.processingTime) || 0;
          const timeB = parseInt(b.processingTime) || 0;
          return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
        }
        return 0;
      });
    }

    return filtered;
  }, [services, searchTerm, sortBy, sortOrder]);

  const paginatedServices = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return processedServices.slice(start, start + itemsPerPage);
  }, [processedServices, page]);

  const resetFilters = () => {
    setSearchTerm("");
    setSortBy(null);
    setSortOrder("asc");
    setPage(1);
  };

  const totalPages = Math.ceil(processedServices.length / itemsPerPage);
  const pageNumbers = useMemo(() => {
    const maxPagesToShow = 5;
    const pages = [];
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [page, totalPages]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-[#112239] to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              {slug ? slugToCategoryMap[slug.toString()] || "Business Registration" : "Business Registration"} Services
            </h1>
            <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto">
              Professional assistance for all your {slug
                ? slugToCategoryMap[slug.toString()]?.toLowerCase() || "business registration"
                : "business registration"} needs.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 max-w-2xl mx-auto"
          >
            <div className="relative flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search services..."
                  className="pl-10 py-6 text-black rounded-xl w-full focus:ring-2 focus:ring-orange-500 bg-white shadow-sm"
                  onChange={handleSearch}
                  aria-label="Search services"
                />
              </div>
              <Button className="bg-orange-600 text-white hover:bg-orange-700 rounded-xl" asChild>
                <Link href="/custom-service">
                  Request Custom Service <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Filters Section */}
      <div className="sticky top-0 bg-white shadow-sm z-10 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl flex items-center gap-2">
                {businessSetupDropdown.label} <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl">
              {businessSetupDropdown.dropdown.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="w-full">
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleSort("price")}
              className={cn("rounded-xl", sortBy === "price" && "bg-orange-100 text-orange-600")}
            >
              Sort by Price {sortBy === "price" && (sortOrder === "asc" ? "↑" : "↓")}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSort("processingTime")}
              className={cn("rounded-xl", sortBy === "processingTime" && "bg-orange-100 text-orange-600")}
            >
              Sort by Time {sortBy === "processingTime" && (sortOrder === "asc" ? "↑" : "↓")}
            </Button>
            {(searchTerm || sortBy) && (
              <Button
                variant="ghost"
                onClick={resetFilters}
                className="text-orange-600 hover:text-orange-700 rounded-xl"
              >
                <X className="h-4 w-4 mr-2" /> Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-600 my-8"
          >
            <p>{error}</p>
            <Button variant="outline" onClick={fetchServices} className="mt-4 rounded-xl">
              Retry
            </Button>
          </motion.div>
        )}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-96 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            {paginatedServices.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-xl text-gray-600">
                  No services found for this category.
                </p>
                <Button variant="link" onClick={resetFilters}>
                  Clear filters
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    isFavorite={favorites.includes(service.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </>
        )}
        {processedServices.length > itemsPerPage && (
          <div className="mt-8 flex justify-center gap-2 items-center">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-xl"
            >
              Previous
            </Button>
            {pageNumbers.map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                onClick={() => setPage(pageNum)}
                className={cn(
                  "rounded-xl",
                  pageNum === page && "bg-orange-600 text-white hover:bg-orange-700"
                )}
              >
                {pageNum}
              </Button>
            ))}
            <Button
              variant="outline"
              disabled={page * itemsPerPage >= processedServices.length}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;