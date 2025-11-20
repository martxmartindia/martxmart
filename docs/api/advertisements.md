# Advertisements API

The Advertisements API manages promotional banners and advertisements.

## Base URL
```
/api/advertisements
```

## Endpoints

### Get Active Advertisements
```http
GET /api/advertisements
```

**Query Parameters:**
- `isActive` (boolean) - Filter active ads
- `priority` (number) - Filter by priority

**Response:**
```json
{
  "success": true,
  "data": {
    "advertisements": [
      {
        "id": "ad_123",
        "name": "New Year Sale",
        "image": "new-year-banner.jpg",
        "offer": "50% OFF",
        "offerExpiry": "31st January 2024",
        "benefits": ["Free shipping", "Extended warranty"],
        "link": "/sale/new-year",
        "bgColor": "bg-red-500",
        "hoverColor": "hover:bg-red-600",
        "isActive": true,
        "priority": 1
      }
    ]
  }
}
```

### Create Advertisement (Admin)
```http
POST /api/advertisements
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "Summer Sale",
  "image": "summer-banner.jpg",
  "offer": "30% OFF",
  "offerExpiry": "30th June 2024",
  "benefits": ["Free delivery", "Easy returns"],
  "link": "/sale/summer",
  "bgColor": "bg-blue-500",
  "hoverColor": "hover:bg-blue-600",
  "priority": 2
}
```

### Update Advertisement (Admin)
```http
PUT /api/advertisements/{id}
```

### Delete Advertisement (Admin)
```http
DELETE /api/advertisements/{id}
```

## Error Codes
- `AD_001` - Advertisement not found
- `AD_002` - Invalid priority value
- `AD_003` - Image upload failed