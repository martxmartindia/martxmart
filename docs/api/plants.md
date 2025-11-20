# Plants API

The Plants API manages industrial plant and machinery catalog.

## Base URL
```
/api/plants
```

## Endpoints

### Get Plant Categories
```http
GET /api/plants/categories
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat_123",
        "name": "Food Processing Plants",
        "slug": "food-processing-plants",
        "description": "Complete food processing plant setups",
        "imageUrl": "food-plant.jpg",
        "plantCount": 25
      }
    ]
  }
}
```

### Get Plants
```http
GET /api/plants
```

**Query Parameters:**
- `categoryId` (string) - Filter by category
- `minPrice` (number) - Minimum price
- `maxPrice` (number) - Maximum price
- `capacity` (string) - Filter by capacity

**Response:**
```json
{
  "success": true,
  "data": {
    "plants": [
      {
        "id": "plant_123",
        "name": "Rice Mill Plant",
        "slug": "rice-mill-plant",
        "description": "Complete rice processing plant",
        "capacity": "1000 kg/hour",
        "powerConsumption": "50 HP",
        "price": 2500000.00,
        "imageUrl": "rice-mill.jpg",
        "specifications": ["Automatic operation", "High efficiency"],
        "category": {
          "name": "Food Processing Plants"
        }
      }
    ]
  }
}
```

### Get Plant Details
```http
GET /api/plants/{slug}
```

### Create Plant (Admin)
```http
POST /api/plants
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "Rice Mill Plant",
  "description": "Complete rice processing plant",
  "plantCategoryId": "cat_123",
  "capacity": "1000 kg/hour",
  "powerConsumption": "50 HP",
  "price": 2500000.00,
  "specifications": ["Automatic operation", "High efficiency"]
}
```

## Error Codes
- `PLANT_001` - Plant not found
- `PLANT_002` - Invalid category
- `PLANT_003` - Invalid specifications