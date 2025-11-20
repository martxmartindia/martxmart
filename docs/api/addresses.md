# Addresses API

The Addresses API manages user addresses for shipping and billing.

## Base URL
```
/api/addresses
```

## Endpoints

### Get User Addresses
```http
GET /api/addresses
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
    "addresses": [
      {
        "id": "addr_123",
        "type": "HOME",
        "contactName": "John Doe",
        "phone": "+1234567890",
        "email": "john@example.com",
        "addressLine1": "123 Main Street",
        "addressLine2": "Apartment 4B",
        "city": "Mumbai",
        "state": "Maharashtra",
        "zip": "400001",
        "placeOfSupply": "Maharashtra",
        "isDefault": true,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Add Address
```http
POST /api/addresses
```

**Request Body:**
```json
{
  "type": "OFFICE",
  "contactName": "John Doe",
  "phone": "+1234567890",
  "addressLine1": "456 Business Park",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zip": "400002",
  "isDefault": false
}
```

### Update Address
```http
PUT /api/addresses/{id}
```

### Delete Address
```http
DELETE /api/addresses/{id}
```

### Set Default Address
```http
PUT /api/addresses/{id}/default
```

## Address Types
- `HOME` - Home address
- `OFFICE` - Office address
- `OTHER` - Other address type

## Error Codes
- `ADDR_001` - Address not found
- `ADDR_002` - Cannot delete default address
- `ADDR_003` - Invalid address format