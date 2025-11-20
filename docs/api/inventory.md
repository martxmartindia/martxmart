# Inventory API

The Inventory API manages stock levels for products and shopping items.

## Base URL
```
/api/inventory
```

## Endpoints

### Get Inventory
```http
GET /api/inventory
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `type` (string) - PRODUCT or SHOPPING
- `franchiseId` (string) - Filter by franchise
- `lowStock` (boolean) - Filter low stock items

**Response:**
```json
{
  "success": true,
  "data": {
    "inventory": [
      {
        "id": "inv_123",
        "productId": "prod_123",
        "productName": "CNC Lathe Machine",
        "quantity": 5,
        "minStock": 2,
        "location": "Main Warehouse",
        "serialNumber": "CNC001",
        "status": "IN_STOCK",
        "lastUpdated": "2024-01-20T15:30:00Z"
      }
    ],
    "summary": {
      "totalItems": 450,
      "inStock": 420,
      "lowStock": 25,
      "outOfStock": 5
    }
  }
}
```

### Update Inventory
```http
PUT /api/inventory/{id}
```

**Request Body:**
```json
{
  "quantity": 8,
  "location": "Warehouse A",
  "notes": "Stock replenished"
}
```

### Bulk Update Inventory
```http
PUT /api/inventory/bulk
```

**Request Body:**
```json
{
  "updates": [
    {
      "inventoryId": "inv_123",
      "quantity": 10
    }
  ]
}
```

### Get Low Stock Items
```http
GET /api/inventory/low-stock
```

### Get Inventory History
```http
GET /api/inventory/{id}/history
```

**Response:**
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "id": "hist_123",
        "action": "STOCK_UPDATE",
        "previousQuantity": 3,
        "newQuantity": 8,
        "reason": "Stock replenishment",
        "updatedBy": "user_123",
        "updatedAt": "2024-01-20T15:30:00Z"
      }
    ]
  }
}
```

## Inventory Status
- `IN_STOCK` - Available stock
- `LOW_STOCK` - Below minimum threshold
- `OUT_OF_STOCK` - No stock available
- `DISCONTINUED` - Product discontinued

## Error Codes
- `INV_001` - Inventory item not found
- `INV_002` - Invalid quantity
- `INV_003` - Insufficient stock
- `INV_004` - Location not found