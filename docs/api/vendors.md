# Vendors API

The Vendors API manages vendor profiles, applications, and vendor-specific operations.

## Base URL
```
/api/vendors
```

## Endpoints

### Get All Vendors
Retrieve paginated list of verified vendors.

```http
GET /api/vendors
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20)
- `businessType` (string) - Filter by business type
- `city` (string) - Filter by city
- `state` (string) - Filter by state
- `isVerified` (boolean) - Filter by verification status
- `search` (string) - Search in business name
- `sort` (string) - Sort field (businessName, createdAt)
- `order` (string) - Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "vendors": [
      {
        "id": "vendor_123",
        "businessName": "TechMach Industries",
        "businessType": "Manufacturer",
        "city": "Mumbai",
        "state": "Maharashtra",
        "phone": "+91-9876543210",
        "email": "contact@techmach.com",
        "website": "https://techmach.com",
        "isVerified": true,
        "productCount": 45,
        "averageRating": 4.5,
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

### Get Vendor by ID
Retrieve detailed vendor information.

```http
GET /api/vendors/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "vendor_123",
    "businessName": "TechMach Industries",
    "businessType": "Manufacturer",
    "address": "123 Industrial Area, Andheri East",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400069",
    "phone": "+91-9876543210",
    "email": "contact@techmach.com",
    "website": "https://techmach.com",
    "gstNumber": "27ABCDE1234F1Z5",
    "panNumber": "ABCDE1234F",
    "bankName": "HDFC Bank",
    "accountNumber": "12345678901234",
    "ifscCode": "HDFC0001234",
    "isVerified": true,
    "verificationData": {
      "gstVerified": true,
      "panVerified": true,
      "bankVerified": true,
      "documentsVerified": true
    },
    "user": {
      "id": "user_456",
      "name": "Rajesh Kumar",
      "email": "rajesh@techmach.com",
      "phone": "+91-9876543210"
    },
    "productCount": 45,
    "orderCount": 128,
    "averageRating": 4.5,
    "reviewCount": 67,
    "totalSales": 2500000.00,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T15:45:00Z"
  }
}
```

### Register as Vendor
Submit vendor registration application.

```http
POST /api/vendors/register
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "businessName": "TechMach Industries",
  "businessType": "Manufacturer",
  "address": "123 Industrial Area, Andheri East",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400069",
  "phone": "+91-9876543210",
  "email": "contact@techmach.com",
  "website": "https://techmach.com",
  "gstNumber": "27ABCDE1234F1Z5",
  "panNumber": "ABCDE1234F",
  "bankName": "HDFC Bank",
  "accountNumber": "12345678901234",
  "ifscCode": "HDFC0001234",
  "description": "Leading manufacturer of industrial machinery"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "applicationId": "app_123",
    "status": "PENDING",
    "businessName": "TechMach Industries",
    "submittedAt": "2024-01-15T10:30:00Z",
    "estimatedReviewTime": "3-5 business days"
  },
  "message": "Vendor application submitted successfully"
}
```

### Update Vendor Profile
Update vendor profile information (Vendor only).

```http
PUT /api/vendors/profile
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "businessName": "TechMach Industries Pvt Ltd",
  "address": "456 New Industrial Area",
  "phone": "+91-9876543211",
  "website": "https://newwebsite.com"
}
```

### Get Vendor Products
Get products listed by a specific vendor.

```http
GET /api/vendors/{id}/products
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `category` (string) - Filter by category
- `featured` (boolean) - Filter featured products
- `sort` (string) - Sort field

**Response:**
```json
{
  "success": true,
  "data": {
    "vendor": {
      "id": "vendor_123",
      "businessName": "TechMach Industries"
    },
    "products": [
      {
        "id": "prod_123",
        "name": "CNC Lathe Machine",
        "price": 250000.00,
        "stock": 5,
        "featured": true,
        "images": ["image1.jpg"],
        "category": {
          "name": "CNC Machines"
        },
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

### Get Vendor Orders
Get orders for vendor's products (Vendor only).

```http
GET /api/vendors/orders
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `status` (string) - Filter by order status
- `dateFrom` (string) - Date range filter
- `dateTo` (string) - Date range filter

### Get Vendor Dashboard
Get vendor dashboard statistics (Vendor only).

```http
GET /api/vendors/dashboard
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
    "overview": {
      "totalProducts": 45,
      "activeProducts": 42,
      "totalOrders": 128,
      "pendingOrders": 8,
      "totalSales": 2500000.00,
      "monthlyRevenue": 450000.00
    },
    "recentOrders": [
      {
        "id": "order_123",
        "orderNumber": "ORD-2024-001234",
        "customerName": "John Doe",
        "amount": 250000.00,
        "status": "CONFIRMED",
        "createdAt": "2024-01-20T10:30:00Z"
      }
    ],
    "topProducts": [
      {
        "id": "prod_123",
        "name": "CNC Lathe Machine",
        "orderCount": 15,
        "revenue": 3750000.00
      }
    ],
    "salesChart": {
      "labels": ["Jan", "Feb", "Mar", "Apr", "May"],
      "data": [150000, 200000, 180000, 220000, 250000]
    }
  }
}
```

### Upload Vendor Documents
Upload verification documents (Vendor only).

```http
POST /api/vendors/documents
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
documentType: "GST_CERTIFICATE"
file: [binary file data]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "documentId": "doc_123",
    "documentType": "GST_CERTIFICATE",
    "documentUrl": "https://cdn.martxmart.com/documents/gst_cert_123.pdf",
    "uploadedAt": "2024-01-15T10:30:00Z",
    "status": "PENDING_VERIFICATION"
  },
  "message": "Document uploaded successfully"
}
```

### Get Vendor Documents
Get uploaded documents (Vendor only).

```http
GET /api/vendors/documents
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
    "documents": [
      {
        "id": "doc_123",
        "documentType": "GST_CERTIFICATE",
        "documentUrl": "https://cdn.martxmart.com/documents/gst_cert_123.pdf",
        "isVerified": true,
        "uploadedAt": "2024-01-15T10:30:00Z",
        "verifiedAt": "2024-01-16T14:20:00Z"
      }
    ]
  }
}
```

### Get Vendor Analytics
Get detailed analytics for vendor (Vendor only).

```http
GET /api/vendors/analytics
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (string) - Time period (day, week, month, year)
- `metric` (string) - Specific metric (sales, orders, products)

### Update Order Status
Update order status for vendor's products (Vendor only).

```http
PUT /api/vendors/orders/{orderId}/status
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "SHIPPED",
  "trackingNumber": "TRK123456789",
  "notes": "Order shipped via Blue Dart"
}
```

### Get Commission Details
Get commission structure and earnings (Vendor only).

```http
GET /api/vendors/commissions
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
    "commissionRate": 8.5,
    "totalSales": 2500000.00,
    "totalCommission": 212500.00,
    "pendingCommission": 15000.00,
    "paidCommission": 197500.00,
    "monthlyBreakdown": [
      {
        "month": "2024-01",
        "sales": 450000.00,
        "commission": 38250.00,
        "status": "PAID"
      }
    ]
  }
}
```

## Business Types

### Supported Business Types
- **Manufacturer** - Direct manufacturers
- **Distributor** - Product distributors
- **Retailer** - Retail sellers
- **Wholesaler** - Wholesale suppliers
- **Importer** - Import businesses
- **Service Provider** - Service-based businesses

## Document Types

### Required Documents
- `GST_CERTIFICATE` - GST registration certificate
- `PAN_CARD` - PAN card copy
- `BANK_STATEMENT` - Bank account statement
- `BUSINESS_LICENSE` - Business license/registration
- `ADDRESS_PROOF` - Address verification document
- `IDENTITY_PROOF` - Identity verification document

### Optional Documents
- `QUALITY_CERTIFICATES` - ISO/Quality certifications
- `PRODUCT_CATALOGS` - Product catalogs
- `COMPANY_PROFILE` - Company profile document
- `TRADE_LICENSE` - Trade license

## Verification Process

### Verification Steps
1. **Document Upload** - Upload required documents
2. **Document Review** - Admin reviews documents
3. **Business Verification** - Verify business details
4. **Bank Verification** - Verify bank account
5. **Final Approval** - Complete verification process

### Verification Status
- `PENDING` - Application submitted
- `UNDER_REVIEW` - Documents being reviewed
- `ADDITIONAL_INFO_REQUIRED` - More information needed
- `APPROVED` - Vendor approved
- `REJECTED` - Application rejected

## Error Codes
- `VEN_001` - Vendor not found
- `VEN_002` - Vendor not verified
- `VEN_003` - Invalid business type
- `VEN_004` - GST number already exists
- `VEN_005` - Invalid GST number format
- `VEN_006` - PAN number already exists
- `VEN_007` - Invalid PAN number format
- `VEN_008` - Bank account verification failed
- `VEN_009` - Document upload failed
- `VEN_010` - Insufficient permissions
- `VEN_011` - Application already exists
- `VEN_012` - Invalid document type
- `VEN_013` - Document size too large
- `VEN_014` - Unsupported file format