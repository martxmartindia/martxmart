import { NextRequest, NextResponse } from 'next/server';

const blogPosts = [
  {
    id: 1,
    title: 'iPhone 15 Pro vs Samsung Galaxy S24: Complete Comparison',
    slug: 'iphone-15-pro-vs-samsung-galaxy-s24',
    excerpt: 'Detailed comparison between Apple iPhone 15 Pro and Samsung Galaxy S24 Ultra to help you make the right choice.',
    content: `
# iPhone 15 Pro vs Samsung Galaxy S24: Complete Comparison

## Design and Build Quality

The iPhone 15 Pro features a premium titanium build that's both lightweight and durable. Samsung Galaxy S24 Ultra also uses titanium but with a more angular design.

## Camera Performance

### iPhone 15 Pro
- 48MP main camera with 2x telephoto
- Advanced computational photography
- Action Button for quick camera access

### Samsung Galaxy S24 Ultra
- 200MP main camera
- 100x Space Zoom
- S Pen integration for creative shots

## Performance

Both phones offer flagship-level performance with their respective chipsets:
- iPhone 15 Pro: A17 Pro chip
- Galaxy S24 Ultra: Snapdragon 8 Gen 3

## Conclusion

Choose iPhone 15 Pro for iOS ecosystem and premium build. Choose Galaxy S24 Ultra for versatility and S Pen functionality.
    `,
    author: 'Tech Team',
    publishedAt: '2024-01-15',
    category: 'comparison',
    tags: ['iPhone', 'Samsung', 'Smartphone', 'Review'],
    image: '/blog/iphone-vs-samsung.jpg',
    readTime: '8 min read',
    views: 1250,
    featured: true
  },
  {
    id: 2,
    title: 'Best Laptops Under ₹50,000 in 2024',
    slug: 'best-laptops-under-50000-2024',
    excerpt: 'Top laptop recommendations for students and professionals on a budget.',
    content: `
# Best Laptops Under ₹50,000 in 2024

## 1. Acer Aspire 5
- Intel Core i5 processor
- 8GB RAM, 512GB SSD
- 15.6" Full HD display
- Price: ₹45,990

## 2. HP Pavilion 14
- AMD Ryzen 5 processor
- 8GB RAM, 256GB SSD
- 14" display
- Price: ₹48,990

## 3. Lenovo IdeaPad 3
- Intel Core i3 processor
- 8GB RAM, 1TB HDD
- 15.6" display
- Price: ₹42,990

## Buying Tips
- Consider SSD over HDD for better performance
- 8GB RAM is minimum for smooth multitasking
- Check warranty and service support
    `,
    author: 'Laptop Expert',
    publishedAt: '2024-01-10',
    category: 'buying-guide',
    tags: ['Laptop', 'Budget', 'Student', 'Professional'],
    image: '/blog/budget-laptops.jpg',
    readTime: '6 min read',
    views: 890,
    featured: false
  },
  {
    id: 3,
    title: 'How to Choose the Right Smartphone in 2024',
    slug: 'how-to-choose-right-smartphone-2024',
    excerpt: 'Complete guide to selecting the perfect smartphone based on your needs and budget.',
    content: `
# How to Choose the Right Smartphone in 2024

## Consider Your Budget
- Under ₹15,000: Basic smartphones
- ₹15,000-₹30,000: Mid-range options
- ₹30,000-₹50,000: Premium features
- Above ₹50,000: Flagship phones

## Key Features to Consider

### Camera Quality
- Megapixel count isn't everything
- Look for optical image stabilization
- Night mode capabilities
- Video recording quality

### Performance
- Processor (Snapdragon, MediaTek, Apple A-series)
- RAM (minimum 6GB recommended)
- Storage (128GB minimum)

### Battery Life
- mAh capacity
- Fast charging support
- Wireless charging (premium phones)

### Display
- Screen size preference
- AMOLED vs LCD
- Refresh rate (90Hz/120Hz)

## Brand Considerations
- After-sales service
- Software updates
- Build quality
- Resale value

## Conclusion
Choose based on your primary use case: photography, gaming, productivity, or basic usage.
    `,
    author: 'Mobile Expert',
    publishedAt: '2024-01-05',
    category: 'guide',
    tags: ['Smartphone', 'Buying Guide', 'Tips', 'Mobile'],
    image: '/blog/smartphone-guide.jpg',
    readTime: '10 min read',
    views: 1450,
    featured: true
  },
  {
    id: 4,
    title: 'Top 5 Gaming Accessories for 2024',
    slug: 'top-gaming-accessories-2024',
    excerpt: 'Essential gaming accessories to enhance your gaming experience.',
    content: `
# Top 5 Gaming Accessories for 2024

## 1. Mechanical Gaming Keyboard
- Cherry MX switches
- RGB backlighting
- Anti-ghosting technology
- Price range: ₹3,000-₹15,000

## 2. Gaming Mouse
- High DPI sensor
- Programmable buttons
- Ergonomic design
- Price range: ₹2,000-₹8,000

## 3. Gaming Headset
- Surround sound
- Noise cancellation
- Comfortable padding
- Price range: ₹3,000-₹12,000

## 4. Gaming Monitor
- High refresh rate (144Hz+)
- Low input lag
- Good color accuracy
- Price range: ₹15,000-₹50,000

## 5. Gaming Chair
- Ergonomic design
- Lumbar support
- Adjustable height
- Price range: ₹8,000-₹25,000

## Tips for Buying
- Read reviews before purchasing
- Consider your gaming setup
- Check compatibility
- Look for warranty coverage
    `,
    author: 'Gaming Expert',
    publishedAt: '2024-01-01',
    category: 'gaming',
    tags: ['Gaming', 'Accessories', 'PC Gaming', 'Setup'],
    image: '/blog/gaming-accessories.jpg',
    readTime: '7 min read',
    views: 720,
    featured: false
  },
  {
    id: 5,
    title: 'Smart Home Setup Guide for Beginners',
    slug: 'smart-home-setup-guide-beginners',
    excerpt: 'Step-by-step guide to setting up your first smart home system.',
    content: `
# Smart Home Setup Guide for Beginners

## Getting Started
Smart home technology can seem overwhelming, but starting small is the key to success.

## Essential Smart Home Devices

### 1. Smart Speaker
- Amazon Echo or Google Nest
- Voice control hub
- Music streaming
- Price: ₹3,000-₹8,000

### 2. Smart Lights
- Philips Hue or similar
- Color changing options
- App control
- Price: ₹1,500-₹5,000 per bulb

### 3. Smart Plugs
- Control any device remotely
- Schedule on/off times
- Energy monitoring
- Price: ₹800-₹2,000 each

### 4. Smart Security Camera
- Remote monitoring
- Motion detection
- Cloud storage
- Price: ₹3,000-₹15,000

## Setup Process
1. Choose your ecosystem (Alexa, Google, Apple)
2. Start with one room
3. Add devices gradually
4. Create automation routines
5. Ensure strong Wi-Fi coverage

## Benefits
- Energy savings
- Enhanced security
- Convenience
- Remote control

## Common Mistakes to Avoid
- Buying incompatible devices
- Weak Wi-Fi network
- Overcomplicating initially
- Ignoring security settings
    `,
    author: 'Smart Home Expert',
    publishedAt: '2023-12-28',
    category: 'smart-home',
    tags: ['Smart Home', 'IoT', 'Automation', 'Beginner'],
    image: '/blog/smart-home-guide.jpg',
    readTime: '9 min read',
    views: 650,
    featured: false
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const slug = searchParams.get('slug');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get single post by slug
    if (slug) {
      const post = blogPosts.find(p => p.slug === slug);
      if (!post) {
        return NextResponse.json(
          { error: 'Blog post not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ post });
    }

    let filteredPosts = [...blogPosts];

    // Filter by category
    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(p => p.category === category);
    }

    // Filter by search term
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredPosts = filteredPosts.filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.excerpt.toLowerCase().includes(searchTerm) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by featured
    if (featured === 'true') {
      filteredPosts = filteredPosts.filter(p => p.featured);
    }

    // Sort posts
    filteredPosts.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case 'popular':
          return b.views - a.views;
        case 'title':
          return a.title.localeCompare(b.title);
        default: // newest
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return NextResponse.json({
      posts: paginatedPosts,
      total: filteredPosts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredPosts.length / limit),
      categories: [...new Set(blogPosts.map(p => p.category))],
      tags: [...new Set(blogPosts.flatMap(p => p.tags))],
    });

  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, category, tags, author } = body;

    if (!title || !content || !excerpt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    const newPost = {
      id: blogPosts.length + 1,
      title,
      slug,
      excerpt,
      content,
      author: author || 'Admin',
      publishedAt: new Date().toISOString().split('T')[0],
      category: category || 'general',
      tags: tags || [],
      image: '/blog/default.jpg',
      readTime: `${Math.ceil(content.length / 1000)} min read`,
      views: 0,
      featured: false
    };

    blogPosts.push(newPost);

    return NextResponse.json({
      message: 'Blog post created successfully',
      post: newPost
    });

  } catch (error) {
    console.error('Create blog post error:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}