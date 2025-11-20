# Blog API

The Blog API manages blog posts, categories, and comments.

## Base URL
```
/api/blog
```

## Endpoints

### Get Blog Posts
```http
GET /api/blog/posts
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `category` (string) - Filter by category
- `status` (string) - Filter by status
- `author` (string) - Filter by author

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "blog_123",
        "title": "Industrial Automation Trends 2024",
        "slug": "industrial-automation-trends-2024",
        "excerpt": "Latest trends in industrial automation...",
        "featuredImage": "automation.jpg",
        "status": "PUBLISHED",
        "author": {
          "name": "Tech Expert",
          "profileImage": "author.jpg"
        },
        "category": {
          "name": "Technology"
        },
        "viewCount": 1250,
        "likeCount": 45,
        "commentCount": 12,
        "publishedAt": "2024-01-20T10:30:00Z"
      }
    ]
  }
}
```

### Get Blog Post
```http
GET /api/blog/posts/{slug}
```

### Create Blog Post
```http
POST /api/blog/posts
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Industrial Automation Trends 2024",
  "content": "Full blog content...",
  "excerpt": "Brief description...",
  "categoryId": "cat_123",
  "featuredImage": "image.jpg",
  "tags": ["automation", "industry", "technology"],
  "status": "DRAFT"
}
```

### Get Blog Categories
```http
GET /api/blog/categories
```

### Add Comment
```http
POST /api/blog/posts/{id}/comments
```

**Request Body:**
```json
{
  "content": "Great article!",
  "parentId": null
}
```

### Like Post
```http
POST /api/blog/posts/{id}/like
```

## Blog Status
- `DRAFT` - Draft post
- `PUBLISHED` - Published post
- `ARCHIVED` - Archived post

## Error Codes
- `BLOG_001` - Post not found
- `BLOG_002` - Unauthorized to edit
- `BLOG_003` - Invalid category