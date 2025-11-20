import { NextResponse,NextRequest } from "next/server"
import { prisma as db } from "@/lib/prisma"

export async function GET(req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const productId = (await params).id;
    // Fetch product with related data
    const product = await db.shopping.findUnique({
      where: {
        id: productId,
        isDeleted: false,
        isAvailable: true,
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Fetch related products from the same category
    const relatedProducts = await db.shopping.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: productId },
        isDeleted: false,
        isAvailable: true,
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      take: 4,
    })

    return NextResponse.json({
      product: {
        ...product,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        reviews: undefined, // Remove reviews from product object
      },
      reviews: product.reviews || [],
      relatedProducts: relatedProducts.map((p) => ({
        ...p,
        price: Number(p.price),
        originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      })),
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
