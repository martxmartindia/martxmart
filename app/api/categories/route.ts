import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // SHOP or MACHINE
  const includeSubcategories = searchParams.get('includeSubcategories') === 'true';

  try {
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
          },
          where: { isDeleted: false },
          take: 1,
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
          },
          where: { isDeleted: false, isAvailable: true },
          take: 1,
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
              },
              where: { isDeleted: false },
              take: 1,
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
              },
              where: { isDeleted: false, isAvailable: true },
              take: 1,
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
      productCount: category.type === 'SHOP' ? category._count.shopping : category._count.products,
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
        productCount: category.type === 'SHOP' ? 
          (subcategory as any)._count?.shopping ?? 0 : 
          (subcategory as any)._count?.products ?? 0,
        featured: category.type === 'SHOP' ? 
          (subcategory as any).shopping?.some((item: { averageRating?: number }) => item.averageRating && item.averageRating >= 4) :
          (subcategory as any)?.products?.some((product: { featured: boolean }) => product.featured) ?? false,

        image: category.type === 'SHOP' ? 
          ((subcategory as any).shopping?.[0]?.images[0] || '/logo.png') :
          ((subcategory as any).products?.[0]?.images[0] || '/logo.png'),
      })),
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}