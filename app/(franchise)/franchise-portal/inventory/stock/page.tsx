"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowUpDown, Loader2, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { debounce } from "lodash";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  stock: number;
  status: string;
}

type SortField = "name" | "sku" | "price" | "stock";

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/franchise-portal/products?limit=100");

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please log in again.");
        }
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      const productList = data.products || [];
      setProducts(productList);
      setFilteredProducts(productList);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to load products. Please try again later.");
      toast.error(err.message || "Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        if (query.trim() === "") {
          setFilteredProducts(products);
        } else {
          const normalizedQuery = query.toLowerCase();
          const filtered = products.filter(
            (product) =>
              product.name.toLowerCase().includes(normalizedQuery) ||
              (product.sku?.toLowerCase().includes(normalizedQuery)) ||
              product.category.toLowerCase().includes(normalizedQuery),
          );
          setFilteredProducts(filtered);
        }
      }, 300),
    [products],
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  // Sort products
  const handleSort = (field: SortField) => {
    const isSameField = sortField === field;
    const newDirection = isSameField && sortDirection === "asc" ? "desc" : "asc";

    setSortField(field);
    setSortDirection(newDirection);

    setFilteredProducts((prev) => {
      const sorted = [...prev].sort((a, b) => {
        let valueA: any = a[field];
        let valueB: any = b[field];

        if (typeof valueA === "string") {
          valueA = valueA.toLowerCase();
          valueB = (valueB || "").toLowerCase();
        }

        if (valueA === valueB) return 0;
        if (newDirection === "asc") {
          return valueA > valueB ? 1 : -1;
        }
        return valueA < valueB ? 1 : -1;
      });
      return sorted;
    });
  };

  const getStockStatus = (stock: number | undefined) => {
    if (stock === undefined || stock === null) return { label: "Not Tracked", variant: "outline" as const };
    if (stock <= 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (stock <= 10) return { label: "Low Stock", variant: "warning" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <Button variant="link" onClick={fetchProducts} className="ml-2 p-0">
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Levels</h1>
          <p className="text-muted-foreground">View and manage product stock levels</p>
        </div>
        <Link href="/franchise-portal/inventory/adjustments">
          <Button className="bg-orange-600 hover:bg-orange-700">
            Manage Adjustments
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>View product stock levels for your franchise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
              />
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">
                      <Button
                        variant="ghost"
                        className="p-0 font-medium"
                        onClick={() => handleSort("name")}
                        aria-label="Sort by product name"
                      >
                        Product
                        {sortField === "name" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                          />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 font-medium"
                        onClick={() => handleSort("sku")}
                        aria-label="Sort by SKU"
                      >
                        SKU
                        {sortField === "sku" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                          />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button
                        variant="ghost"
                        className="p-0 font-medium"
                        onClick={() => handleSort("price")}
                        aria-label="Sort by price"
                      >
                        Price
                        {sortField === "price" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                          />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-center">
                      <Button
                        variant="ghost"
                        className="p-0 font-medium"
                        onClick={() => handleSort("stock")}
                        aria-label="Sort by stock"
                      >
                        Stock
                        {sortField === "stock" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                          />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock);

                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                          <div className="text-sm text-muted-foreground">{product.category}</div>
                        </TableCell>
                        <TableCell>{product.sku || "N/A"}</TableCell>
                        <TableCell className="text-right">₹{product.price.toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          {product.stock ?? "N/A"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={stockStatus.variant as "destructive" | "outline" | "default" | "secondary"}>{stockStatus.label}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No products found. Try adjusting your search.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}