"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowUpDown, Loader2, Plus, Search } from "lucide-react";
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
  inventory: {
    id: string;
    quantity: number;
  } | null;
}

type SortField = keyof Product | "inventory";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch products with authentication
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/franchise-portal/products", {
        headers: {
          Authorization: `Bearer ${document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1]}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please log in again.");
        }
        throw new Error("Failed to fetch products");
      }

      const data: Product[] = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to load products. Please try again later.");
      toast.error(err.message || "Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

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
              product.sku.toLowerCase().includes(normalizedQuery) ||
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
        let valueA: any, valueB: any;

        if (field === "inventory") {
          valueA = a.inventory?.quantity ?? 0;
          valueB = b.inventory?.quantity ?? 0;
        } else {
          valueA = a[field];
          valueB = b[field];
        }

        if (typeof valueA === "string") {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
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

  const getStockStatus = (quantity: number | undefined) => {
    if (quantity === undefined) return { label: "Not Tracked", variant: "outline" as const };
    if (quantity <= 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (quantity <= 10) return { label: "Low Stock", variant: "warning" as const };
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
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <Button asChild>
          <Link href="/franchise-portal/inventory/adjustments/new">
            <Plus className="mr-2 h-4 w-4" />
            New Adjustment
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>Manage your product stock levels and inventory</CardDescription>
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
                        onClick={() => handleSort("inventory")}
                        aria-label="Sort by stock"
                      >
                        Stock
                        {sortField === "inventory" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                          />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.inventory?.quantity);

                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                          <div className="text-sm text-muted-foreground">{product.category}</div>
                        </TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell className="text-right">₹{product.price.toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          {product.inventory?.quantity ?? "N/A"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={stockStatus.variant as "destructive" | "outline" | "default" | "secondary"}>{stockStatus.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/franchise-portal/inventory/products/${product.id}`}>
                                View Details
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/franchise-portal/inventory/adjustments/new?productId=${product.id}`}>
                                Adjust Stock
                              </Link>
                            </Button>
                          </div>
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