# Slides API

The Slides API manages hero slides and carousel content for the homepage.

## Base URL
```
/api/slides
```

## Endpoints

### Get Active Slides
```http
GET /api/slides
```

**Query Parameters:**
- `type` (string) - Filter by slide type (MACHINE, SHOP)
- `isActive` (boolean) - Filter active slides

**Response:**
```json
{
  "success": true,
  "data": {
    "slides": [
      {
        "id": 1,
        "type": "MACHINE",
        "imageorVideo": "hero-slide-1.jpg",
        "mobileImageorVideo": "hero-slide-1-mobile.jpg",
        "link": "/products/cnc-machines",
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Create Slide (Admin)
```http
POST /api/slides
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "type": "MACHINE",
  "imageorVideo": "hero-slide-new.jpg",
  "mobileImageorVideo": "hero-slide-new-mobile.jpg",
  "link": "/products/new-category",
  "isActive": true
}
```

### Update Slide (Admin)
```http
PUT /api/slides/{id}
```

### Delete Slide (Admin)
```http
DELETE /api/slides/{id}
```

## Error Codes
- `SLIDE_001` - Slide not found
- `SLIDE_002` - Invalid slide type
- `SLIDE_003` - Image upload failed