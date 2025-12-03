import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, requireAuth } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'name';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    console.log('API received search parameter:', search);

    // Build where conditions
    const whereConditions: any = {
      isDeleted: false,
    };

    if (search) {
      whereConditions.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (brand) {
      whereConditions.brand = { contains: brand, mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      whereConditions.price = {};
      if (minPrice) whereConditions.price.gte = parseFloat(minPrice);
      if (maxPrice) whereConditions.price.lte = parseFloat(maxPrice);
    }

    // Category filter for both Product and Shopping
    const categoryFilter = category && category !== 'all' 
      ? { category: { name: { contains: category, mode: 'insensitive' } } }
      : {};

    // Fetch only from Product table
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { ...whereConditions, ...categoryFilter },
        include: { category: true },
        orderBy: getSortOrder(sortBy),
      }),
      prisma.category.findMany({ select: { name: true } })
    ]);

    console.log('Database query returned:', products.length, 'products for search:', search);

    // Transform products
    const allProducts = products.map(transformProduct);

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedProducts = allProducts.slice(startIndex, startIndex + limit);

    // Get unique brands
    const brands = [...new Set(allProducts.map(p => p.brand).filter(Boolean))];

    return NextResponse.json({
      products: paginatedProducts,
      total: allProducts.length,
      page,
      limit,
      totalPages: Math.ceil(allProducts.length / limit),
      filters: {
        categories: categories.map(c => ({ id: c.name, name: c.name })),
        brands,
      },
    });

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

function getSortOrder(sortBy: string) {
  switch (sortBy) {
    case 'price_low':
      return { price: 'asc' as const };
    case 'price_high':
      return { price: 'desc' as const };
    case 'newest':
      return { createdAt: 'desc' as const };
    default:
      return { name: 'asc' as const };
  }
}

function transformProduct(product: any) {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    stock: product.stock || 0,
    category: { name: product.category.name, id: product.category.id },
    brand: product.brand,
    description: product.description,
    images: product.images && product.images.length > 0 ? product.images : ['/placeholder.png'],
    averageRating: product.averageRating || 0,
    reviewCount: product.reviewCount || 0,
    discount: product.discount,
    featured: product.featured || false
  };
}



export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const result = await requireAuth();
    if (result instanceof NextResponse) return result;

    const user = await getAuthenticatedUser();
    if (!user ||  user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      stock = 0,
      categoryId,
      brand,
      modelNumber,
      dimensions,
      weight,
      warranty,
      featured = false,
      images = [],
      videoUrl,
      productType,
      hsnCode,
      gstPercentage,
      capacity,
      powerConsumption,
      material,
      automation,
      certifications = [],
      discount,
      discountType,
      discountStartDate,
      discountEndDate,
      shippingCharges,
      minimumOrderQuantity,
      deliveryTime,
      warrantyDetails,
      returnPolicy,
      afterSalesService,
      industryType = [],
      applications = [],
      accessories = [],
      installationRequired = false,
      documentationLinks = [],
      manufacturer,
      madeIn,
      specifications,
      slug
    } = body;

    // Validate required fields
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, categoryId' },
        { status: 400 }
      );
    }

    // Validate category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId }
    });
    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const productSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if slug is unique
    if (productSlug) {
      const existingProduct = await prisma.product.findUnique({
        where: { slug: productSlug }
      });
      if (existingProduct) {
        return NextResponse.json(
          { error: 'Product slug already exists' },
          { status: 400 }
        );
      }
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug: productSlug,
        description,
        price: parseFloat(price.toString()),
        originalPrice: parseFloat(price.toString()) * 1.1, // 10% markup as original price
        stock: parseInt(stock.toString()),
        categoryId,
        brand: brand || null,
        modelNumber: modelNumber || null,
        dimensions: dimensions || null,
        weight: weight ? parseFloat(weight.toString()) : null,
        warranty: warranty || null,
        featured,
        images: Array.isArray(images) ? images : [],
        videoUrl: videoUrl || null,
        productType: productType || null,
        hsnCode: hsnCode || '8471', // Default HSN code
        gstPercentage: gstPercentage ? parseFloat(gstPercentage.toString()) : null,
        capacity: capacity || null,
        powerConsumption: powerConsumption || null,
        material: material || null,
        automation: automation || null,
        certifications: Array.isArray(certifications) ? certifications : [],
        discount: discount ? parseFloat(discount.toString()) : null,
        discountType: discountType || null,
        discountStartDate: discountStartDate ? new Date(discountStartDate) : null,
        discountEndDate: discountEndDate ? new Date(discountEndDate) : null,
        shippingCharges: shippingCharges ? parseFloat(shippingCharges.toString()) : null,
        minimumOrderQuantity: minimumOrderQuantity ? parseInt(minimumOrderQuantity.toString()) : null,
        deliveryTime: deliveryTime || null,
        warrantyDetails: warrantyDetails || null,
        returnPolicy: returnPolicy || null,
        afterSalesService: afterSalesService || null,
        industryType: Array.isArray(industryType) ? industryType : [],
        applications: Array.isArray(applications) ? applications : [],
        accessories: Array.isArray(accessories) ? accessories : [],
        installationRequired,
        documentationLinks: Array.isArray(documentationLinks) ? documentationLinks : [],
        manufacturer: manufacturer || null,
        madeIn: madeIn || null,
        specifications: specifications || null,
      },
      include: { 
        category: true,
        reviews: true
      }
    });

    return NextResponse.json({
      message: 'Product created successfully',
      product: {
        ...newProduct,
        price: Number(newProduct.price),
        originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : null,
        shippingCharges: newProduct.shippingCharges ? Number(newProduct.shippingCharges) : null,
        gstPercentage: newProduct.gstPercentage ? Number(newProduct.gstPercentage) : null,
        weight: newProduct.weight ? Number(newProduct.weight) : null,
        discount: newProduct.discount ? Number(newProduct.discount) : null,
        createdAt: newProduct.createdAt.toISOString(),
        updatedAt: newProduct.updatedAt.toISOString(),
        discountStartDate: newProduct.discountStartDate?.toISOString() ?? null,
        discountEndDate: newProduct.discountEndDate?.toISOString() ?? null,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}