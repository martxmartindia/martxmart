import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/utils/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.shopping.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true }
        },
        _count: {
          select: {
            reviews: true,
            orderItems: true,
            cartItems: true
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Convert Decimal to number for JSON serialization
    const serializedProduct = {
      ...product,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      shippingCharges: product.shippingCharges ? Number(product.shippingCharges) : null
    };

    return NextResponse.json(serializedProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyJWT(token);
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }
    
    const { id } = await params;
    const body = await request.json();
    const {
      name, slug, description, price, originalPrice, stock, images, brand,
      hsnCode, isFeatured, gstPercentage, categoryId, isFestival, festivalType,
      attributes, expiryDate, weight, dimensions, discount, discountType,
      discountStartDate, discountEndDate, shippingCharges, isAvailable
    } = body;

    const product = await prisma.shopping.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price,
        originalPrice,
        stock,
        images,
        brand,
        hsnCode,
        isFeatured,
        gstPercentage,
        categoryId,
        isFestival,
        festivalType,
        attributes,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        weight,
        dimensions,
        discount,
        discountType,
        discountStartDate: discountStartDate ? new Date(discountStartDate) : null,
        discountEndDate: discountEndDate ? new Date(discountEndDate) : null,
        shippingCharges,
        isAvailable
      },
      include: {
        category: {
          select: { id: true, name: true }
        }
      }
    });

    // Convert Decimal to number for JSON serialization
    const serializedProduct = {
      ...product,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      shippingCharges: product.shippingCharges ? Number(product.shippingCharges) : null
    };

    return NextResponse.json(serializedProduct);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Product name or slug already exists' }, { status: 400 });
    }
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyJWT(token);
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    const { id } = await params;

    // Soft delete by setting isDeleted to true
    await prisma.shopping.update({
      where: { id },
      data: { isDeleted: true }
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyJWT(token);
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const product = await prisma.shopping.update({
      where: { id },
      data: body
    });

    return NextResponse.json({ message: 'Product updated successfully', product });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}