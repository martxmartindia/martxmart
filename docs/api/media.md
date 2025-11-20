# Media API

The Media API manages press releases, news articles, and media kits.

## Base URL
```
/api/media
```

## Endpoints

### Get Press Releases
```http
GET /api/media/press-releases
```

**Query Parameters:**
- `category` (string) - Filter by category
- `year` (number) - Filter by year
- `page` (number) - Page number

**Response:**
```json
{
  "success": true,
  "data": {
    "pressReleases": [
      {
        "id": "pr_123",
        "title": "martXmart Launches New B2B Platform",
        "slug": "martxmart-launches-new-b2b-platform",
        "date": "2024-01-20T00:00:00Z",
        "excerpt": "Revolutionary platform for industrial machinery",
        "category": "Product Launch",
        "image": "press-release.jpg"
      }
    ]
  }
}
```

### Get Press Release
```http
GET /api/media/press-releases/{slug}
```

### Get News Articles
```http
GET /api/media/news
```

**Response:**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "news_123",
        "title": "Industry Growth in Manufacturing Sector",
        "date": "2024-01-20T00:00:00Z",
        "source": "Business Today",
        "excerpt": "Manufacturing sector shows strong growth",
        "image": "news-image.jpg",
        "link": "https://external-news-link.com"
      }
    ]
  }
}
```

### Get Media Kits
```http
GET /api/media/kits
```

**Response:**
```json
{
  "success": true,
  "data": {
    "mediaKits": [
      {
        "id": "kit_123",
        "title": "Company Logo Pack",
        "description": "Official logos in various formats",
        "fileType": "ZIP",
        "fileSize": "2.5 MB",
        "filePath": "media-kit.zip"
      }
    ]
  }
}
```

### Download Media Kit
```http
GET /api/media/kits/{id}/download
```

### Create Press Release (Admin)
```http
POST /api/media/press-releases
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "title": "New Product Launch",
  "content": "Full press release content...",
  "excerpt": "Brief description",
  "category": "Product Launch",
  "image": "image.jpg"
}
```

## Media Categories
- Product Launch
- Company News
- Industry Updates
- Awards & Recognition
- Partnership Announcements

## Error Codes
- `MED_001` - Media item not found
- `MED_002` - File download failed
- `MED_003` - Invalid media format
- `MED_004` - Access denied