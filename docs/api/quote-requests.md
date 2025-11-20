# Quote Requests API

The Quote Requests API manages customer quote requests and vendor responses.

## Base URL
```
/api/quote-requests
```

## Endpoints

### Submit Quote Request
```http
POST /api/quote-requests
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "company": "Doe Industries",
  "productCategory": "CNC Machines",
  "productName": "CNC Lathe Machine",
  "quantity": "2 units",
  "requirements": "High precision machining requirements",
  "budget": "20-25 lakhs",
  "timeframe": "Within 2 months",
  "contactPreference": "EMAIL"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "qr_123",
    "fullName": "John Doe",
    "email": "john@example.com",
    "productName": "CNC Lathe Machine",
    "status": "PENDING",
    "createdAt": "2024-01-20T10:30:00Z"
  },
  "message": "Quote request submitted successfully"
}
```

### Get Quote Requests (Admin/Vendor)
```http
GET /api/quote-requests
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (string) - Filter by status
- `category` (string) - Filter by product category
- `page` (number) - Page number

### Get Quote Request Details
```http
GET /api/quote-requests/{id}
```

### Submit Vendor Quote
```http
POST /api/quote-requests/{id}/quotes
```

**Headers:**
```
Authorization: Bearer <vendor-token>
```

**Request Body:**
```json
{
  "price": 2200000.00,
  "description": "High precision CNC lathe with advanced features",
  "deliveryTime": "45-60 days",
  "specifications": "Detailed technical specifications"
}
```

### Get Vendor Quotes
```http
GET /api/quote-requests/{id}/quotes
```

## Quote Request Status
- `PENDING` - Request submitted
- `REVIEWING` - Under review
- `MATCHED` - Vendors matched
- `COMPLETED` - Quote provided
- `CANCELLED` - Request cancelled

## Error Codes
- `QR_001` - Quote request not found
- `QR_002` - Already quoted by vendor
- `QR_003` - Invalid quote data