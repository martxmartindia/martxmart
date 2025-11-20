# Categories API

The Categories API manages product categories for both machines and shopping products.

## Base URL
```
/api/categories
```

## Endpoints

### Get All Categories
Retrieve hierarchical list of categories.

```http
GET /api/categories
```

**Query Parameters:**
- `type` (string) - Filter by category type (MACHINE, SHOP)
- `parentId` (string) - Get subcategories of a parent
- `isFestival` (boolean) - Filter festival categories
- `festivalType` (string) - Filter by festival type
- `includeCount` (boolean) - Include product count (default: false)

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat_123",
        "name": "Industrial Machinery",
        "slug": "industrial-machinery",
        "type": "MACHINE",
        "parentId": null,
        "productCount": 150,
        "subcategories": [
          {
            "id": "cat_124",
            "name": "CNC Machines",
            "slug": "cnc-machines",
            "type": "MACHINE",
            "parentId": "cat_123",
            "productCount": 45
          },
          {
            "id": "cat_125",
            "name": "Lathe Machines",
            "slug": "lathe-machines",
            "type": "MACHINE",
            "parentId": "cat_123",
            "productCount": 32
          }
        ],
        "createdAt": "2024-01-15T10:30:00Z"
      },
      {
        "id": "cat_456",
        "name": "Fashion & Apparel",
        "slug": "fashion-apparel",
        "type": "SHOP",
        "parentId": null,
        "isFestival": true,
        "festivalType": "Diwali",
        "productCount": 280,
        "subcategories": [
          {
            "id": "cat_457",
            "name": "Traditional Wear",
            "slug": "traditional-wear",
            "type": "SHOP",
            "parentId": "cat_456",
            "productCount": 120
          }
        ]
      }
    ]
  }
}
```

### Get Category by ID
Retrieve detailed category information.

```http
GET /api/categories/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cat_123",
    "name": "Industrial Machinery",
    "slug": "industrial-machinery",
    "type": "MACHINE",
    "parentId": null,
    "parent": null,
    "isFestival": false,
    "festivalType": null,
    "productCount": 150,
    "subcategories": [
      {
        "id": "cat_124",
        "name": "CNC Machines",
        "slug": "cnc-machines",
        "productCount": 45
      }
    ],
    "breadcrumb": [
      {
        "id": "cat_123",
        "name": "Industrial Machinery",
        "slug": "industrial-machinery"
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T15:45:00Z"
  }
}
```

### Get Category by Slug
Retrieve category by URL slug.

```http
GET /api/categories/slug/{slug}
```

**Response:** Same as Get Category by ID

### Create Category
Create a new category (Admin only).

```http
POST /api/categories
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Food Processing Machines",
  "slug": "food-processing-machines",
  "type": "MACHINE",
  "parentId": "cat_123",
  "isFestival": false,
  "festivalType": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cat_789",
    "name": "Food Processing Machines",
    "slug": "food-processing-machines",
    "type": "MACHINE",
    "parentId": "cat_123",
    "createdAt": "2024-01-21T10:30:00Z"
  },
  "message": "Category created successfully"
}
```

### Update Category
Update existing category (Admin only).

```http
PUT /api/categories/{id}
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Advanced Food Processing Machines",
  "slug": "advanced-food-processing-machines"
}
```

### Delete Category
Soft delete a category (Admin only).

```http
DELETE /api/categories/{id}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

### Get Category Products
Get products in a specific category.

```http
GET /api/categories/{id}/products
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20)
- `sort` (string) - Sort field (price, name, createdAt, rating)
- `order` (string) - Sort order (asc, desc)
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `brand` (string) - Filter by brand
- `featured` (boolean) - Filter featured products

**Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      "id": "cat_123",
      "name": "Industrial Machinery",
      "type": "MACHINE"
    },
    "products": [
      {
        "id": "prod_123",
        "name": "CNC Lathe Machine",
        "price": 250000.00,
        "originalPrice": 300000.00,
        "images": ["image1.jpg"],
        "brand": "TechMach",
        "featured": true,
        "averageRating": 4.5,
        "reviewCount": 12
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    },
    "filters": {
      "priceRange": {
        "min": 50000.00,
        "max": 5000000.00
      },
      "brands": ["TechMach", "IndusMach", "ProMach"],
      "subcategories": [
        {
          "id": "cat_124",
          "name": "CNC Machines",
          "productCount": 45
        }
      ]
    }
  }
}
```

### Get Festival Categories
Get categories for specific festivals.

```http
GET /api/categories/festival
```

**Query Parameters:**
- `festivalType` (string) - Filter by festival type
- `type` (string) - Filter by category type (MACHINE, SHOP)

**Response:**
```json
{
  "success": true,
  "data": {
    "festivals": [
      {
        "name": "Diwali",
        "categories": [
          {
            "id": "cat_456",
            "name": "Traditional Wear",
            "productCount": 120,
            "image": "traditional_wear.jpg"
          },
          {
            "id": "cat_457",
            "name": "Home Decor",
            "productCount": 85,
            "image": "home_decor.jpg"
          }
        ]
      }
    ]
  }
}
```

### Get Popular Categories
Get most popular categories based on product views/sales.

```http
GET /api/categories/popular
```

**Query Parameters:**
- `type` (string) - Filter by category type
- `limit` (number) - Number of categories (default: 10)
- `period` (string) - Time period (week, month, year)

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat_123",
        "name": "CNC Machines",
        "type": "MACHINE",
        "productCount": 45,
        "viewCount": 15420,
        "orderCount": 128,
        "image": "cnc_machines.jpg"
      }
    ]
  }
}
```

### Search Categories
Search categories by name.

```http
GET /api/categories/search
```

**Query Parameters:**
- `q` (string) - Search query
- `type` (string) - Filter by category type
- `limit` (number) - Number of results (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat_123",
        "name": "CNC Machines",
        "slug": "cnc-machines",
        "type": "MACHINE",
        "productCount": 45,
        "parent": {
          "name": "Industrial Machinery"
        }
      }
    ]
  }
}
```

### Get Category Tree
Get complete category hierarchy.

```http
GET /api/categories/tree
```

**Query Parameters:**
- `type` (string) - Filter by category type

**Response:**
```json
{
  "success": true,
  "data": {
    "tree": [
      {
        "id": "cat_123",
        "name": "Industrial Machinery",
        "type": "MACHINE",
        "children": [
          {
            "id": "cat_124",
            "name": "CNC Machines",
            "children": [
              {
                "id": "cat_125",
                "name": "Vertical CNC",
                "children": []
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### Bulk Update Categories
Update multiple categories (Admin only).

```http
PUT /api/categories/bulk
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "categoryIds": ["cat_123", "cat_456"],
  "updates": {
    "isFestival": true,
    "festivalType": "Diwali"
  }
}
```

### Get Category Analytics
Get analytics for categories (Admin only).

```http
GET /api/categories/analytics
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (string) - Time period (day, week, month, year)
- `type` (string) - Category type filter

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalCategories": 45,
      "machineCategories": 25,
      "shopCategories": 20,
      "festivalCategories": 8
    },
    "topCategories": [
      {
        "id": "cat_123",
        "name": "CNC Machines",
        "viewCount": 15420,
        "orderCount": 128,
        "revenue": 2500000.00
      }
    ],
    "growth": {
      "newCategories": 3,
      "growthRate": 12.5
    }
  }
}
```

## Category Types

### Machine Categories (type: MACHINE)
Categories for industrial machinery and equipment:
- Industrial Machinery
- CNC Machines
- Lathe Machines
- Milling Machines
- Food Processing Equipment
- Textile Machinery
- Construction Equipment

### Shopping Categories (type: SHOP)
Categories for general consumer products:
- Fashion & Apparel
- Home & Kitchen
- Electronics
- Books & Media
- Sports & Fitness
- Health & Beauty
- Groceries & Food

## Festival Categories

### Supported Festivals
- **Diwali** - Traditional wear, decorations, sweets, gifts
- **Holi** - Colors, water guns, traditional clothing
- **Eid** - Traditional wear, sweets, gifts, decorations
- **Christmas** - Decorations, gifts, cakes, clothing
- **Chhath** - Puja items, traditional wear, offerings
- **Durga Puja** - Decorations, traditional wear, accessories
- **Karva Chauth** - Puja items, jewelry, traditional wear

## Category Hierarchy

### Structure
```
Root Category
├── Subcategory 1
│   ├── Sub-subcategory 1.1
│   └── Sub-subcategory 1.2
└── Subcategory 2
    ├── Sub-subcategory 2.1
    └── Sub-subcategory 2.2
```

### Maximum Depth
Categories support up to 4 levels of nesting for better organization.

## Error Codes
- `CAT_001` - Category not found
- `CAT_002` - Invalid category type
- `CAT_003` - Category name already exists
- `CAT_004` - Invalid parent category
- `CAT_005` - Cannot delete category with products
- `CAT_006` - Maximum nesting level exceeded
- `CAT_007` - Circular reference detected
- `CAT_008` - Invalid slug format
- `CAT_009` - Festival type not supported
- `CAT_010` - Unauthorized access