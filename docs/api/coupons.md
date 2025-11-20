# Coupons API

The Coupons API manages discount coupons and promotional codes.

## Base URL
```
/api/coupons
```

## Endpoints

### Get Available Coupons
```http
GET /api/coupons
```

**Query Parameters:**
- `isActive` (boolean) - Filter active coupons
- `category` (string) - Filter by category

**Response:**
```json
{
  "success": true,
  "data": {
    "coupons": [
      {
        "id": "coup_123",
        "code": "SAVE20",
        "discount": 20.0,
        "discountType": "PERCENTAGE",
        "minOrderValue": 10000.00,
        "maxDiscount": 5000.00,
        "isActive": true,
        "expiresAt": "2024-12-31T23:59:59Z",
        "usageLimit": 1000,
        "usedCount": 245,
        "description": "Get 20% off on all products"
      }
    ]
  }
}
```

### Validate Coupon
```http
POST /api/coupons/validate
```

**Request Body:**
```json
{
  "code": "SAVE20",
  "orderValue": 25000.00,
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "coupon": {
      "code": "SAVE20",
      "discount": 20.0,
      "discountType": "PERCENTAGE",
      "discountAmount": 5000.00
    }
  }
}
```

### Apply Coupon
```http
POST /api/coupons/apply
```

**Request Body:**
```json
{
  "code": "SAVE20",
  "cartId": "cart_123"
}
```

### Create Coupon (Admin)
```http
POST /api/coupons
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "code": "NEWUSER10",
  "discount": 10.0,
  "discountType": "PERCENTAGE",
  "minOrderValue": 5000.00,
  "maxDiscount": 1000.00,
  "expiresAt": "2024-12-31T23:59:59Z",
  "usageLimit": 500,
  "description": "10% off for new users"
}
```

### Update Coupon (Admin)
```http
PUT /api/coupons/{id}
```

### Delete Coupon (Admin)
```http
DELETE /api/coupons/{id}
```

## Discount Types
- `PERCENTAGE` - Percentage discount
- `FIXED` - Fixed amount discount

## Error Codes
- `COUP_001` - Coupon not found
- `COUP_002` - Coupon expired
- `COUP_003` - Coupon usage limit exceeded
- `COUP_004` - Minimum order value not met
- `COUP_005` - Coupon already used by user