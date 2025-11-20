# Reviews API

The Reviews API manages product reviews and ratings.

## Base URL
```
/api/reviews
```

## Endpoints

### Get Product Reviews
```http
GET /api/reviews/product/{productId}
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `rating` (number) - Filter by rating

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "rev_123",
        "rating": 5,
        "comment": "Excellent product quality",
        "user": {
          "name": "John Doe"
        },
        "createdAt": "2024-01-20T14:30:00Z"
      }
    ],
    "summary": {
      "averageRating": 4.5,
      "totalReviews": 12,
      "ratingDistribution": {
        "5": 8,
        "4": 3,
        "3": 1,
        "2": 0,
        "1": 0
      }
    }
  }
}
```

### Add Review
```http
POST /api/reviews
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "prod_123",
  "rating": 5,
  "comment": "Excellent machine quality and performance"
}
```

### Update Review
```http
PUT /api/reviews/{id}
```

### Delete Review
```http
DELETE /api/reviews/{id}
```

### Get User Reviews
```http
GET /api/reviews/user
```

**Headers:**
```
Authorization: Bearer <token>
```

## Error Codes
- `REV_001` - Review not found
- `REV_002` - Cannot review own product
- `REV_003` - Already reviewed this product
- `REV_004` - Must purchase to review