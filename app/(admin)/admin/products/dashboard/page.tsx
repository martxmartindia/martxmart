"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, BarChart3 } from "lucide-react";
import ProductAnalytics from "../ProductAnalytics";

export default function ProductsDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products Dashboard</h1>
            <p className="text-gray-600">Analytics and insights for your product inventory</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/products">
              <BarChart3 className="h-4 w-4 mr-2" />
              Manage Products
            </Link>
          </Button>
          <Button asChild className="bg-orange-600 hover:bg-orange-700">
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      <ProductAnalytics />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common product management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
              <Link href="/admin/products/new">
                <Plus className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Add New Product</div>
                  <div className="text-xs text-muted-foreground">Create a new product listing</div>
                </div>
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
              <Link href="/admin/products?stock=low_stock">
                <BarChart3 className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Low Stock Items</div>
                  <div className="text-xs text-muted-foreground">Review products with low inventory</div>
                </div>
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
              <Link href="/admin/products?featured=false">
                <BarChart3 className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Feature Products</div>
                  <div className="text-xs text-muted-foreground">Promote products on homepage</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}