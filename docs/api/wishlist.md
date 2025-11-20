# Wishlist API

The Wishlist API manages user wishlist for both products and shopping items.

## Base URL
```
/api/wishlist
```

## Endpoints

### Get Wishlist
```http
GET /api/wishlist
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "wishlist": [
      {
        "id": "wish_123",
        "productId": "prod_123",
        "product": {
          "name": "CNC Lathe Machine",
          "price": 250000.00,
          "images": ["image1.jpg"],
          "stock": 5
        },
        "addedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 8
    }
  }
}
```

### Add to Wishlist
```http
POST /api/wishlist
```

**Request Body:**
```json
{
  "productId": "prod_123"
}
```

### Remove from Wishlist
```http
DELETE /api/wishlist/{id}
```

### Move to Cart
```http
POST /api/wishlist/{id}/move-to-cart
```

**Request Body:**
```json
{
  "quantity": 1
}
```

### Clear Wishlist
```http
DELETE /api/wishlist
```

## Error Codes
- `WISH_001` - Item not found in wishlist
- `WISH_002` - Product already in wishlist
- `WISH_003` - Product not available