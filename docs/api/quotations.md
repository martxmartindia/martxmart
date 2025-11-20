# Quotations API

The Quotations API manages quote requests, quotation generation, and quote management for industrial machinery.

## Base URL
```
/api/quotations
```

## Endpoints

### Create Quotation Request
Submit a quotation request for products.

```http
POST /api/quotations
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "addressId": "addr_123",
  "items": [
    {
      "productId": "prod_123",
      "quantity": 2,
      "specifications": "Custom specifications required"
    },
    {
      "productId": "prod_456",
      "quantity": 1,
      "specifications": "Standard configuration"
    }
  ],
  "notes": "Urgent requirement for manufacturing setup",
  "validity": "2024-02-15T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "quot_123",
    "userId": "user_123",
    "status": "PENDING",
    "subtotal": 0.00,
    "tax": 0.00,
    "total": 0.00,
    "validity": "2024-02-15T23:59:59Z",
    "items": [
      {
        "id": "item_123",
        "productId": "prod_123",
        "name": "CNC Lathe Machine",
        "quantity": 2,
        "price": 0.00,
        "total": 0.00,
        "hsnCode": "84591000",
        "specifications": "Custom specifications required",
        "product": {
          "name": "CNC Lathe Machine",
          "images": ["image1.jpg"],
          "brand": "TechMach"
        }
      }
    ],
    "address": {
      "contactName": "John Doe",
      "addressLine1": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zip": "400001"
    },
    "createdAt": "2024-01-21T10:30:00Z"
  },
  "message": "Quotation request submitted successfully"
}
```

### Get User Quotations
Retrieve quotations for authenticated user.

```http
GET /api/quotations
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20)
- `status` (string) - Filter by quotation status
- `dateFrom` (string) - Date range filter
- `dateTo` (string) - Date range filter

**Response:**
```json
{
  "success": true,
  "data": {
    "quotations": [
      {
        "id": "quot_123",
        "status": "QUOTED",
        "subtotal": 500000.00,
        "tax": 90000.00,
        "total": 590000.00,
        "validity": "2024-02-15T23:59:59Z",
        "itemCount": 3,
        "createdAt": "2024-01-21T10:30:00Z",
        "quotedAt": "2024-01-22T14:20:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 8,
      "pages": 1
    }
  }
}
```

### Get Quotation by ID
Retrieve detailed quotation information.

```http
GET /api/quotations/{id}
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
    "id": "quot_123",
    "userId": "user_123",
    "status": "QUOTED",
    "subtotal": 500000.00,
    "tax": 90000.00,
    "total": 590000.00,
    "validity": "2024-02-15T23:59:59Z",
    "notes": "Urgent requirement for manufacturing setup",
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "address": {
      "contactName": "John Doe",
      "phone": "+1234567890",
      "addressLine1": "123 Main Street",
      "addressLine2": "Industrial Area",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zip": "400001",
      "placeOfSupply": "Maharashtra"
    },
    "items": [
      {
        "id": "item_123",
        "productId": "prod_123",
        "name": "CNC Lathe Machine",
        "quantity": 2,
        "price": 250000.00,
        "total": 500000.00,
        "hsnCode": "84591000",
        "specifications": "Custom specifications required",
        "product": {
          "name": "CNC Lathe Machine",
          "images": ["image1.jpg"],
          "brand": "TechMach",
          "modelNumber": "TM-CNC-2024"
        }
      }
    ],
    "createdAt": "2024-01-21T10:30:00Z",
    "quotedAt": "2024-01-22T14:20:00Z",
    "updatedAt": "2024-01-22T14:20:00Z"
  }
}
```

### Update Quotation
Update quotation with pricing (Vendor/Admin only).

```http
PUT /api/quotations/{id}
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "id": "item_123",
      "price": 250000.00,
      "specifications": "Updated specifications with custom features"
    }
  ],
  "validity": "2024-02-20T23:59:59Z",
  "notes": "Special pricing for bulk order",
  "termsAndConditions": "Payment: 50% advance, 50% on delivery"
}
```

### Accept Quotation
Accept a quotation and convert to order.

```http
POST /api/quotations/{id}/accept
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "paymentMethod": "RAZORPAY",
  "shippingAddressId": "addr_123",
  "billingAddressId": "addr_124"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_456",
    "orderNumber": "ORD-2024-001235",
    "quotationId": "quot_123",
    "totalAmount": 590000.00,
    "paymentDetails": {
      "razorpayOrderId": "order_razorpay_456",
      "amount": 590000.00,
      "currency": "INR"
    }
  },
  "message": "Quotation accepted and order created successfully"
}
```

### Reject Quotation
Reject a quotation with reason.

```http
POST /api/quotations/{id}/reject
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "Price too high",
  "feedback": "Looking for more competitive pricing"
}
```

### Download Quotation PDF
Generate and download quotation PDF.

```http
GET /api/quotations/{id}/pdf
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
    "pdfUrl": "https://cdn.martxmart.com/quotations/QUOT-2024-001234.pdf",
    "quotationNumber": "QUOT-2024-001234",
    "generatedAt": "2024-01-22T15:30:00Z"
  }
}
```

### Get Vendor Quotations
Get quotations for vendor's products (Vendor only).

```http
GET /api/quotations/vendor
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `status` (string) - Filter by status
- `productId` (string) - Filter by product

**Response:**
```json
{
  "success": true,
  "data": {
    "quotations": [
      {
        "id": "quot_123",
        "customer": {
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "+1234567890"
        },
        "status": "PENDING",
        "itemCount": 3,
        "estimatedValue": 500000.00,
        "createdAt": "2024-01-21T10:30:00Z",
        "validity": "2024-02-15T23:59:59Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "pages": 2
    }
  }
}
```

### Get Admin Quotations
Get all quotations (Admin only).

```http
GET /api/quotations/admin
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `status` (string) - Filter by status
- `vendorId` (string) - Filter by vendor
- `customerId` (string) - Filter by customer

### Bulk Update Quotations
Update multiple quotations (Admin only).

```http
PUT /api/quotations/bulk
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quotationIds": ["quot_123", "quot_456"],
  "updates": {
    "status": "EXPIRED"
  }
}
```

### Get Quotation Analytics
Get quotation analytics (Vendor/Admin only).

```http
GET /api/quotations/analytics
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (string) - Time period (day, week, month, year)
- `vendorId` (string) - Filter by vendor (Admin only)

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalQuotations": 150,
      "pendingQuotations": 25,
      "quotedQuotations": 85,
      "acceptedQuotations": 35,
      "rejectedQuotations": 5,
      "conversionRate": 41.2
    },
    "valueAnalysis": {
      "totalQuotedValue": 15000000.00,
      "averageQuotationValue": 176470.59,
      "acceptedValue": 6200000.00,
      "conversionValue": 41.3
    },
    "trends": {
      "monthlyQuotations": [15, 18, 22, 25, 20, 28],
      "monthlyConversions": [6, 8, 9, 12, 8, 15]
    },
    "topProducts": [
      {
        "productId": "prod_123",
        "productName": "CNC Lathe Machine",
        "quotationCount": 25,
        "conversionRate": 48.0
      }
    ]
  }
}
```

## Quotation Status

### Status Values
- `PENDING` - Quotation request submitted, awaiting vendor response
- `QUOTED` - Vendor has provided pricing
- `ACCEPTED` - Customer accepted the quotation
- `REJECTED` - Customer rejected the quotation
- `EXPIRED` - Quotation validity period expired
- `CANCELLED` - Quotation cancelled by customer or vendor

### Status Flow
```
PENDING → QUOTED → ACCEPTED (converts to Order)
    ↓       ↓         ↓
CANCELLED  REJECTED  EXPIRED
```

## Quotation Components

### Items
Each quotation item includes:
- Product details
- Quantity requested
- Unit price (when quoted)
- Total price
- HSN code for tax calculation
- Custom specifications
- Delivery timeline

### Pricing
- Subtotal (sum of all item totals)
- Tax calculation (GST based on HSN codes)
- Shipping charges (if applicable)
- Discount (if any)
- Final total amount

### Terms & Conditions
- Payment terms
- Delivery timeline
- Warranty information
- Installation requirements
- After-sales service

## Error Codes
- `QUOT_001` - Quotation not found
- `QUOT_002` - Invalid quotation status
- `QUOT_003` - Quotation expired
- `QUOT_004` - Unauthorized access
- `QUOT_005` - Invalid product in quotation
- `QUOT_006` - Missing required address
- `QUOT_007` - Invalid pricing data
- `QUOT_008` - Quotation already processed
- `QUOT_009` - Cannot modify accepted quotation
- `QUOT_010` - PDF generation failed