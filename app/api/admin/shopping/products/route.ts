import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyJWT(token);
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('category');
    const status = searchParams.get('status');
    
    const skip = (page - 1) * limit;
    
    const where: any = { isDeleted: false };
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { hsnCode: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId;
    }
    
    if (status && status !== 'all') {
      where.isAvailable = status === 'active';
    }

    const [products, total] = await Promise.all([
      prisma.shopping.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true }
          },
          _count: {
            select: {
              reviews: true,
              orderItems: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.shopping.count({ where })
    ]);

    // Convert Decimal to number for JSON serialization
    const serializedProducts = products.map(product => ({
      ...product,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      shippingCharges: product.shippingCharges ? Number(product.shippingCharges) : null
    }));

    return NextResponse.json({
      products: serializedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyJWT(token);
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }
    
    const body = await request.json();
    const {
      name, slug, description, price, originalPrice, stock, images, brand,
      hsnCode, isFeatured, gstPercentage, categoryId, isFestival, festivalType,
      attributes, expiryDate, weight, dimensions, discount, discountType,
      discountStartDate, discountEndDate, shippingCharges, isAvailable
    } = body;

    // Generate slug if not provided
    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await prisma.shopping.create({
      data: {
        name,
        slug: generatedSlug,
        description,
        price,
        originalPrice,
        stock: stock || 0,
        images: images || [],
        brand,
        hsnCode,
        isFeatured: isFeatured || false,
        gstPercentage,
        categoryId,
        isFestival: isFestival || false,
        festivalType,
        attributes,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        weight,
        dimensions,
        discount: discount || 0,
        discountType: discountType || 'PERCENTAGE',
        discountStartDate: discountStartDate ? new Date(discountStartDate) : null,
        discountEndDate: discountEndDate ? new Date(discountEndDate) : null,
        shippingCharges,
        isAvailable: isAvailable ?? true
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

    return NextResponse.json(serializedProduct, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Product name or slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}