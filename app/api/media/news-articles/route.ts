import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// GET /api/media/news-articles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const newsArticles = await prisma.newsArticle.findMany({
      where: {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
          { source: { contains: search, mode: 'insensitive' } },
        ],
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(newsArticles);
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    );
  }
}

// POST /api/media/news-articles
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newsArticle = await prisma.newsArticle.create({
      data: {
        title: data.title,
        date: new Date(data.date),
        source: data.source,
        excerpt: data.excerpt,
        image: data.image,
        link: data.link,
      },
    });

    return NextResponse.json(newsArticle);
  } catch (error) {
    console.error('Error creating news article:', error);
    return NextResponse.json(
      { error: 'Failed to create news article' },
      { status: 500 }
    );
  }
}