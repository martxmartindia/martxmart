import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = (await params).id;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const brand = searchParams.get('brand');

    // Verify the category exists and get its type
    const category = await prisma.category.findUnique({
      where: { id },
      include: { parent: true }
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Build where conditions based on category type
    const whereConditions: any = { isDeleted: false };

    // If it's a subcategory, include products from this category and its children
    if (category.parentId) {
      whereConditions.categoryId = id;
    } else {
      // If it's a parent category, get products from all subcategories
      const subcategoryIds = await prisma.category.findMany({
        where: { parentId: id },
        select: { id: true }
      });
      const allIds = [id, ...subcategoryIds.map(c => c.id)];
      whereConditions.categoryId = { in: allIds };
    }

    // Add search filter
    if (search) {
      whereConditions.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { manufacturer: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Add price filter
    if (minPrice || maxPrice) {
      whereConditions.price = {};
      if (minPrice) whereConditions.price.gte = parseFloat(minPrice);
      if (maxPrice) whereConditions.price.lte = parseFloat(maxPrice);
    }

    // Add brand filter
    if (brand) {
      whereConditions.brand = { contains: brand, mode: 'insensitive' };
    }

    // Fetch products based on category type
    let products: any[];
    let total: number;

    if (category.type === 'MACHINE') {
      // Fetch from Product table for machines
      const [productsData, totalData] = await Promise.all([
        prisma.product.findMany({
          where: whereConditions,
          include: {
            category: {
              select: { id: true, name: true, slug: true }
            }
          },
          orderBy: { [sortBy]: sortOrder },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.product.count({ where: whereConditions })
      ]);

      products = productsData.map(product => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        stock: product.stock || 0,
        featured: product.featured || false,
        images: product.images && product.images.length > 0 ? product.images : ['/placeholder.png'],
        brand: product.brand,
        manufacturer: product.manufacturer,
        description: product.description,
        category: product.category ? { name: product.category.name, id: product.category.id } : null,
        discount: product.discount,
        averageRating: product.averageRating || 0,
        reviewCount: product.reviewCount || 0
      }));

      total = totalData;
    } else {
      // Fetch from Shopping table for general products
      const whereShopping = {
        ...whereConditions,
        isAvailable: true
      };

      const [productsData, totalData] = await Promise.all([
        prisma.shopping.findMany({
          where: whereShopping,
          include: {
            category: {
              select: { id: true, name: true, slug: true }
            }
          },
          orderBy: { [sortBy]: sortOrder },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.shopping.count({ where: whereShopping })
      ]);

      products = productsData.map(product => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        stock: product.stock || 0,
        featured: product.isFeatured || false,
        images: product.images && product.images.length > 0 ? product.images : ['/placeholder.png'],
        brand: product.brand,
        manufacturer: null, // Shopping products don't have manufacturer
        description: product.description || '',
        category: product.category ? { name: product.category.name, id: product.category.id } : null,
        discount: product.discount,
        averageRating: product.averageRating || 0,
        reviewCount: product.reviewCount || 0
      }));

      total = totalData;
    }

    // Get unique brands for filtering
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];

    return NextResponse.json({
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      category: {
        id: category.id,
        name: category.name,
        type: category.type,
        isSubcategory: !!category.parentId
      },
      filters: {
        brands
      }
    });

  } catch (error) {
    console.error('Error fetching category products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}