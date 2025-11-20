# Shopping API

The Shopping API manages general products like clothing, groceries, and consumer goods.

## Base URL
```
/api/shopping
```

## Endpoints

### Get All Shopping Items
Retrieve paginated list of shopping products with filtering.

```http
GET /api/shopping
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20, max: 100)
- `category` (string) - Filter by category ID
- `brand` (string) - Filter by brand
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `isFeatured` (boolean) - Filter featured products
- `isFestival` (boolean) - Filter festival products
- `festivalType` (string) - Filter by festival type
- `isAvailable` (boolean) - Filter available products
- `search` (string) - Search in name and description
- `sort` (string) - Sort field (price, name, createdAt, rating)
- `order` (string) - Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "shop_123",
        "name": "Cotton Saree",
        "slug": "cotton-saree-blue",
        "description": "Beautiful handwoven cotton saree",
        "price": 1500.00,
        "originalPrice": 2000.00,
        "stock": 25,
        "images": ["saree1.jpg", "saree2.jpg"],
        "brand": "Handloom Co",
        "hsnCode": "50071000",
        "isFeatured": true,
        "isFestival": true,
        "festivalType": "Diwali",
        "attributes": {
          "color": "Blue",
          "size": "Free Size",
          "material": "Cotton",
          "pattern": "Traditional"
        },
        "category": {
          "id": "cat_456",
          "name": "Traditional Wear",
          "type": "SHOP"
        },
        "discount": 25.0,
        "discountType": "PERCENTAGE",
        "averageRating": 4.3,
        "reviewCount": 18,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 500,
      "pages": 25,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Get Shopping Item by ID
Retrieve detailed shopping product information.

```http
GET /api/shopping/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "shop_123",
    "name": "Cotton Saree",
    "slug": "cotton-saree-blue",
    "description": "Beautiful handwoven cotton saree perfect for festivals",
    "price": 1500.00,
    "originalPrice": 2000.00,
    "stock": 25,
    "images": ["saree1.jpg", "saree2.jpg", "saree3.jpg"],
    "brand": "Handloom Co",
    "hsnCode": "50071000",
    "isFeatured": true,
    "gstPercentage": 5.0,
    "isFestival": true,
    "festivalType": "Diwali",
    "attributes": {
      "color": "Blue",
      "size": "Free Size",
      "material": "Cotton",
      "pattern": "Traditional",
      "washCare": "Hand wash only",
      "occasion": "Festival, Wedding"
    },
    "expiryDate": null,
    "weight": 0.8,
    "dimensions": "5.5m x 1.2m",
    "discount": 25.0,
    "discountType": "PERCENTAGE",
    "discountStartDate": "2024-01-01T00:00:00Z",
    "discountEndDate": "2024-01-31T23:59:59Z",
    "shippingCharges": 50.00,
    "category": {
      "id": "cat_456",
      "name": "Traditional Wear",
      "type": "SHOP",
      "isFestival": true,
      "festivalType": "Diwali"
    },
    "averageRating": 4.3,
    "reviewCount": 18,
    "reviews": [
      {
        "id": "rev_456",
        "rating": 5,
        "comment": "Beautiful saree, excellent quality",
        "user": {
          "name": "Priya Sharma"
        },
        "createdAt": "2024-01-10T14:20:00Z"
      }
    ],
    "isAvailable": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T16:45:00Z"
  }
}
```

### Create Shopping Item
Create a new shopping product (Vendor/Admin only).

```http
POST /api/shopping
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Cotton Saree",
  "description": "Beautiful handwoven cotton saree",
  "price": 1500.00,
  "originalPrice": 2000.00,
  "stock": 25,
  "categoryId": "cat_456",
  "brand": "Handloom Co",
  "hsnCode": "50071000",
  "gstPercentage": 5.0,
  "images": ["saree1.jpg", "saree2.jpg"],
  "isFestival": true,
  "festivalType": "Diwali",
  "attributes": {
    "color": "Blue",
    "size": "Free Size",
    "material": "Cotton",
    "pattern": "Traditional"
  },
  "weight": 0.8,
  "dimensions": "5.5m x 1.2m",
  "shippingCharges": 50.00
}
```

### Update Shopping Item
Update existing shopping product (Vendor/Admin only).

```http
PUT /api/shopping/{id}
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Delete Shopping Item
Soft delete a shopping product (Vendor/Admin only).

```http
DELETE /api/shopping/{id}
```

**Headers:**
```
Authorization: Bearer <token>
```

### Get Festival Products
Get products for specific festivals.

```http
GET /api/shopping/festival/{festivalType}
```

**Path Parameters:**
- `festivalType` - Festival name (Diwali, Holi, Eid, Christmas, etc.)

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `category` (string) - Filter by category
- `sort` (string) - Sort field

**Response:**
```json
{
  "success": true,
  "data": {
    "festival": "Diwali",
    "products": [
      {
        "id": "shop_123",
        "name": "Diwali Decoration Set",
        "price": 899.00,
        "images": ["deco1.jpg"],
        "discount": 20.0,
        "category": {
          "name": "Home Decor"
        }
      }
    ],
    "categories": [
      {
        "id": "cat_789",
        "name": "Home Decor",
        "productCount": 45
      }
    ]
  }
}
```

### Get Featured Products
Get featured shopping products.

```http
GET /api/shopping/featured
```

**Query Parameters:**
- `limit` (number) - Number of products (default: 10)
- `category` (string) - Filter by category

### Get Products by Category
Get shopping products by category.

```http
GET /api/shopping/category/{categoryId}
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `sort` (string) - Sort field
- `order` (string) - Sort order

### Search Shopping Products
Search shopping products with advanced filters.

```http
GET /api/shopping/search
```

**Query Parameters:**
- `q` (string) - Search query
- `category` (string) - Category filter
- `brand` (string) - Brand filter
- `minPrice` (number) - Price range
- `maxPrice` (number) - Price range
- `attributes` (object) - Attribute filters
- `page` (number) - Page number
- `limit` (number) - Items per page

### Get Product Variants
Get variants of a shopping product (different colors, sizes, etc.).

```http
GET /api/shopping/{id}/variants
```

**Response:**
```json
{
  "success": true,
  "data": {
    "baseProduct": {
      "id": "shop_123",
      "name": "Cotton Saree"
    },
    "variants": [
      {
        "id": "shop_124",
        "name": "Cotton Saree - Red",
        "price": 1500.00,
        "stock": 15,
        "attributes": {
          "color": "Red"
        },
        "images": ["saree_red1.jpg"]
      },
      {
        "id": "shop_125",
        "name": "Cotton Saree - Green",
        "price": 1600.00,
        "stock": 8,
        "attributes": {
          "color": "Green"
        },
        "images": ["saree_green1.jpg"]
      }
    ]
  }
}
```

### Bulk Update Shopping Items
Update multiple shopping products (Admin only).

```http
PUT /api/shopping/bulk
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productIds": ["shop_123", "shop_456"],
  "updates": {
    "isFeatured": true,
    "discount": 15
  }
}
```

### Get Shopping Analytics
Get analytics for shopping products (Vendor/Admin only).

```http
GET /api/shopping/analytics
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (string) - Time period (day, week, month, year)
- `category` (string) - Category filter
- `festival` (string) - Festival filter

## Product Attributes

### Common Attributes
- `color` - Product color
- `size` - Product size
- `material` - Material composition
- `brand` - Brand name
- `pattern` - Design pattern
- `occasion` - Suitable occasions

### Category-Specific Attributes

#### Clothing
- `fabric` - Fabric type
- `fit` - Fit type (Regular, Slim, etc.)
- `sleeve` - Sleeve type
- `neckline` - Neckline style
- `washCare` - Washing instructions

#### Groceries
- `expiryDate` - Expiry date
- `nutritionalInfo` - Nutritional information
- `ingredients` - Ingredient list
- `allergens` - Allergen information
- `storage` - Storage instructions

#### Electronics
- `warranty` - Warranty period
- `powerConsumption` - Power consumption
- `connectivity` - Connectivity options
- `compatibility` - Device compatibility

## Festival Categories

### Supported Festivals
- **Diwali** - Lights, decorations, sweets, clothing
- **Holi** - Colors, water guns, traditional wear
- **Eid** - Traditional clothing, sweets, gifts
- **Christmas** - Decorations, gifts, cakes
- **Chhath** - Puja items, traditional wear
- **Durga Puja** - Decorations, clothing, accessories
- **Karva Chauth** - Puja items, jewelry, clothing

## Error Codes
- `SHOP_001` - Shopping item not found
- `SHOP_002` - Insufficient stock
- `SHOP_003` - Invalid category
- `SHOP_004` - Unauthorized access
- `SHOP_005` - Invalid price range
- `SHOP_006` - Missing required fields
- `SHOP_007` - Invalid HSN code
- `SHOP_008` - Image upload failed
- `SHOP_009` - Product already exists
- `SHOP_010` - Invalid attributes
- `SHOP_011` - Festival type not supported
- `SHOP_012` - Expired product
- `SHOP_013` - Invalid dimensions
- `SHOP_014` - Shipping not available