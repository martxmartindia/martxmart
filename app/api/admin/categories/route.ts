import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication using NextAuth
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied. Admin role required." }, { status: 403 })
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // SHOP or MACHINE
    const includeSubcategories = searchParams.get('includeSubcategories') === 'true';
    const includeProducts = searchParams.get('includeProducts') === 'true';

    const categories = await prisma.category.findMany({
      where: {
        type: type ? (type as 'SHOP' | 'MACHINE') : undefined,
        parentId: null,
      },
      include: {
        _count: {
          select: {
            products: { where: { isDeleted: false } },
            shopping: { where: { isDeleted: false } },
          },
        },
        products: type === 'MACHINE' ? {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            images: true,
            price: true,
            manufacturer: true,
            featured: true,
            stock: true,
          },
          where: { isDeleted: false },
          take: includeProducts ? 5 : 1,
          orderBy: { createdAt: 'desc' },
        } : false,
        shopping: type === 'SHOP' ? {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            images: true,
            price: true,
            brand: true,
            averageRating: true,
            stock: true,
            isAvailable: true,
            isFeatured: true,
          },
          where: { isDeleted: false, isAvailable: true },
          take: includeProducts ? 5 : 1,
          orderBy: { createdAt: 'desc' },
        } : false,
        subcategories: includeSubcategories ? {
          include: {
            _count: {
              select: {
                products: { where: { isDeleted: false } },
                shopping: { where: { isDeleted: false } },
              },
            },
            products: type === 'MACHINE' ? {
              select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                images: true,
                price: true,
                manufacturer: true,
                featured: true,
                stock: true,
              },
              where: { isDeleted: false },
              take: includeProducts ? 10 : 1,
              orderBy: { createdAt: 'desc' },
            } : false,
            shopping: type === 'SHOP' ? {
              select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                images: true,
                price: true,
                brand: true,
                averageRating: true,
                stock: true,
                isAvailable: true,
                isFeatured: true,
              },
              where: { isDeleted: false, isAvailable: true },
              take: includeProducts ? 10 : 1,
              orderBy: { createdAt: 'desc' },
            } : false,
          },
        } : false,
      },
      orderBy: { name: 'asc' },
    });

    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      type: category.type,
      isFestival: category.isFestival,
      festivalType: category.festivalType,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      productCount: category._count.products,
      shoppingCount: category._count.shopping,
      featured: category.type === 'SHOP' ? 
        (category.shopping && Array.isArray(category.shopping) && category.shopping.some((item) => item.averageRating && item.averageRating >= 4)) : 
        (category.products && Array.isArray(category.products) && category.products.some((product) => product.featured)) || false,
      image: category.type === 'SHOP' ? 
        (category.shopping && Array.isArray(category.shopping) && category.shopping[0]?.images[0]) || '/logo.png' : 
        (category.products && Array.isArray(category.products) && category.products[0]?.images[0]) || '/logo.png',
      subcategories: (category.subcategories || []).map((subcategory) => ({
        id: subcategory.id,
        name: subcategory.name,
        slug: subcategory.slug,
        productCount: (subcategory as any)._count?.products ?? 0,
        shoppingCount: (subcategory as any)._count?.shopping ?? 0,
        featured: category.type === 'SHOP' ? 
          ((subcategory as any).shopping && Array.isArray((subcategory as any).shopping) && (subcategory as any).shopping.some((item: { averageRating?: number }) => item.averageRating && item.averageRating >= 4)) :
          ((subcategory as any).products && Array.isArray((subcategory as any).products) && (subcategory as any).products.some((product: { featured: boolean }) => product.featured)) ?? false,
        image: category.type === 'SHOP' ? 
          ((subcategory as any).shopping && Array.isArray((subcategory as any).shopping) && (subcategory as any).shopping[0]?.images[0]) || '/logo.png' :
          ((subcategory as any).products && Array.isArray((subcategory as any).products) && (subcategory as any).products[0]?.images[0]) || '/logo.png',
        products: includeProducts ? (subcategory as any).products || [] : [],
        shopping: includeProducts ? (subcategory as any).shopping || [] : [],
      })),
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication using NextAuth
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied. Admin role required." }, { status: 403 })
    }
    
    const body = await request.json();
    const { name, type, parentId, isFestival, festivalType } = body;

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        type: type || 'MACHINE',
        parentId: parentId || null,
        isFestival: isFestival || false,
        festivalType: festivalType || null,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Category name or slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
