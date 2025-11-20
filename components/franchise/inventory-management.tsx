"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  ArrowUpDown,
  Download,
  Edit,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Upload,
} from "lucide-react";
import { Minus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  inventory: {
    id: string;
    quantity: number;
    lowStockThreshold: number;
  } | null;
  createdAt: string;
}

interface StockAdjustment {
  id: string;
  productId: string;
  product: {
    name: string;
    sku: string;
  };
  type: "INCREASE" | "DECREASE";
  quantity: number;
  reason: string;
  createdAt: string;
  createdBy: {
    name: string;
  };
}

export function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAdjustments, setIsLoadingAdjustments] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [openNewAdjustment, setOpenNewAdjustment] = useState(false);
  const [adjustmentFormData, setAdjustmentFormData] = useState({
    productId: "",
    type: "INCREASE",
    quantity: "",
    reason: "",
  });

  // Fetch products and adjustments on component mount
  useEffect(() => {
    fetchProducts();
    fetchAdjustments();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "/api/franchise-portal/products?includeInventory=true"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdjustments = async () => {
    setIsLoadingAdjustments(true);
    try {
      const response = await fetch(
        "/api/franchise-portal/inventory/adjustments"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch stock adjustments");
      }
      const data = await response.json();
      setAdjustments(data.adjustments);
    } catch (error) {
      console.error("Error fetching stock adjustments:", error);
      toast.error("Failed to load stock adjustments. Please try again.");
    } finally {
      setIsLoadingAdjustments(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAddAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !adjustmentFormData.productId ||
      !adjustmentFormData.quantity ||
      !adjustmentFormData.reason
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(
        "/api/franchise-portal/inventory/adjustments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(adjustmentFormData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create stock adjustment");
      }

      const data = await response.json();

      // Refresh products and adjustments
      fetchProducts();
      fetchAdjustments();

      // Reset form and close dialog
      setAdjustmentFormData({
        productId: "",
        type: "INCREASE",
        quantity: "",
        reason: "",
      });
      setOpenNewAdjustment(false);

      toast.success("The stock adjustment has been recorded successfully.");
    } catch (error) {
      console.error("Error adding stock adjustment:", error);
      toast.error("Failed to adjust stock. Please try again.");
    }
  };

  const getStockStatus = (product: Product) => {
    if (!product.inventory)
      return { label: "Not Tracked", variant: "outline" as const };

    const quantity = product.inventory.quantity;
    const threshold = product.inventory.lowStockThreshold;

    if (quantity <= 0)
      return { label: "Out of Stock", variant: "destructive" as const };
    if (quantity <= threshold)
      return { label: "Low Stock", variant: "warning" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let valueA, valueB;

      if (sortField === "inventory") {
        valueA = a.inventory?.quantity || 0;
        valueB = b.inventory?.quantity || 0;
      } else if (sortField === "price") {
        valueA = a.price;
        valueB = b.price;
      } else {
        valueA = (a as any)[sortField];
        valueB = (b as any)[sortField];
      }

      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

  const filteredAdjustments = adjustments.filter(
    (adjustment) =>
      adjustment.product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      adjustment.product.sku
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      adjustment.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Inventory Management</CardTitle>
          <CardDescription>
            Manage your product inventory and stock levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="products" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="adjustments">Stock Adjustments</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={
                      activeTab === "products"
                        ? "Search products..."
                        : "Search adjustments..."
                    }
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Dialog
                  open={openNewAdjustment}
                  onOpenChange={setOpenNewAdjustment}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Adjustment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Add Stock Adjustment</DialogTitle>
                      <DialogDescription>
                        Adjust the stock level of a product.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddAdjustment}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="product" className="text-right">
                            Product
                          </Label>
                          <Select
                            value={adjustmentFormData.productId}
                            onValueChange={(value) =>
                              setAdjustmentFormData({
                                ...adjustmentFormData,
                                productId: value,
                              })
                            }
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} ({product.sku})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="type" className="text-right">
                            Adjustment Type
                          </Label>
                          <Select
                            value={adjustmentFormData.type}
                            onValueChange={(value) =>
                              setAdjustmentFormData({
                                ...adjustmentFormData,
                                type: value as "INCREASE" | "DECREASE",
                              })
                            }
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="INCREASE">
                                Increase Stock
                              </SelectItem>
                              <SelectItem value="DECREASE">
                                Decrease Stock
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="quantity" className="text-right">
                            Quantity
                          </Label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            className="col-span-3"
                            value={adjustmentFormData.quantity}
                            onChange={(e) =>
                              setAdjustmentFormData({
                                ...adjustmentFormData,
                                quantity: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                          <Label htmlFor="reason" className="text-right pt-2">
                            Reason
                          </Label>
                          <Input
                            id="reason"
                            className="col-span-3"
                            placeholder="Reason for adjustment"
                            value={adjustmentFormData.reason}
                            onChange={(e) =>
                              setAdjustmentFormData({
                                ...adjustmentFormData,
                                reason: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save Adjustment</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TabsContent value="products" className="m-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">
                          <Button
                            variant="ghost"
                            className="p-0 font-medium"
                            onClick={() => handleSort("name")}
                          >
                            Product
                            {sortField === "name" && (
                              <ArrowUpDown
                                className={`ml-2 h-4 w-4 ${
                                  sortDirection === "desc" ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            className="p-0 font-medium"
                            onClick={() => handleSort("sku")}
                          >
                            SKU
                            {sortField === "sku" && (
                              <ArrowUpDown
                                className={`ml-2 h-4 w-4 ${
                                  sortDirection === "desc" ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            className="p-0 font-medium"
                            onClick={() => handleSort("price")}
                          >
                            Price
                            {sortField === "price" && (
                              <ArrowUpDown
                                className={`ml-2 h-4 w-4 ${
                                  sortDirection === "desc" ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead className="text-center">
                          <Button
                            variant="ghost"
                            className="p-0 font-medium"
                            onClick={() => handleSort("inventory")}
                          >
                            Stock
                            {sortField === "inventory" && (
                              <ArrowUpDown
                                className={`ml-2 h-4 w-4 ${
                                  sortDirection === "desc" ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No products found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProducts.map((product) => {
                          const stockStatus = getStockStatus(product);
                          return (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">
                                {product.name}
                                <div className="text-sm text-muted-foreground">
                                  {product.category}
                                </div>
                              </TableCell>
                              <TableCell>{product.sku}</TableCell>
                              <TableCell className="text-right">
                                ₹{product.price.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-center">
                                {product.inventory?.quantity !== undefined
                                  ? product.inventory.quantity
                                  : "N/A"}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant={
                                    stockStatus.variant as
                                      | "default"
                                      | "outline"
                                      | "destructive"
                                      | "secondary"
                                  }
                                >
                                  {stockStatus.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setAdjustmentFormData({
                                          ...adjustmentFormData,
                                          productId: product.id,
                                          type: "INCREASE",
                                        });
                                        setOpenNewAdjustment(true);
                                      }}
                                    >
                                      <Plus className="mr-2 h-4 w-4" /> Add
                                      Stock
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setAdjustmentFormData({
                                          ...adjustmentFormData,
                                          productId: product.id,
                                          type: "DECREASE",
                                        });
                                        setOpenNewAdjustment(true);
                                      }}
                                    >
                                      <Minus className="mr-2 h-4 w-4" /> Remove
                                      Stock
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <Edit className="mr-2 h-4 w-4" /> Edit
                                      Product
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="adjustments" className="m-0">
              {isLoadingAdjustments ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Adjustment ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAdjustments.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No adjustments found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAdjustments.map((adjustment) => (
                          <TableRow key={adjustment.id}>
                            <TableCell className="font-medium">
                              {adjustment.id}
                            </TableCell>
                            <TableCell>
                              <div>{adjustment.product.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {adjustment.product.sku}
                              </div>
                            </TableCell>
                            <TableCell>
                              {adjustment.type === "INCREASE" ? (
                                <Badge className="bg-green-500">
                                  <Plus className="mr-1 h-3 w-3" /> Increase
                                </Badge>
                              ) : (
                                <Badge className="bg-red-500">
                                  <Minus className="mr-1 h-3 w-3" /> Decrease
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{adjustment.quantity}</TableCell>
                            <TableCell>{adjustment.reason}</TableCell>
                            <TableCell>{adjustment.createdBy.name}</TableCell>
                            <TableCell>
                              {new Date(
                                adjustment.createdAt
                              ).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" /> Import
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
