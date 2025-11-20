# Products API

The Products API manages industrial machinery and equipment catalog.

## Base URL
```
/api/products
```

## Endpoints

### Get All Products
Retrieve paginated list of products with filtering and sorting.

```http
GET /api/products
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20, max: 100)
- `category` (string) - Filter by category ID
- `brand` (string) - Filter by brand
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `featured` (boolean) - Filter featured products
- `inStock` (boolean) - Filter products in stock
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
        "id": "prod_123",
        "name": "CNC Lathe Machine",
        "slug": "cnc-lathe-machine",
        "description": "High precision CNC lathe machine",
        "price": 250000.00,
        "originalPrice": 300000.00,
        "stock": 5,
        "featured": true,
        "images": ["image1.jpg", "image2.jpg"],
        "brand": "TechMach",
        "modelNumber": "TM-CNC-2024",
        "hsnCode": "84591000",
        "category": {
          "id": "cat_123",
          "name": "CNC Machines"
        },
        "averageRating": 4.5,
        "reviewCount": 12,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Get Product by ID
Retrieve detailed product information.

```http
GET /api/products/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod_123",
    "name": "CNC Lathe Machine",
    "slug": "cnc-lathe-machine",
    "description": "High precision CNC lathe machine for industrial use",
    "price": 250000.00,
    "originalPrice": 300000.00,
    "stock": 5,
    "featured": true,
    "images": ["image1.jpg", "image2.jpg"],
    "videoUrl": "video.mp4",
    "brand": "TechMach",
    "modelNumber": "TM-CNC-2024",
    "productType": "CNC Machine",
    "hsnCode": "84591000",
    "gstPercentage": 18.0,
    "capacity": "1000 kg/h",
    "powerConsumption": "5 kW",
    "material": "Stainless Steel",
    "automation": "Fully Automatic",
    "dimensions": "200x100x150 cm",
    "weight": 2500.0,
    "certifications": ["ISO 9001", "CE"],
    "warranty": "2 Years",
    "warrantyDetails": "Comprehensive warranty coverage",
    "returnPolicy": "30 days return policy",
    "afterSalesService": "On-site Support",
    "industryType": ["Manufacturing", "Automotive"],
    "applications": ["Metal cutting", "Precision machining"],
    "accessories": ["Tool holder", "Chuck"],
    "installationRequired": true,
    "documentationLinks": ["manual.pdf", "specs.pdf"],
    "manufacturer": "TechMach Industries",
    "madeIn": "Germany",
    "specifications": "Detailed technical specifications",
    "discount": 16.67,
    "discountType": "PERCENTAGE",
    "discountStartDate": "2024-01-01T00:00:00Z",
    "discountEndDate": "2024-12-31T23:59:59Z",
    "shippingCharges": 5000.00,
    "minimumOrderQuantity": 1,
    "deliveryTime": "15-20 days",
    "category": {
      "id": "cat_123",
      "name": "CNC Machines",
      "type": "MACHINE"
    },
    "averageRating": 4.5,
    "reviewCount": 12,
    "reviews": [
      {
        "id": "rev_123",
        "rating": 5,
        "comment": "Excellent machine quality",
        "user": {
          "name": "John Doe"
        },
        "createdAt": "2024-01-10T10:30:00Z"
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T15:45:00Z"
  }
}
```

### Create Product
Create a new product (Vendor/Admin only).

```http
POST /api/products
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "CNC Lathe Machine",
  "description": "High precision CNC lathe machine",
  "price": 250000.00,
  "originalPrice": 300000.00,
  "stock": 5,
  "categoryId": "cat_123",
  "brand": "TechMach",
  "modelNumber": "TM-CNC-2024",
  "hsnCode": "84591000",
  "gstPercentage": 18.0,
  "images": ["image1.jpg", "image2.jpg"],
  "capacity": "1000 kg/h",
  "powerConsumption": "5 kW",
  "material": "Stainless Steel",
  "automation": "Fully Automatic",
  "dimensions": "200x100x150 cm",
  "weight": 2500.0,
  "certifications": ["ISO 9001", "CE"],
  "warranty": "2 Years",
  "industryType": ["Manufacturing", "Automotive"],
  "applications": ["Metal cutting", "Precision machining"],
  "manufacturer": "TechMach Industries",
  "madeIn": "Germany"
}
```

### Update Product
Update existing product (Vendor/Admin only).

```http
PUT /api/products/{id}
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Delete Product
Soft delete a product (Vendor/Admin only).

```http
DELETE /api/products/{id}
```

**Headers:**
```
Authorization: Bearer <token>
```

### Get Product Reviews
Get reviews for a specific product.

```http
GET /api/products/{id}/reviews
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `rating` (number) - Filter by rating (1-5)

### Add Product Review
Add a review for a product (Customer only).

```http
POST /api/products/{id}/reviews
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent machine quality and performance"
}
```

### Get Related Products
Get products related to a specific product.

```http
GET /api/products/{id}/related
```

**Query Parameters:**
- `limit` (number) - Number of related products (default: 10)

### Bulk Update Products
Update multiple products at once (Admin only).

```http
PUT /api/products/bulk
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productIds": ["prod_123", "prod_456"],
  "updates": {
    "featured": true,
    "discount": 10
  }
}
```

### Get Product Analytics
Get analytics data for products (Vendor/Admin only).

```http
GET /api/products/analytics
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (string) - Time period (day, week, month, year)
- `productId` (string) - Specific product ID (optional)

## Product Specifications

### Discount Types
- `PERCENTAGE` - Percentage discount
- `FIXED` - Fixed amount discount

### Industry Types
- Manufacturing
- Automotive
- Textile
- Food Processing
- Chemical
- Pharmaceutical
- Construction

### Automation Levels
- Manual
- Semi-Automatic
- Fully Automatic
- CNC Controlled

## Error Codes
- `PROD_001` - Product not found
- `PROD_002` - Insufficient stock
- `PROD_003` - Invalid category
- `PROD_004` - Unauthorized access
- `PROD_005` - Invalid price range
- `PROD_006` - Missing required fields
- `PROD_007` - Invalid HSN code
- `PROD_008` - Image upload failed
- `PROD_009` - Product already exists
- `PROD_010` - Invalid specifications