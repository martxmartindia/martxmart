import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers";
import { Role } from "@/types";

export async function POST(req: Request) {
  try {
    const authError = await requireAuth();
    if (authError) return authError;

    const user = await getAuthenticatedUser();
    if (!user || user.role !== Role.VENDOR) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const vendorId = user.id;
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: vendorId as string },
    });

    if (!vendorProfile) {
      return NextResponse.json({ message: "Vendor profile not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const productsFile = formData.get('products') as File;

    if (!productsFile) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const fileContent = await productsFile.text();
    const products = JSON.parse(fileContent);

    if (!Array.isArray(products)) {
      return NextResponse.json({ message: "Invalid file format" }, { status: 400 });
    }

    const createdProducts = await Promise.all(
      products.map(async (product) => {
        const productData = product;

        // Validate and prepare product data
        const productDataWithDefaults = {
          ...productData,
          vendorId: vendorProfile.id,
          images: productData.images || [],
          certifications: productData.certifications || [],
          industryType: productData.industryType || [],
          applications: productData.applications || [],
          accessories: productData.accessories || [],
          documentationLinks: productData.documentationLinks || [],
          price: typeof productData.price === 'string' ? parseFloat(productData.price) : productData.price,
          stock: productData.stock || 0,
          featured: productData.featured || false,
          isDeleted: false
        };

        const createdProduct = await prisma.product.create({
          data: productDataWithDefaults,
          include: {
            category: true
          }
        });

        return createdProduct;
      })
    );

    return NextResponse.json({
      message: "Products created successfully",
      products: createdProducts
    });

  } catch (error) {
    console.error("Error creating products in bulk:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}