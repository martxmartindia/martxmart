# Franchises API

The Franchises API manages franchise operations, applications, and franchise-specific business functions.

## Base URL
```
/api/franchises
```

## Endpoints

### Apply for Franchise
Submit a franchise application.

```http
POST /api/franchises/apply
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "applicantName": "Rajesh Kumar",
  "businessName": "Kumar Enterprises",
  "email": "rajesh@kumarenterprises.com",
  "phone": "+91-9876543210",
  "address": "123 Business District",
  "city": "Pune",
  "state": "Maharashtra",
  "zip": "411001",
  "investmentCapacity": 2500000.00,
  "preferredLocation": "Pune and surrounding areas",
  "businessExperience": "10 years in retail and distribution",
  "documents": ["pan_card.pdf", "bank_statement.pdf", "address_proof.pdf"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "applicationId": "app_123",
    "applicantName": "Rajesh Kumar",
    "businessName": "Kumar Enterprises",
    "status": "PENDING",
    "submittedAt": "2024-01-21T10:30:00Z",
    "estimatedReviewTime": "7-10 business days",
    "nextSteps": [
      "Document verification",
      "Business plan review",
      "Interview scheduling",
      "Territory allocation"
    ]
  },
  "message": "Franchise application submitted successfully"
}
```

### Get Franchise Application Status
Check the status of franchise application.

```http
GET /api/franchises/application/{applicationId}
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
    "id": "app_123",
    "applicantName": "Rajesh Kumar",
    "businessName": "Kumar Enterprises",
    "status": "UNDER_REVIEW",
    "submittedAt": "2024-01-21T10:30:00Z",
    "reviewedAt": null,
    "notes": "Documents under verification",
    "timeline": [
      {
        "status": "SUBMITTED",
        "timestamp": "2024-01-21T10:30:00Z",
        "description": "Application submitted successfully"
      },
      {
        "status": "DOCUMENT_VERIFICATION",
        "timestamp": "2024-01-22T09:15:00Z",
        "description": "Document verification in progress"
      }
    ],
    "requiredDocuments": [
      {
        "type": "PAN_CARD",
        "status": "VERIFIED",
        "uploadedAt": "2024-01-21T10:30:00Z"
      },
      {
        "type": "BANK_STATEMENT",
        "status": "PENDING_VERIFICATION",
        "uploadedAt": "2024-01-21T10:30:00Z"
      }
    ]
  }
}
```

### Get Franchise Dashboard
Get franchise dashboard data (Franchise Owner only).

```http
GET /api/franchises/dashboard
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
    "franchise": {
      "id": "fran_123",
      "name": "Kumar Enterprises - Pune",
      "status": "ACTIVE",
      "territory": "Pune and surrounding areas",
      "contractStartDate": "2024-01-01T00:00:00Z",
      "contractEndDate": "2026-12-31T23:59:59Z"
    },
    "overview": {
      "totalSales": 1250000.00,
      "monthlyRevenue": 185000.00,
      "totalOrders": 145,
      "activeVendors": 12,
      "totalProducts": 450,
      "commission": 106250.00,
      "commissionRate": 8.5
    },
    "recentOrders": [
      {
        "id": "order_123",
        "orderNumber": "ORD-2024-001234",
        "customerName": "John Doe",
        "amount": 25000.00,
        "status": "CONFIRMED",
        "createdAt": "2024-01-21T10:30:00Z"
      }
    ],
    "salesChart": {
      "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      "data": [120000, 145000, 165000, 180000, 175000, 185000]
    },
    "topProducts": [
      {
        "productId": "prod_123",
        "productName": "CNC Lathe Machine",
        "orderCount": 8,
        "revenue": 200000.00
      }
    ]
  }
}
```

### Get Franchise Orders
Get orders handled by the franchise.

```http
GET /api/franchises/orders
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

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order_123",
        "orderNumber": "ORD-2024-001234",
        "customer": {
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "+91-9876543210"
        },
        "totalAmount": 25000.00,
        "status": "CONFIRMED",
        "itemCount": 2,
        "commission": 2125.00,
        "createdAt": "2024-01-21T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 145,
      "pages": 8
    }
  }
}
```

### Manage Franchise Vendors
Get vendors associated with the franchise.

```http
GET /api/franchises/vendors
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `isVerified` (boolean) - Filter by verification status

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
        "contactEmail": "contact@techmach.com",
        "contactPhone": "+91-9876543210",
        "isVerified": true,
        "productCount": 25,
        "totalSales": 450000.00,
        "joinedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 12,
      "pages": 1
    }
  }
}
```

### Manage Franchise Inventory
Get inventory managed by the franchise.

```http
GET /api/franchises/inventory
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `type` (string) - Product type (PRODUCT, SHOPPING)
- `category` (string) - Filter by category
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
        "productType": "PRODUCT",
        "quantity": 3,
        "minStock": 1,
        "location": "Pune Warehouse",
        "lastUpdated": "2024-01-20T15:30:00Z",
        "status": "IN_STOCK"
      },
      {
        "id": "inv_124",
        "shoppingId": "shop_456",
        "productName": "Cotton Saree",
        "productType": "SHOPPING",
        "quantity": 2,
        "minStock": 5,
        "location": "Pune Store",
        "lastUpdated": "2024-01-19T12:15:00Z",
        "status": "LOW_STOCK"
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
Update inventory quantities.

```http
PUT /api/franchises/inventory/{inventoryId}
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 5,
  "location": "Pune Main Warehouse",
  "notes": "Stock replenished"
}
```

### Get Franchise Staff
Manage franchise staff members.

```http
GET /api/franchises/staff
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
    "staff": [
      {
        "id": "staff_123",
        "user": {
          "name": "Amit Sharma",
          "email": "amit@kumarenterprises.com",
          "phone": "+91-9876543211"
        },
        "role": "MANAGER",
        "permissions": {
          "manageOrders": true,
          "manageInventory": true,
          "manageVendors": false,
          "viewReports": true
        },
        "joinedAt": "2024-01-10T10:30:00Z"
      }
    ]
  }
}
```

### Add Staff Member
Add new staff member to franchise.

```http
POST /api/franchises/staff
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "user_456",
  "role": "SALES_EXECUTIVE",
  "permissions": {
    "manageOrders": true,
    "manageInventory": false,
    "manageVendors": false,
    "viewReports": false
  }
}
```

### Get Franchise Analytics
Get detailed franchise analytics.

```http
GET /api/franchises/analytics
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (string) - Time period (day, week, month, year)
- `metric` (string) - Specific metric focus

**Response:**
```json
{
  "success": true,
  "data": {
    "sales": {
      "totalRevenue": 1250000.00,
      "monthlyGrowth": 12.5,
      "averageOrderValue": 8620.69,
      "orderCount": 145
    },
    "commission": {
      "totalEarned": 106250.00,
      "monthlyCommission": 15725.00,
      "commissionRate": 8.5,
      "pendingPayout": 5200.00
    },
    "territory": {
      "coverage": "Pune and surrounding areas",
      "customerCount": 89,
      "vendorCount": 12,
      "marketPenetration": 15.2
    },
    "performance": {
      "customerSatisfaction": 4.3,
      "orderFulfillmentRate": 96.5,
      "averageDeliveryTime": "3.2 days",
      "returnRate": 2.1
    }
  }
}
```

### Get Commission Details
Get detailed commission breakdown.

```http
GET /api/franchises/commissions
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (string) - Time period filter
- `status` (string) - Filter by payout status

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalCommission": 106250.00,
      "paidCommission": 95000.00,
      "pendingCommission": 11250.00,
      "commissionRate": 8.5
    },
    "monthlyBreakdown": [
      {
        "month": "2024-01",
        "sales": 185000.00,
        "commission": 15725.00,
        "status": "PENDING",
        "payoutDate": "2024-02-05T00:00:00Z"
      }
    ],
    "topPerformingCategories": [
      {
        "category": "CNC Machines",
        "sales": 450000.00,
        "commission": 38250.00
      }
    ]
  }
}
```

### Submit Support Ticket
Create support ticket for franchise issues.

```http
POST /api/franchises/tickets
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "subject": "Inventory Management Issue",
  "description": "Unable to update inventory for some products",
  "priority": "HIGH",
  "category": "TECHNICAL",
  "attachments": ["screenshot.png"]
}
```

## Franchise Investment Slabs

### Investment Categories
- **BASIC** - ₹10-25 Lakhs
  - Territory: City/District level
  - Commission: 6-8%
  - Support: Basic training and support

- **PREMIUM** - ₹25-50 Lakhs
  - Territory: Multi-city/Regional
  - Commission: 8-10%
  - Support: Advanced training, marketing support

- **ENTERPRISE** - ₹50+ Lakhs
  - Territory: State/Multi-state
  - Commission: 10-12%
  - Support: Dedicated support, custom solutions

## Franchise Status

### Application Status
- `PENDING` - Application submitted
- `UNDER_REVIEW` - Application being reviewed
- `APPROVED` - Application approved
- `REJECTED` - Application rejected
- `ADDITIONAL_INFO_REQUIRED` - More information needed

### Franchise Status
- `ACTIVE` - Franchise operational
- `INACTIVE` - Franchise temporarily inactive
- `SUSPENDED` - Franchise suspended
- `TERMINATED` - Franchise agreement terminated

## Staff Roles

### Available Roles
- `MANAGER` - Full operational control
- `SALES_EXECUTIVE` - Sales and customer management
- `INVENTORY_MANAGER` - Inventory management
- `SUPPORT_AGENT` - Customer support

### Permissions
- `manageOrders` - Order processing and management
- `manageInventory` - Inventory updates and tracking
- `manageVendors` - Vendor relationship management
- `viewReports` - Access to analytics and reports
- `manageStaff` - Staff management (Manager only)

## Error Codes
- `FRAN_001` - Franchise not found
- `FRAN_002` - Unauthorized franchise access
- `FRAN_003` - Invalid franchise status
- `FRAN_004` - Territory conflict
- `FRAN_005` - Insufficient investment capacity
- `FRAN_006` - Application already exists
- `FRAN_007` - Invalid staff role
- `FRAN_008` - Commission calculation error
- `FRAN_009` - Inventory update failed
- `FRAN_010` - Document verification failed