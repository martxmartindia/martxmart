import { NextResponse } from 'next/server';
import { searchProducts } from '@/lib/search';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const query = searchParams.get('q') || '';
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '24');
    
    const filters = {
      category: searchParams.get('category'),
      brand: searchParams.get('brand'),
      minPrice: searchParams.get('minPrice') ? Number.parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number.parseFloat(searchParams.get('maxPrice')!) : undefined,
      sort: searchParams.get('sort') || 'newest',
    };

    const result = await searchProducts(query, filters, page, limit);

    return NextResponse.json({
      products: result.products,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
      filters: { brands: result.brands },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}