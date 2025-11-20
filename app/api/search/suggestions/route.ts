import { NextResponse } from 'next/server';
import { getSearchSuggestions } from '@/lib/search';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q') || '';
    const limit = Number.parseInt(url.searchParams.get('limit') || '8');

    if (!query.trim()) {
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = await getSearchSuggestions(query, limit);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Suggestions API error:', error);
    return NextResponse.json(
      { error: 'Failed to get suggestions' },
      { status: 500 }
    );
  }
}