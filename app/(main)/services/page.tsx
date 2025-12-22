"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import { Search, Filter, ArrowRight, CheckCircle, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "processingTime" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 9;

  // Fetch services
  const fetchServices = async (pageParam = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && selectedCategory !== 'all' && { category: selectedCategory }),
        ...(sortBy && { sortBy, sortOrder })
      });
      
      const res = await axios.get(`/api/services?${params}`);
      const { services: servicesData, categories: apiCategories, total } = res.data;
      
      setServices(servicesData);
      setFilteredServices(servicesData);
      setTotalCount(total);
      
      // Use categories from API response, fallback to extracting from services if not available
      if (apiCategories && apiCategories.length > 0) {
        setCategories(apiCategories);
      } else {
        const uniqueCategories = Array.from(
          new Set(servicesData.map((service: Service) => service.category))
        );
        setCategories(uniqueCategories as string[]);
      }
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
  }, []);

  // Refetch when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServices(1); // Reset to first page when filters change
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, sortBy, sortOrder]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => setSearchTerm(value), 300),
    []
  );

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
    setPage(1);
  };

  // Handle category filter
  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
    setPage(1);
  };

  // Handle sorting
  const handleSort = (criteria: "price" | "processingTime") => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortOrder("asc");
    }
    setPage(1);
  };

  // Toggle favorite
  const toggleFavorite = (serviceId: string) => {
    const newFavorites = favorites.includes(serviceId)
      ? favorites.filter((id) => id !== serviceId)
      : [...favorites, serviceId];
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  // Filter and sort services (now handled server-side)
  const processedServices = services;

  // Paginate services (client-side pagination for current page data)
  const paginatedServices = services;

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSortBy(null);
    setSortOrder("asc");
    setPage(1);
  };

  // Generate page numbers for pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);
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
              Business Registration & Compliance Services
            </h1>
            <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto">
              Professional assistance for all your business registration, tax filing, and compliance needs.
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
              <Button
                className="bg-orange-600 text-white hover:bg-orange-700 rounded-xl"
                asChild
              >
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
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="px-4 py-2 cursor-pointer text-sm bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => handleCategoryFilter(null)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleCategoryFilter(null)}
            >
              All Services
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="px-4 py-2 cursor-pointer text-sm bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => handleCategoryFilter(category)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleCategoryFilter(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleSort("price")}
              className={cn(
                "rounded-xl",
                sortBy === "price" && "bg-orange-100 text-orange-600"
              )}
            >
              Sort by Price {sortBy === "price" && (sortOrder === "asc" ? "↑" : "↓")}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSort("processingTime")}
              className={cn(
                "rounded-xl",
                sortBy === "processingTime" && "bg-orange-100 text-orange-600"
              )}
            >
              Sort by Time {sortBy === "processingTime" && (sortOrder === "asc" ? "↑" : "↓")}
            </Button>
            {(searchTerm || selectedCategory || sortBy) && (
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
            <Button variant="outline" onClick={() => fetchServices()} className="mt-4 rounded-xl">
              Retry
            </Button>
          </motion.div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden rounded-xl">
                <Skeleton className="h-48 w-full rounded-t-xl" />
                <CardHeader>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/4 mb-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
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
                  No services found matching your criteria.
                </p>
                <Button variant="link" onClick={resetFilters}>
                  Clear filters
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedServices.map((service) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 rounded-xl">
                      <div className="relative h-48 w-full">
                        <Image
                          src={service.imageUrl || `/placeholder.svg?height=200&width=400`}
                          alt={service.title}
                          fill
                          className="object-cover rounded-t-xl"
                          loading="lazy"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite(service.id)}
                            aria-label={
                              favorites.includes(service.id)
                                ? "Remove from favorites"
                                : "Add to favorites"
                            }
                            className="bg-white/90 hover:bg-white"
                          >
                            <Heart
                              className={cn(
                                "h-5 w-5",
                                favorites.includes(service.id)
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-500"
                              )}
                            />
                          </Button>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg sm:text-xl line-clamp-2">
                          {service.title}
                        </CardTitle>
                        <Badge variant="outline" className="w-fit text-orange-600 border-orange-600">
                          {service.shortName || service.title}
                        </Badge>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">
                          {service.description}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
<span>
  Processing: {service?.processingTime 
    ? service.processingTime.match(/\d+-\d+\s+(working days|months|days for initial setup)/i)?.[0] || service.processingTime.match(/\d+-\d+\s+months/i)?.[0] || "N/A"
    : "N/A (Data not available)"}
</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                            <span>Govt. Fee: {service.governmentFee}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center border-t pt-4">
                        <div className="font-bold text-lg text-orange-600">
                          ₹{service.priceAmount.toLocaleString()}
                        </div>
                        <Link href={`/services/${service.slug}`}>
                          <Button className="bg-orange-600 hover:bg-orange-700 rounded-xl">
                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {totalCount > itemsPerPage && (
          <div className="mt-8 flex justify-center gap-2 items-center">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => {
                setPage((p) => p - 1);
                fetchServices(page - 1);
              }}
              className="rounded-xl"
            >
              Previous
            </Button>
            {pageNumbers.map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
              onClick={() => {
                setPage(pageNum);
                fetchServices(pageNum);
              }}
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
              disabled={page >= totalPages}
              onClick={() => {
                setPage((p) => p + 1);
                fetchServices(page + 1);
              }}
              className="rounded-xl"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900"
          >
            Why Choose Our Services
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <CheckCircle className="h-8 w-8" />,
                title: "Expert Assistance",
                description:
                  "Our team of experts ensures accurate and timely processing of all applications.",
              },
              {
                icon: <Filter className="h-8 w-8" />,
                title: "End-to-End Support",
                description:
                  "From application to approval, we handle the entire process with minimal effort from your side.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                title: "Time-Saving",
                description:
                  "Save valuable time and focus on your business while we handle the paperwork.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                title: "Compliance Assurance",
                description:
                  "Stay compliant with all regulatory requirements and avoid penalties.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 bg-gray-50"
              >
                <div className="bg-orange-100 text-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900"
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              question: "What services do you offer for business registration?",
              answer:
                "We offer a comprehensive range of business registration services including GST Registration, MSME Registration, Company Registration, Import-Export Code, Shop & Establishment License, and more. Each service includes complete documentation, application filing, and follow-up until approval.",
            },
            {
              question: "How long does it take to complete the registration process?",
              answer:
                "The processing time varies depending on the service. GST Registration typically takes 7-15 days, MSME Registration 1-3 days, and Company Registration 15-20 days. The exact timeline for your specific case will be provided before starting the process.",
            },
            {
              question: "What documents are required for business registration?",
              answer:
                "Required documents vary by service but generally include identity proof, address proof, business registration documents, and service-specific documents. We provide a detailed checklist for each service and assist you in preparing the correct documentation.",
            },
            {
              question: "Do you provide ongoing compliance services after registration?",
              answer:
                "Yes, we offer ongoing compliance services for all registrations including return filing, renewal applications, and updates. Our goal is to ensure your business remains compliant with all regulatory requirements throughout its operation.",
            },
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">{faq.question}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;