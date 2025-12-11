"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Edit, Plus, Search, Eye, MoreHorizontal, BarChart3, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DeleteProductButton from "./DeleteProduct.page";
import BulkActions from "./BulkActions";
import ProductFilters from "./ProductFilters";
import ExportProducts from "./ExportProducts";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCallback, useMemo } from "react";

export default function EnhancedProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [productsData, setProductsData] = useState<{ products: any[], totalPages: number } | null>(null);
  const [hsnCodes, setHsnCodes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    category: 'all',
    featured: 'all',
    stock: 'all',
    priceRange: 'all',
    brand: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isInitialized) {
      const pageParam = searchParams.get('page');
      const searchParam = searchParams.get('search') || '';
      const categoryParam = searchParams.get('category') || 'all';
      const featuredParam = searchParams.get('featured') || 'all';
      const stockParam = searchParams.get('stock') || 'all';
      const priceRangeParam = searchParams.get('priceRange') || 'all';
      const brandParam = searchParams.get('brand') || '';

      setPage(pageParam ? Number.parseInt(pageParam) || 1 : 1);
      setSearch(searchParam);
      setLocalSearch(searchParam);
      setFilters({
        category: categoryParam,
        featured: featuredParam,
        stock: stockParam,
        priceRange: priceRangeParam,
        brand: brandParam,
      });
      setIsInitialized(true);
    }
  }, [isInitialized, searchParams]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories?type=MACHINE');
        const data = await response.json();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchHsnCodes() {
      try {
        const response = await fetch('/api/kyc/verify/hsn');
        const data = await response.json();
        if (data.hsn) {
          setHsnCodes(data.hsn);
        }
      } catch (error) {
        console.error('Error fetching HSN codes:', error);
      }
    }
    fetchHsnCodes();
  }, []);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '10',
          ...(search && { search }),
          ...(filters.category !== 'all' && { category: filters.category }),
          ...(filters.featured !== 'all' && { featured: filters.featured }),
          ...(filters.stock !== 'all' && { stock: filters.stock }),
          ...(filters.priceRange !== 'all' && { priceRange: filters.priceRange }),
          ...(filters.brand && { brand: filters.brand }),
        });
        
        
        const response = await fetch(`/api/admin/products?${params}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProductsData(data);
      } catch (error) {
        toast.error('Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [page, search, filters]);

  const handleBulkAction = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(filters.category !== 'all' && { category: filters.category }),
        ...(filters.featured !== 'all' && { featured: filters.featured }),
        ...(filters.stock !== 'all' && { stock: filters.stock }),
        ...(filters.priceRange !== 'all' && { priceRange: filters.priceRange }),
        ...(filters.brand && { brand: filters.brand }),
      });
      
     
      const response = await fetch(`/api/admin/products?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProductsData(data);
    } catch (error) {
      toast.error('Failed to refresh products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setPage(1);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('page', '1');
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value as string);
      } else {
        params.delete(key);
      }
    });
    router.push(`/admin/products?${params.toString()}`);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  if (isLoading) {
    return <ProductsTableSkeleton />;
  }

  if (!productsData) {
    return <div>Error loading products</div>;
  }

  const { products, totalPages } = productsData;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/products/dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/products/import">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Link>
          </Button>
          <ExportProducts selectedProducts={selectedProducts} filters={filters} />
          <Link href="/admin/products/new">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Products</CardTitle>
          <CardDescription>View, edit, and delete products from your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2 flex-1">
                <Input 
                  placeholder="Search by name, description, brand, HSN, category..." 
                  value={localSearch} 
                  onChange={(e) => {
                    setLocalSearch(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSearch(localSearch);
                    }
                  }}
                  className="max-w-sm" 
                />
                <Button 
                  onClick={() => setSearch(localSearch)}
                  variant="secondary"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              
              <ProductFilters 
                onFiltersChange={handleFiltersChange}
                categories={categories}
                filters={filters}
              />
            </div>

            {/* Bulk Actions */}
            <BulkActions
              selectedProducts={selectedProducts}
              onSelectionChange={setSelectedProducts}
              onBulkAction={handleBulkAction}
              products={products}
            />

            <EnhancedProductsTable 
              products={products} 
              page={page} 
              totalPages={totalPages} 
              hsnCodes={hsnCodes}
              selectedProducts={selectedProducts}
              onProductSelect={toggleProductSelection}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EnhancedProductsTable({ 
  products, 
  page, 
  totalPages, 
  hsnCodes,
  selectedProducts,
  onProductSelect
}: { 
  products: any[], 
  page: number, 
  totalPages: number, 
  hsnCodes: any[],
  selectedProducts: string[],
  onProductSelect: (id: string) => void
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('page', newPage.toString());
    router.push(`/admin/products?${params.toString()}`);
  }

  function getHsnName(hsnCode: string) {
    const hsn = hsnCodes.find(h => h.hsnCode === hsnCode);
    return hsn ? hsn.hsnName : 'N/A';
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium w-12">
                <Checkbox
                  checked={selectedProducts.length === (products?.length || 0) && (products?.length || 0) > 0}
                  onCheckedChange={(checked) => {
                    if (checked && products) {
                      products.forEach(p => onProductSelect(p.id));
                    } else {
                      selectedProducts.forEach(id => onProductSelect(id));
                    }
                  }}
                />
              </th>
              <th className="py-3 px-4 text-left font-medium">Product</th>
              <th className="py-3 px-4 text-left font-medium">Category</th>
              <th className="py-3 px-4 text-left font-medium">HSN Code</th>
              <th className="py-3 px-4 text-left font-medium">Price</th>
              <th className="py-3 px-4 text-left font-medium">Stock</th>
              <th className="py-3 px-4 text-left font-medium">Status</th>
              <th className="py-3 px-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!products || products.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products?.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => onProductSelect(product.id)}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                          {product.description}
                        </div>
                        {product.featured && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{product.category.name}</td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <div className="font-medium">{product.hsnCode || 'N/A'}</div>
                      <div className="text-xs text-gray-500">
                        {product.hsnCode ? getHsnName(product.hsnCode) : ''}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <div className="font-medium">₹{product.price.toLocaleString()}</div>
                      {product.discount && (
                        <div className="text-xs text-green-600">
                          {product.discountType === 'PERCENTAGE' ? `${product.discount}% off` : `₹${product.discount} off`}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <div className="font-medium">{product.stock}</div>
                      {product.minimumOrderQuantity && (
                        <div className="text-xs text-gray-500">
                          Min: {product.minimumOrderQuantity}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {product.stock > 10 ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        In Stock
                      </Badge>
                    ) : product.stock > 0 ? (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Low Stock
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Out of Stock
                      </Badge>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/products/${product.id}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/products/${product.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}`}>
                              Edit Product
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/products/${product.id}`} target="_blank">
                              View Product
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/products/${product.id}`);
                              toast.success('Product URL copied to clipboard');
                            }}
                          >
                            Copy Link
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DeleteProductButton id={product.id} name={product.name} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePageChange(Math.max(1, page - 1))} 
              disabled={page === 1}
            >
              Previous
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))} 
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductsTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
            <Skeleton className="h-10 w-48" />
            <div className="rounded-md border">
              <div className="bg-gray-100 p-3">
                <div className="grid grid-cols-8 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-16" />
                  ))}
                </div>
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border-t p-3">
                  <div className="grid grid-cols-8 gap-4 items-center">
                    <Skeleton className="h-4 w-4" />
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-20" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <div className="flex gap-2 justify-end">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}