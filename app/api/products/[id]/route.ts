// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { DiscountType } from "@prisma/client";
import { getAuthenticatedUser, requireAuth } from '@/lib/auth-helpers';

const updateProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
  categoryId: z.string().min(1, "Please select a category"),
  brand: z.string().optional(),
  modelNumber: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.number().optional(),
  warranty: z.string().optional(),
  featured: z.boolean().default(false),
  images: z.array(z.string()).min(1, "At least one image is required"),
  videoUrl: z.string().optional(),
  productType: z.string().optional(),
  hsnCode: z.string().optional(),
  gstPercentage: z.number().optional(),
  capacity: z.string().optional(),
  powerConsumption: z.string().optional(),
  material: z.string().optional(),
  automation: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  discount: z.number().optional(),
  discountType: z.string().optional(),
  discountStartDate: z.string().optional(),
  discountEndDate: z.string().optional(),
  shippingCharges: z.number().optional(),
  minimumOrderQuantity: z.number().int().optional(),
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
  plantId: z.string().optional(),
  vendorId: z.string().optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
        isDeleted: false,
      },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                id: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        productServices: true,
        shippingInfos: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Calculate average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;

    // Get related products (same category)
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isDeleted: false,
      },
      include: {
        category: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      take: 4,
    });

    // Calculate average rating for related products
    const relatedProductsWithRating = relatedProducts.map((relatedProduct) => {
      const totalRelatedRating = relatedProduct.reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRelatedRating =
        relatedProduct.reviews.length > 0 ? totalRelatedRating / relatedProduct.reviews.length : 0;

      return {
        ...relatedProduct,
        price: Number(relatedProduct.price),
        shippingCharges: relatedProduct.shippingCharges ? Number(relatedProduct.shippingCharges) : null,
        gstPercentage: relatedProduct.gstPercentage ? Number(relatedProduct.gstPercentage) : null,
        weight: relatedProduct.weight ? Number(relatedProduct.weight) : null,
        discount: relatedProduct.discount ? Number(relatedProduct.discount) : null,
        originalPrice: relatedProduct.originalPrice ? Number(relatedProduct.originalPrice) : null,
        createdAt: relatedProduct.createdAt.toISOString(),
        updatedAt: relatedProduct.updatedAt.toISOString(),
        discountStartDate: relatedProduct.discountStartDate?.toISOString() ?? null,
        discountEndDate: relatedProduct.discountEndDate?.toISOString() ?? null,
        averageRating: avgRelatedRating,
        reviewCount: relatedProduct.reviews.length,
        reviews: undefined, // Remove raw reviews data
      };
    });

    return NextResponse.json({
      product: {
        ...product,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        shippingCharges: product.shippingCharges ? Number(product.shippingCharges) : null,
        gstPercentage: product.gstPercentage ? Number(product.gstPercentage) : null,
        weight: product.weight ? Number(product.weight) : null,
        discount: product.discount ? Number(product.discount) : null,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        discountStartDate: product.discountStartDate?.toISOString() ?? null,
        discountEndDate: product.discountEndDate?.toISOString() ?? null,
        averageRating,
        reviewCount: product.reviews.length,
        reviews: product.reviews.map(review => ({
          ...review,
          createdAt: review.createdAt.toISOString()
        }))
      },
      relatedProducts: relatedProductsWithRating,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Check if user is admin
    const result = await requireAuth();
    if (result instanceof NextResponse) return result;

    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid request data", errors: parsed.error.errors },
        { status: 400 },
      );
    }

    const { hsnCode, categoryId, ...data } = parsed.data;

    // Validate category
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!categoryExists) {
      return NextResponse.json({ message: "Invalid category ID" }, { status: 400 });
    }

    // Check if product exists and is not deleted
    const existingProduct = await prisma.product.findUnique({
      where: { id, isDeleted: false },
    });
    if (!existingProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        discountType: data.discountType as DiscountType || null,
        categoryId,
        hsnCode,
        images: data.images || [],
        certifications: data.certifications || [],
        industryType: data.industryType || [],
        applications: data.applications || [],
        accessories: data.accessories || [],
        documentationLinks: data.documentationLinks || [],
        discountStartDate: data.discountStartDate ? new Date(data.discountStartDate) : null,
        discountEndDate: data.discountEndDate ? new Date(data.discountEndDate) : null,
      },
    });

    return NextResponse.json({
      product: {
        ...product,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        shippingCharges: product.shippingCharges ? Number(product.shippingCharges) : null,
        gstPercentage: product.gstPercentage ? Number(product.gstPercentage) : null,
        weight: product.weight ? Number(product.weight) : null,
        discount: product.discount ? Number(product.discount) : null,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        discountStartDate: product.discountStartDate?.toISOString() ?? null,
        discountEndDate: product.discountEndDate?.toISOString() ?? null,
      },
      message: "Product updated successfully",
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Check if user is admin
    const result = await requireAuth();
    if (result instanceof NextResponse) return result;

    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id, isDeleted: false },
    });
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Soft delete product
    await prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}