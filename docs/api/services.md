# Services API

The Services API manages business services like GST registration, MSME registration, and company incorporation.

## Base URL
```
/api/services
```

## Endpoints

### Get All Services
```http
GET /api/services
```

**Query Parameters:**
- `category` (string) - Filter by service category
- `page` (number) - Page number
- `limit` (number) - Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "serv_123",
        "title": "GST Registration",
        "slug": "gst-registration",
        "shortName": "GST REG",
        "description": "Complete GST registration service",
        "priceAmount": 2999.00,
        "governmentFee": "₹0 (for turnover < 40 lakhs)",
        "processingTime": "7-10 working days",
        "validity": "Lifetime",
        "category": "Tax Registration",
        "imageUrl": "gst-service.jpg",
        "features": ["Online application", "Document support", "Expert guidance"]
      }
    ]
  }
}
```

### Get Service Details
```http
GET /api/services/{slug}
```

### Apply for Service
```http
POST /api/services/{serviceId}/apply
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "businessName": "Doe Enterprises",
  "address": "123 Business Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "gstType": "REGULAR",
  "annualTurnover": "50 lakhs",
  "businessType": "Manufacturing"
}
```

### Get Service Applications
```http
GET /api/services/applications
```

**Headers:**
```
Authorization: Bearer <token>
```

### Create Service Order
```http
POST /api/services/{serviceId}/order
```

**Request Body:**
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+91-9876543210",
  "customerAddress": "123 Business Street",
  "paymentMethod": "RAZORPAY"
}
```

## Service Categories
- Tax Registration (GST, Professional Tax)
- Business Registration (Company, LLP, Partnership)
- Compliance (MSME, Import/Export License)
- Intellectual Property (Trademark, Copyright)
- Financial Services (Loan Assistance, Accounting)

## Application Status
- `PENDING` - Application submitted
- `IN_REVIEW` - Under review
- `APPROVED` - Application approved
- `REJECTED` - Application rejected
- `COMPLETED` - Service completed

## Error Codes
- `SERV_001` - Service not found
- `SERV_002` - Application already exists
- `SERV_003` - Invalid service data
- `SERV_004` - Payment required