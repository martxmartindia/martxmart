import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/utils/auth';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    // Check if user is admin
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded || typeof decoded !== 'object' || decoded.payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'csv';
    const ids = searchParams.get('ids');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const stock = searchParams.get('stock');
    const priceRange = searchParams.get('priceRange');
    const brand = searchParams.get('brand');

    // Build where conditions
    const where: any = {
      isDeleted: false,
    };

    if (ids) {
      where.id = { in: ids.split(',') };
    } else {
      if (category) {
        where.categoryId = category;
      }
      if (featured !== null && featured !== '') {
        where.featured = featured === 'true';
      }
      if (stock) {
        switch (stock) {
          case 'in_stock':
            where.stock = { gt: 10 };
            break;
          case 'low_stock':
            where.stock = { gte: 1, lte: 10 };
            break;
          case 'out_of_stock':
            where.stock = 0;
            break;
        }
      }
      if (priceRange) {
        const [min, max] = priceRange.split('-');
        if (max === '+') {
          where.price = { gte: parseFloat(min) };
        } else {
          where.price = { gte: parseFloat(min), lte: parseFloat(max) };
        }
      }
      if (brand) {
        where.brand = { contains: brand, mode: 'insensitive' };
      }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform products for export
    const exportData = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      stock: product.stock,
      featured: product.featured,
      category: product.category.name,
      brand: product.brand,
      modelNumber: product.modelNumber,
      dimensions: product.dimensions,
      weight: product.weight ? Number(product.weight) : null,
      warranty: product.warranty,
      hsnCode: product.hsnCode,
      gstPercentage: product.gstPercentage ? Number(product.gstPercentage) : null,
      capacity: product.capacity,
      powerConsumption: product.powerConsumption,
      material: product.material,
      automation: product.automation,
      manufacturer: product.manufacturer,
      madeIn: product.madeIn,
      discount: product.discount ? Number(product.discount) : null,
      discountType: product.discountType,
      shippingCharges: product.shippingCharges ? Number(product.shippingCharges) : null,
      minimumOrderQuantity: product.minimumOrderQuantity,
      deliveryTime: product.deliveryTime,
      installationRequired: product.installationRequired,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));

    if (format === 'json') {
      return NextResponse.json({
        products: exportData,
        total: exportData.length,
        exportedAt: new Date().toISOString(),
      });
    }

    // Generate CSV
    if (exportData.length === 0) {
      return new NextResponse('No products found', { status: 404 });
    }

    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(','),
      ...exportData.map(product =>
        headers.map(header => {
          const value = product[header as keyof typeof product];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value ?? '';
        }).join(',')
      )
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="products-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export products' }, { status: 500 });
  }
}