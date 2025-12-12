"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { Loader2, ArrowLeft, Save, ChevronsUpDown, Check } from "lucide-react";
import { toast } from "sonner";
import { ErrorBoundary } from "react-error-boundary";
import { ImageUpload } from "@/components/imageUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import DeleteProductButton from "../DeleteProduct.page";
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

// Define DiscountType enum to match Prisma schema
const discountTypeEnum = z.enum(["PERCENTAGE", "FIXED"]).nullable();

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
  discount: z.coerce.number().optional(),
  discountType: discountTypeEnum,
  discountStartDate: z.string().optional(),
  discountEndDate: z.string().optional(),
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
  slug: z.string().optional(),
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
}

const materialOptions = [
  { value: "stainless_steel", label: "Stainless Steel (SS)" },
  { value: "plastic_composites", label: "Plastic & Composites" },
  { value: "aluminum", label: "Aluminum" },
  { value: "wood", label: "Wood" },
  { value: "glass", label: "Glass" },
  { value: "mild_steel", label: "Mild Steel (MS)" },
  { value: "tool_steel", label: "Tool Steel" },
  { value: "titanium", label: "Titanium" },
  { value: "copper_alloys", label: "Copper Alloys" },
  { value: "platinum", label: "Platinum" },
  { value: "cast_iron", label: "Cast Iron" },
  { value: "chrome_nickel_alloys", label: "Chrome Nickel Alloys" },
  { value: "ceramics", label: "Ceramics" },
  { value: "brass", label: "Brass" },
  { value: "copper", label: "Copper" },
  { value: "high_speed_steel", label: "High Speed Steel (HSS)" },
  { value: "chrome_vanadium_steel", label: "Chrome Vanadium Steel (CVS)" },
  { value: "plastic_polymers", label: "Plastic Polymers" },
  { value: "rubber", label: "Rubber" },
  { value: "others", label: "Others" },
].filter(option => option.value && option.value.trim() !== '');

const automationOptions = [
  { value: "fully_automatic", label: "Fully Automatic" },
  { value: "semi_automatic", label: "Semi-Automatic" },
  { value: "manual", label: "Manual" },
  { value: "smart_automation", label: "Smart Automation" },
  {
    value: "remote_controlled_automation",
    label: "Remote-Controlled Automation",
  },
  { value: "hybrid_automation", label: "Hybrid Automation" },
  { value: "programmable_automation", label: "Programmable Automation" },
  { value: "adaptive_automation", label: "Adaptive Automation" },
  { value: "batch_automation", label: "Batch Automation" },
  { value: "fixed_automation", label: "Fixed Automation" },
  { value: "others", label: "Others" },
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
  {
    value: "electrical_electronic_machinery",
    label: "Electrical and Electronic Machinery",
  },
  { value: "mechanical_machinery", label: "Mechanical Machinery" },
  { value: "industrial_equipment", label: "Industrial Equipment" },
  {
    value: "precision_tools_instruments",
    label: "Precision Tools and Instruments",
  },
  {
    value: "agricultural_food_processing_machinery",
    label: "Agricultural and Food Processing Machinery",
  },
  {
    value: "construction_mining_equipment",
    label: "Construction and Mining Equipment",
  },
  {
    value: "textile_garment_machinery",
    label: "Textile and Garment Machinery",
  },
  {
    value: "automotive_transportation_equipment",
    label: "Automotive and Transportation Equipment",
  },
  {
    value: "medical_laboratory_equipment",
    label: "Medical and Laboratory Equipment",
  },
  { value: "hand_power_tools", label: "Hand Tools and Power Tools" },
  { value: "packaging_machinery", label: "Packaging Machinery" },
  {
    value: "printing_publishing_equipment",
    label: "Printing and Publishing Equipment",
  },
  {
    value: "chemical_pharmaceutical_machinery",
    label: "Chemical and Pharmaceutical Machinery",
  },
  { value: "renewable_energy_equipment", label: "Renewable Energy Equipment" },
  {
    value: "robotics_automation_systems",
    label: "Robotics and Automation Systems",
  },
  {
    value: "hvac_refrigeration_equipment",
    label: "HVAC and Refrigeration Equipment",
  },
  {
    value: "marine_shipbuilding_equipment",
    label: "Marine and Shipbuilding Equipment",
  },
  {
    value: "aerospace_defense_equipment",
    label: "Aerospace and Defense Equipment",
  },
  {
    value: "woodworking_furniture_machinery",
    label: "Woodworking and Furniture Machinery",
  },
  {
    value: "plastic_rubber_processing_machinery",
    label: "Plastic and Rubber Processing Machinery",
  },
];

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
  
  // Fallback timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setError('Loading timed out. Please refresh the page.');
      }
    }, 15000);
    return () => clearTimeout(timeout);
  }, [isLoading]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingHsn, setIsFetchingHsn] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<ProductFormValues | null>(null);
  const [hsnCodes, setHsnCodes] = useState<HsnCode[]>([]);
  const [hsnSearch, setHsnSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

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
      discount: undefined,
      discountType: null,
      discountStartDate: "",
      discountEndDate: "",
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
      slug: "",
    },
  });

  // Debounced HSN code search
  const fetchHsnCodes = useCallback(
    debounce(async (search: string) => {
      if (!isMounted.current) return;
      try {
        setIsFetchingHsn(true);
        setError(null);
        const response = await fetch(
          `/api/kyc/verify/hsn?search=${encodeURIComponent(search)}&limit=50`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
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
        if (!isMounted.current) return;
        const message = "Failed to fetch HSN codes";
        setError(message);
        toast.error(message);
        setHsnCodes([]);
      } finally {
        if (isMounted.current) setIsFetchingHsn(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch product and categories in parallel
        const [productResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/products/${id}`, { credentials: 'include' }),
          fetch("/api/categories?type=MACHINE&flatList=true")
        ]);
        
        const [productData, categoriesData] = await Promise.all([
          productResponse.json(),
          categoriesResponse.json()
        ]);
        
        if (!productResponse.ok) {
          throw new Error(productData.error || "Failed to fetch product");
        }
        
        setCategories(categoriesData || []);
        setProduct(productData.product);
        
        // Reset form with actual product data
        form.reset({
          name: productData.product.name || "",
          description: productData.product.description || "",
          price: productData.product.price || 0,
          stock: productData.product.stock || 0,
          categoryId: productData.product.categoryId || "",
          brand: productData.product.brand || "",
          modelNumber: productData.product.modelNumber || "",
          dimensions: productData.product.dimensions || "",
          weight: productData.product.weight ?? undefined,
          warranty: productData.product.warranty || "",
          featured: productData.product.featured || false,
          images: productData.product.images || [],
          videoUrl: productData.product.videoUrl || "",
          productType: productData.product.productType || "",
          hsnCode: productData.product.hsnCode || "",
          gstPercentage: productData.product.gstPercentage ?? undefined,
          capacity: productData.product.capacity || "",
          powerConsumption: productData.product.powerConsumption || "",
          material: productData.product.material || "",
          automation: productData.product.automation || "",
          certifications: productData.product.certifications || [],
          discount: productData.product.discount ?? undefined,
          discountType: productData.product.discountType ?? null,
          discountStartDate: productData.product.discountStartDate || "",
          discountEndDate: productData.product.discountEndDate || "",
          shippingCharges: productData.product.shippingCharges ?? undefined,
          minimumOrderQuantity: productData.product.minimumOrderQuantity ?? undefined,
          deliveryTime: productData.product.deliveryTime || "",
          warrantyDetails: productData.product.warrantyDetails || "",
          returnPolicy: productData.product.returnPolicy || "",
          afterSalesService: productData.product.afterSalesService || "",
          industryType: productData.product.industryType || [],
          applications: productData.product.applications || [],
          accessories: productData.product.accessories || [],
          installationRequired: productData.product.installationRequired || false,
          documentationLinks: productData.product.documentationLinks || [],
          manufacturer: productData.product.manufacturer || "",
          madeIn: productData.product.madeIn || "",
          specifications: productData.product.specifications || "",
          slug: productData.product.slug || "",
        });
        
      } catch (error: any) {
        setError(error.message || 'Failed to load product');
        toast.error(error.message || 'Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (open && isMounted.current) {
      fetchHsnCodes(hsnSearch);
    }
  }, [hsnSearch, open, fetchHsnCodes]);

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Auto-generate slug from product name
      const autoSlug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      const submitData = {
        ...data,
        slug: autoSlug
      };
      
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(submitData),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to update product");
      }
      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch (error: any) {
      setError(error.message || "Failed to update product");
      toast.error(error.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        <span className="text-lg text-gray-700">Loading product data...</span>
        {error && (
          <div className="text-red-600 text-sm max-w-md text-center">
            {error}
          </div>
        )}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <div className="text-gray-500">Product not found</div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        </div>
        <div className="flex gap-2">
          {product && (
            <DeleteProductButton id={id as string} name={product.name} />
          )}
        </div>
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
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Enter the basic details of the product
                  </CardDescription>
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
                            <Input
                              placeholder="Enter product name"
                              {...field}
                            />
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
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.filter(cat => cat.id && cat.id.trim() !== '').map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
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
                            <Input
                              placeholder="Enter model number"
                              {...field}
                            />
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
                  <CardDescription>
                    Enter additional details about the product
                  </CardDescription>
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
                            <Input
                              placeholder="e.g., 10 x 20 x 30 cm"
                              {...field}
                            />
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
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                                )
                              }
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
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select material" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {materialOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
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
                            <Input
                              placeholder="Enter manufacturer name"
                              {...field}
                            />
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
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country of origin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {madeInOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
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
                                    ? hsnCodes.find(
                                        (code) => code.hsnCode === field.value
                                      )?.hsnName || field.value
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
                                    {isFetchingHsn
                                      ? "Loading HSN codes..."
                                      : "No HSN codes found."}
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {hsnCodes.map((code) => (
                                      <CommandItem
                                        key={code.id}
                                        value={`${code.hsnCode} ${code.hsnName}`}
                                        onSelect={() => {
                                          form.setValue(
                                            "hsnCode",
                                            code.hsnCode
                                          );
                                          setOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            code.hsnCode === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
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
                            <Input
                              placeholder="e.g., 1 Year Manufacturer Warranty"
                              {...field}
                            />
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
                  <CardDescription>
                    Set pricing and inventory details
                  </CardDescription>
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
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Discount{" "}
                            {form.watch("discountType") === "PERCENTAGE"
                              ? "(%)"
                              : "(₹)"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step={
                                form.watch("discountType") === "PERCENTAGE"
                                  ? "0.01"
                                  : "1"
                              }
                              placeholder="0"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select discount type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="PERCENTAGE">
                                Percentage
                              </SelectItem>
                              <SelectItem value="FIXED">Fixed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discountStartDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discountEndDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
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
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
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
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                                )
                              }
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
                          <FormLabel>GST Percentage (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="18.00"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                                )
                              }
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
                              step="0.01"
                              placeholder="0.00"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                                )
                              }
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
                            <Input
                              placeholder="e.g., 3-5 business days"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6">
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

                  <div className="mt-4">
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
                              This product requires professional installation
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
                  <CardDescription>
                    Upload product images and videos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Images</FormLabel>
                          <FormControl>
                            <ErrorBoundary
                              fallback={<div>Error in ImageUpload</div>}
                            >
                              <ImageUpload
                                value={field.value}
                                onChange={field.onChange}
                                maxImages={5}
                                label="Product Images"
                              />
                            </ErrorBoundary>
                          </FormControl>
                          <FormDescription>
                            Upload up to 5 images. First image will be used as
                            the product thumbnail.
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
                          <FormLabel>Video URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter YouTube or Vimeo URL"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Add a product demonstration video URL (YouTube or
                            Vimeo)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                  <CardDescription>
                    Enter detailed technical specifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="productType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select product type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {productTypeOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
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
                            <Input
                              placeholder="e.g., 10L, 5kg, 1000W"
                              {...field}
                            />
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
                            <Input
                              placeholder="e.g., 100W, 2.5kWh"
                              {...field}
                            />
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
                          <FormLabel>Automation</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select automation level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {automationOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
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

                  <div className="mt-6">
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
                          <FormDescription>
                            Enter detailed specifications in a structured format
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6">
                    <FormField
                      control={form.control}
                      name="certifications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certifications</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., ISO 9001, CE"
                              value={field.value?.join(", ")}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value.split(", ").filter(Boolean)
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Enter certifications separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Configure advanced product settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., product-name"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Unique URL slug for the product
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="industryType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry Type</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Manufacturing, Automotive"
                              value={field.value?.join(", ")}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value.split(", ").filter(Boolean)
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Enter industry types separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="applications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Applications</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Industrial, Commercial"
                              value={field.value?.join(", ")}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value.split(", ").filter(Boolean)
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Enter applications separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="accessories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accessories</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Charger, Manual"
                              value={field.value?.join(", ")}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value.split(", ").filter(Boolean)
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Enter accessories separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6">
                    <FormField
                      control={form.control}
                      name="documentationLinks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Documentation Links</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., https://example.com/doc1, https://example.com/doc2"
                              value={field.value?.join(", ")}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value.split(", ").filter(Boolean)
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Enter documentation URLs separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700"
              disabled={isSubmitting || isLoading || isFetchingHsn}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
