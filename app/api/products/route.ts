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
        { category: { parent: { name: { contains: search, mode: 'insensitive' } } } },
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

    // Enhanced hierarchical category filter - Support main categories, subcategories, and deep subcategories
    const categoryFilter = category && category !== 'all' 
      ? { 
          OR: [
            { categoryId: category },
            { category: { parentId: category } },
            { category: { parent: { parentId: category } } },
            { category: { parent: { parent: { parentId: category } } } }
          ]
        }
      : {};

    // Fetch products with hierarchical category information and all categories for filtering
    const [products, categories, allCategories] = await Promise.all([
      prisma.product.findMany({
        where: { ...whereConditions, ...categoryFilter },
        include: { 
          category: {
            include: {
              parent: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  slug: true
                }
              }
            }
          }
        },
        orderBy: getSortOrder(sortBy),
      }),
      // Get main categories (parentId = null)
      prisma.category.findMany({ 
        where: { parentId: null },
        select: { 
          id: true, 
          name: true,
          type: true,
          slug: true
        },
        orderBy: { name: 'asc' }
      }),
      // Get all categories for hierarchical filtering
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          parentId: true
        },
        orderBy: { name: 'asc' }
      })
    ]);

    console.log('Database query returned:', products.length, 'products for search:', search);

    // Transform products with hierarchical category information
    const allProducts = products.map(transformProductWithHierarchy);

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedProducts = allProducts.slice(startIndex, startIndex + limit);

    // Get unique brands
    const brands = [...new Set(allProducts.map(p => p.brand).filter(Boolean))];

    // Build hierarchical categories structure
    const hierarchicalCategories = buildHierarchicalCategories(allCategories);

    return NextResponse.json({
      products: paginatedProducts,
      total: allProducts.length,
      page,
      limit,
      totalPages: Math.ceil(allProducts.length / limit),
      filters: {
        categories: hierarchicalCategories,
        mainCategories: categories.map(c => ({ 
          id: c.id, 
          name: c.name,
          type: c.type,
          slug: c.slug 
        })),
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

function transformProductWithHierarchy(product: any): any {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    stock: product.stock || 0,
    category: { 
      name: product.category.name, 
      id: product.category.id,
      type: product.category.type,
      slug: product.category.slug,
      parent: product.category.parent ? {
        name: product.category.parent.name,
        id: product.category.parent.id,
        type: product.category.parent.type,
        slug: product.category.parent.slug
      } : null
    },
    brand: product.brand,
    description: product.description,
    images: product.images && product.images.length > 0 ? product.images : ['/placeholder.png'],
    averageRating: product.averageRating || 0,
    reviewCount: product.reviewCount || 0,
    discount: product.discount,
    featured: product.featured || false
  };
}

// Helper function to build hierarchical categories structure
function buildHierarchicalCategories(categories: any[]): any[] {
  const categoryMap = new Map();
  const rootCategories: any[] = [];

  // First pass: create category objects and map by ID
  categories.forEach(category => {
    categoryMap.set(category.id, {
      id: category.id,
      name: category.name,
      slug: category.slug,
      type: category.type,
      parentId: category.parentId,
      children: []
    });
  });

  // Second pass: organize into hierarchy
  categories.forEach(category => {
    const categoryObj = categoryMap.get(category.id);
    if (category.parentId) {
      const parent = categoryMap.get(category.parentId);
      if (parent) {
        parent.children.push(categoryObj);
      }
    } else {
      rootCategories.push(categoryObj);
    }
  });

  return rootCategories;
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
        category: {
          include: {
            parent: {
              select: {
                id: true,
                name: true,
                type: true
              }
            }
          }
        },
        reviews: true
      }
    });

    return NextResponse.json({
      message: 'Product created successfully',
      product: {
        ...transformProductWithHierarchy(newProduct),
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