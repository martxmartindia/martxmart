"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import EnhancedProductsPage from "./EnhancedProductsPage";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, Edit } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import DeleteProductButton from "./DeleteProduct.page";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function AdminProductsPage() {
  return <EnhancedProductsPage />;
}

function ProductsTable({ products, page, totalPages, hsnCodes }: { products: any[], page: number, totalPages: number, hsnCodes: any[] }) {
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
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
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
                          <div className="h-full w-full bg-gray-200" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{product.category.name}</td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <div className="font-medium">{product.hsnCode || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{product.hsnCode ? getHsnName(product.hsnCode) : ''}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">₹{product.price.toLocaleString()}</td>
                  <td className="py-3 px-4">{product.stock}</td>
                  <td className="py-3 px-4">
                    {product.stock > 0 ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        In Stock
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
                        <Link href={`/admin/products/${product.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
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
            <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, page - 1))} disabled={page === 1}>
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(p)}
              >
                {p}
              </Button>
            ))}

            <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
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
        <Skeleton className="h-10 w-40" />
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
            </div>
            <div className="rounded-md border">
              <div className="bg-gray-100 p-3">
                <div className="grid grid-cols-7 gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border-t p-3">
                  <div className="grid grid-cols-7 gap-4 items-center">
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
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <div className="flex gap-2 justify-end">
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
