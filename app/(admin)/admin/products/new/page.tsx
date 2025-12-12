// app/(admin)/admin/products/new/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowLeft, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/imageUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce
    .number()
    .int()
    .nonnegative("Stock must be a non-negative integer"),
  categoryId: z.string().min(1, "Please select a category"),
  brand: z.string().optional(),
  modelNumber: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.coerce.number().optional(),
  warranty: z.string().optional(),
  featured: z.boolean().default(false),
  images: z.array(z.string()).min(1, "At least one image is required"),
  videoUrl: z.string().optional(),
  productType: z.string().optional(),
  hsnCode: z.string().optional(),
  gstPercentage: z.coerce.number().optional(),
  capacity: z.string().optional(),
  powerConsumption: z.string().optional(),
  material: z.string().optional(),
  automation: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  discountPercentage: z.coerce.number().optional(),
  shippingCharges: z.coerce.number().optional(),
  minimumOrderQuantity: z.coerce.number().int().optional(),
  deliveryTime: z.string().optional(),
  warrantyDetails: z.string().optional(),
  returnPolicy: z.string().optional(),
  afterSalesService: z.string().optional(),
  industryType: z.array(z.string()).optional(),
  applications: z.array(z.string()).optional(),
  accessories: z.array(z.string()).optional(),
  installationRequired: z.boolean().default(false),
  documentationLinks: z.array(z.string()).optional(),
  manufacturer: z.string().optional(),
  madeIn: z.string().optional(),
  specifications: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface HsnCode {
  id: string;
  hsnCode: string;
  hsnName: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  id: string;
  name: string;
  slug?: string;
  type?: string;
  parentId?: string | null;
  subcategories?: Category[];
  parentName?: string; // For display purposes
}

const materialOptions = [
  { value: "stainless_steel", label: "Stainless Steel (SS)" },
  { value: "plastic_composites", label: "Plastic & Composites" },
  { value: "aluminum", label: "Aluminum" },
  { value: "wood", label: "Wood" },
  { value: "glass", label: "Glass" },
  { value: "Mild_Steel", label: "Mild Steel (MS)" },
  { value: "Tool_Steel", label: "Tool Steel" },
  { value: "Titanium", label: "Titanium" },
  { value: "Copper_Alloys", label: "Copper Alloys" },
  { value: "Platinum", label: "Platinum" },
  { value: "Cast_Iron", label: "Cast Iron" },
  { value: "Crome_Nickel_Allowys", label: "Chrome Nickel Allowys" },
  { value: "Ceramics", label: "Ceramics" },
  { value: "Brass", label: "Brass" },
  { value: "Copper", label: "Copper" },
  { value: "High_Speed_Steel", label: "High Speed Steel (HSS)" },
  { value: "Chrome_Venedium_Steel", label: "Chrome Venedium Steel (CVSS)" },
  { value: "Plastic_Polymers", label: "Plastic Polymers" },
  { value: "Rubber", label: "Rubber" },
  { value: "others", label: "others" },
];

const automationOptions = [
  { value: "fully_automatic", label: "Fully Automatic" },
  { value: "semi_automatic", label: "Semi-Automatic" },
  { value: "manual", label: "Manual" },
  { value: "smart_automation", label: "Smart Automation" },
  { value: "remote_controlled_automation", label: "Remote-Controlled Automation" },
  { value: "hybrid_automation", label: "Hybrid Automation" },
  { value: "programmable_automation", label: "Programmable Automation" },
  { value: "adaptive_automation", label: "Adaptive Automation" },
  { value: "batch_automation", label: "Batch Automation" },
  { value: "fixed_automation", label: "Fixed Automation" },
  { value: "others", label: "others" },
];

const madeInOptions = [
  { value: "india", label: "India" },
  { value: "china", label: "China" },
  { value: "usa", label: "USA" },
  { value: "germany", label: "Germany" },
  { value: "japan", label: "Japan" },
  { value: "korea", label: "Korea" },
  { value: "others", label: "Others" },
];

const productTypeOptions = [
  { value: "Electrical and Electronic Machinery", label: "Electrical and Electronic Machinery" },
  { value: "Mechanical Machinery", label: "Mechanical Machinery" },
  { value: "Industrial Equipment", label: "Industrial Equipment" },
  { value: "Precision Tools and Instruments", label: "Precision Tools and Instruments" },
  { value: "Agricultural and Food Processing Machinery", label: "Agricultural and Food Processing Machinery" },
  { value: "Construction and Mining Equipment", label: "Construction and Mining Equipment" },
  { value: "Textile and Garment Machinery", label: "Textile and Garment Machinery" },
  { value: "Automotive and Transportation Equipment", label: "Automotive and Transportation Equipment" },
  { value: "Medical and Laboratory Equipment", label: "Medical and Laboratory Equipment" },
  { value: "Hand Tools and Power Tools", label: "Hand Tools and Power Tools" },
  { value: "Packaging Machinery", label: "Packaging Machinery" },
  { value: "Printing and Publishing Equipment", label: "Printing and Publishing Equipment" },
  { value: "Chemical and Pharmaceutical Machinery", label: "Chemical and Pharmaceutical Machinery" },
  { value: "Renewable Energy Equipment", label: "Renewable Energy Equipment" },
  { value: "Robotics and Automation Systems", label: "Robotics and Automation Systems" },
  { value: "HVAC and Refrigeration Equipment", label: "HVAC and Refrigeration Equipment" },
  { value: "Marine and Shipbuilding Equipment", label: "Marine and Shipbuilding Equipment" },
  { value: "Aerospace and Defense Equipment", label: "Aerospace and Defense Equipment" },
  { value: "Woodworking and Furniture Machinery", label: "Woodworking and Furniture Machinery" },
  { value: "Plastic and Rubber Processing Machinery", label: "Plastic and Rubber Processing Machinery" },
];

// Helper function to flatten hierarchical categories
const flattenCategories = (hierarchicalCategories: any[]): Category[] => {
  const flattened: Category[] = [];
  
  hierarchicalCategories.forEach(category => {
    // Add main category
    flattened.push({
      id: category.id,
      name: category.name,
      slug: category.slug,
      type: category.type,
      parentId: category.parentId || null,
      subcategories: category.subcategories || [],
      parentName: undefined // Main category has no parent
    });
    
    // Add subcategories with parent name for display
    if (category.subcategories && category.subcategories.length > 0) {
      category.subcategories.forEach((subcategory: any) => {
        flattened.push({
          id: subcategory.id,
          name: subcategory.name,
          slug: subcategory.slug,
          type: subcategory.type,
          parentId: subcategory.parentId,
          subcategories: subcategory.subcategories || [],
          parentName: category.name // Display parent category name
        });
      });
    }
  });
  
  return flattened;
};

// Helper function to get category display name
const getCategoryDisplayName = (category: Category): string => {
  if (category.parentName) {
    return `${category.parentName} > ${category.name}`;
  }
  return category.name;
};

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingHsn, setIsFetchingHsn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [hierarchicalCategories, setHierarchicalCategories] = useState<any[]>([]);
  const [hsnCodes, setHsnCodes] = useState<HsnCode[]>([]);
  const [hsnSearch, setHsnSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: "",
      brand: "",
      modelNumber: "",
      dimensions: "",
      weight: undefined,
      warranty: "",
      featured: false,
      images: [],
      videoUrl: "",
      productType: "",
      hsnCode: "",
      gstPercentage: undefined,
      capacity: "",
      powerConsumption: "",
      material: "",
      automation: "",
      certifications: [],
      discountPercentage: undefined,
      shippingCharges: undefined,
      minimumOrderQuantity: undefined,
      deliveryTime: "",
      warrantyDetails: "",
      returnPolicy: "",
      afterSalesService: "",
      industryType: [],
      applications: [],
      accessories: [],
      installationRequired: false,
      documentationLinks: [],
      manufacturer: "",
      madeIn: "",
      specifications: "",
    },
  });

  // Debounced HSN code search
  const fetchHsnCodes = useCallback(
    debounce(async (search: string) => {
      try {
        setIsFetchingHsn(true);
        setError(null);
        const response = await fetch(
          `/api/kyc/verify/hsn?search=${encodeURIComponent(search)}&limit=50`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );
        const data = await response.json();
        if (response.ok && Array.isArray(data.hsnCodes)) {
          setHsnCodes(data.hsnCodes);
        } else {
          const message = data.message || "Failed to fetch HSN codes";
          setError(message);
          toast.error(message);
          setHsnCodes([]);
        }
      } catch (error) {
        console.error("Error fetching HSN codes:", error);
        const message = "Failed to fetch HSN codes";
        setError(message);
        toast.error(message);
        setHsnCodes([]);
      } finally {
        setIsFetchingHsn(false);
      }
    }, 300),
    [],
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories?type=MACHINE&flatList=true", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          setHierarchicalCategories(data);
          // Flatten all categories (main + subcategories) for the dropdown
          const flattenedCategories = flattenCategories(data);
          setCategories(flattenedCategories);
        } else {
          const message = data.error || "Failed to fetch categories";
          setError(message);
          toast.error(message);
          setCategories([]);
          setHierarchicalCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        const message = "Failed to fetch categories";
        setError(message);
        toast.error(message);
        setCategories([]);
      }
    };

    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Initial HSN fetch with empty search
        await Promise.all([fetchHsnCodes(""), fetchCategories()]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load required data");
        toast.error("Failed to load required data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchHsnCodes]);

  useEffect(() => {
    if (open) {
      fetchHsnCodes(hsnSearch);
    }
  }, [hsnSearch, open, fetchHsnCodes]);

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("Product created successfully");
        router.push("/admin/products");
      } else {
        const message = result.error || "Failed to create product";
        setError(message);
        toast.error(message);
      }
    } catch (error: any) {
      console.error("Error creating product:", error);
      const message = error.message || "Failed to create product";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600 mr-2" />
        <span className="text-lg text-gray-700">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="details">Product Details</TabsTrigger>
              <TabsTrigger value="pricing">Pricing & Inventory</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the basic details of the product</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter product name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                          <FormDescription>
                            Select from main categories or subcategories. Subcategories show the parent category path.
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter brand name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="modelNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter model number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter product description"
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>Enter additional details about the product</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="dimensions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dimensions</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 10 x 20 x 30 cm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="material"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Material</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select material" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {materialOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="manufacturer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manufacturer</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter manufacturer name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="madeIn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Made In</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country of origin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {madeInOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hsnCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HSN Code</FormLabel>
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                  disabled={isFetchingHsn}
                                >
                                  {field.value
                                    ? hsnCodes.find((code) => code.hsnCode === field.value)?.hsnName || field.value
                                    : "Select HSN code"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search HSN code or name..."
                                  value={hsnSearch}
                                  onValueChange={setHsnSearch}
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    {isFetchingHsn ? "Loading HSN codes..." : "No HSN codes found."}
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {hsnCodes.map((code) => (
                                      <CommandItem
                                        key={code.id}
                                        value={`${code.hsnCode} ${code.hsnName}`}
                                        onSelect={() => {
                                          form.setValue("hsnCode", code.hsnCode);
                                          setOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            code.hsnCode === field.value ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        {code.hsnCode} - {code.hsnName}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="warranty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Warranty</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 1 Year Manufacturer Warranty" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="warrantyDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Warranty Details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter warranty details and terms"
                              className="min-h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="returnPolicy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Return Policy</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter return policy details"
                              className="min-h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="afterSalesService"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>After Sales Service</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter after sales service details"
                              className="min-h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Inventory</CardTitle>
                  <CardDescription>Set pricing and inventory details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (₹)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              value={field.value}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discountPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Percentage</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              placeholder="0"
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              placeholder="0"
                              value={field.value}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="minimumOrderQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Order Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              step="1"
                              placeholder="1"
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shippingCharges"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipping Charges (₹)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              placeholder="0"
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gstPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GST Percentage</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              placeholder="0"
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deliveryTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Time</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 3-5 business days" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Featured Product</FormLabel>
                            <FormDescription>
                              This product will be displayed on the homepage
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle>Media</CardTitle>
                  <CardDescription>Add product images and video</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Images</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            maxImages={5}
                            label="Product Images"
                          />
                        </FormControl>
                        <FormDescription>
                          Upload up to 5 product images. First image will be the main display image.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Video URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter YouTube or Vimeo video URL"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Add a product demonstration or overview video
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                  <CardDescription>Add detailed technical information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="productType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select product type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {productTypeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacity</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 500W, 10L" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="powerConsumption"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Power Consumption</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 100W" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="automation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Automation Level</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select automation level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {automationOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="specifications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detailed Specifications</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter detailed technical specifications"
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="installationRequired"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Installation Required</FormLabel>
                            <FormDescription>
                              Check if professional installation is required
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded"
              disabled={isSubmitting || isLoading || isFetchingHsn}
            >
              {isSubmitting ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}