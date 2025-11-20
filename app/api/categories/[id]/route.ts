import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
  const type = request.nextUrl.searchParams.get('type');
try {
    const category = await prisma.category.findUnique({
      where: { id, type: type as any },
      include: {
        _count: { select: { products: true } },
        products: {
          select: {
            featured: true,
            name: true,
            description: true,
            images: true,
            price: true,
            manufacturer: true,
          },
          where: { isDeleted: false },
          take: 1,
        },
        subcategories: {
          include: {
            _count: { select: { products: true } },
            products: {
              select: {
                featured: true,
                name: true,
                description: true,
                images: true,
                price: true,
                manufacturer: true,
              },
              where: { isDeleted: false },
              take: 1,
            },
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const formattedSubcategories = (category.subcategories || []).map((subcategory) => ({
      id: subcategory.id,
      name: subcategory.name,
      productCount: subcategory._count.products,
      featured: subcategory.products.some((product) => product.featured),
      description: subcategory.products[0]?.description || `Browse our collection of ${subcategory.name.toLowerCase()}`,
      image: subcategory.products[0]?.images[0] || '/logo.png',
    }));

    return NextResponse.json({
      categoryName: category.name,
      subcategories: formattedSubcategories,
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json({ error: 'Failed to fetch subcategories' }, { status: 500 });
  }
}