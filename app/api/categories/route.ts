import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // SHOP or MACHINE
  const includeSubcategories = searchParams.get('includeSubcategories') === 'true';
  const includeProducts = searchParams.get('includeProducts') === 'true';
  const flatList = searchParams.get('flatList') === 'true'; // For product editing forms

  try {
    // If flatList is requested, return simple array for dropdown/select components
    if (flatList) {
      const categories = await prisma.category.findMany({
        where: {
          type: type ? (type as 'SHOP' | 'MACHINE') : undefined,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          parentId: true,
        },
        orderBy: [
          { parentId: 'asc' },
          { name: 'asc' }
        ],
      });

      // Return simple flat array with hierarchical naming (parent > subcategory)
      const flatCategories = categories.map(category => {
        let displayName = category.name;
        if (category.parentId) {
          const parentCategory = categories.find(c => c.id === category.parentId);
          if (parentCategory) {
            displayName = `${parentCategory.name} > ${category.name}`;
          }
        }
        return {
          id: category.id,
          name: displayName,
          slug: category.slug,
          type: category.type,
          parentId: category.parentId,
        };
      });

      return NextResponse.json(flatCategories);
    }

    // Original hierarchical structure for main categories page
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
        category.shopping.some((item) => item.averageRating && item.averageRating >= 4) : 
        category.products.some((product) => product.featured),
      description: category.type === 'SHOP' ? 
        (category.shopping[0]?.description || `Browse our collection of ${category.name.toLowerCase()}`) : 
        (category.products[0]?.description || `Browse our collection of ${category.name.toLowerCase()}`),
      image: category.type === 'SHOP' ? 
        (category.shopping[0]?.images[0] || '/logo.png') : 
        (category.products[0]?.images[0] || '/logo.png'),
      subcategories: (category.subcategories || []).map((subcategory) => ({
        id: subcategory.id,
        name: subcategory.name,
        slug: subcategory.slug,
        productCount: (subcategory as any)._count?.products ?? 0,
        shoppingCount: (subcategory as any)._count?.shopping ?? 0,
        featured: category.type === 'SHOP' ? 
          (subcategory as any).shopping?.some((item: { averageRating?: number }) => item.averageRating && item.averageRating >= 4) :
          (subcategory as any)?.products?.some((product: { featured: boolean }) => product.featured) ?? false,
        image: category.type === 'SHOP' ? 
          ((subcategory as any).shopping?.[0]?.images[0] || '/logo.png') :
          ((subcategory as any).products?.[0]?.images[0] || '/logo.png'),
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, type, parentId, isFestival, festivalType } = body;

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