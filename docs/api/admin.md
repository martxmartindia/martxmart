# Admin API

The Admin API provides administrative functions for platform management, user oversight, and system operations.

## Base URL
```
/api/admin
```

## Authentication
All admin endpoints require admin-level authentication:
```
Authorization: Bearer <admin-token>
```

## Endpoints

### Admin Dashboard
Get comprehensive dashboard statistics.

```http
GET /api/admin/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 15420,
      "totalVendors": 1250,
      "totalProducts": 8500,
      "totalOrders": 25600,
      "totalRevenue": 125000000.00,
      "monthlyRevenue": 8500000.00,
      "activeUsers": 3200,
      "pendingOrders": 145
    },
    "recentActivity": [
      {
        "type": "NEW_ORDER",
        "description": "New order ORD-2024-001234 placed",
        "amount": 250000.00,
        "timestamp": "2024-01-21T10:30:00Z"
      },
      {
        "type": "VENDOR_REGISTRATION",
        "description": "New vendor application from TechMach Industries",
        "timestamp": "2024-01-21T09:15:00Z"
      }
    ],
    "salesChart": {
      "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      "data": [7200000, 8100000, 7800000, 8900000, 8500000, 9200000]
    },
    "topCategories": [
      {
        "name": "CNC Machines",
        "orderCount": 450,
        "revenue": 15000000.00
      }
    ],
    "alerts": [
      {
        "type": "LOW_STOCK",
        "message": "15 products are running low on stock",
        "count": 15,
        "priority": "HIGH"
      }
    ]
  }
}
```

### User Management

#### Get All Users
Retrieve paginated list of users with filtering.

```http
GET /api/admin/users
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `role` (string) - Filter by user role
- `isVerified` (boolean) - Filter by verification status
- `isDeleted` (boolean) - Include deleted users
- `search` (string) - Search by name, email, phone
- `dateFrom` (string) - Registration date filter
- `dateTo` (string) - Registration date filter

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_123",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "role": "CUSTOMER",
        "isVerified": true,
        "isDeleted": false,
        "totalOrders": 15,
        "totalSpent": 125000.00,
        "lastLogin": "2024-01-21T09:30:00Z",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 15420,
      "pages": 309
    },
    "summary": {
      "totalUsers": 15420,
      "verifiedUsers": 14200,
      "activeUsers": 3200,
      "newUsersThisMonth": 450
    }
  }
}
```

#### Get User Details
Get detailed information about a specific user.

```http
GET /api/admin/users/{userId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "image": "avatar.jpg",
    "role": "CUSTOMER",
    "isVerified": true,
    "isDeleted": false,
    "addresses": [
      {
        "id": "addr_123",
        "type": "HOME",
        "city": "Mumbai",
        "state": "Maharashtra"
      }
    ],
    "orders": {
      "total": 15,
      "completed": 12,
      "cancelled": 2,
      "totalSpent": 125000.00
    },
    "activity": {
      "lastLogin": "2024-01-21T09:30:00Z",
      "loginCount": 145,
      "wishlistItems": 8,
      "reviewsGiven": 12
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Update User
Update user information.

```http
PUT /api/admin/users/{userId}
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "role": "VENDOR",
  "isVerified": true
}
```

#### Suspend User
Suspend a user account.

```http
POST /api/admin/users/{userId}/suspend
```

**Request Body:**
```json
{
  "reason": "Violation of terms of service",
  "duration": "30 days"
}
```

### Vendor Management

#### Get All Vendors
Retrieve list of vendors with filtering.

```http
GET /api/admin/vendors
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `isVerified` (boolean) - Filter by verification status
- `businessType` (string) - Filter by business type
- `city` (string) - Filter by city
- `state` (string) - Filter by state

#### Verify Vendor
Approve or reject vendor verification.

```http
PUT /api/admin/vendors/{vendorId}/verify
```

**Request Body:**
```json
{
  "status": "APPROVED",
  "notes": "All documents verified successfully"
}
```

### Product Management

#### Get All Products
Retrieve products with admin-specific information.

```http
GET /api/admin/products
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `category` (string) - Filter by category
- `vendor` (string) - Filter by vendor
- `status` (string) - Filter by approval status
- `featured` (boolean) - Filter featured products

#### Approve Product
Approve or reject product listing.

```http
PUT /api/admin/products/{productId}/approve
```

**Request Body:**
```json
{
  "status": "APPROVED",
  "notes": "Product meets quality standards"
}
```

#### Feature Product
Mark product as featured.

```http
PUT /api/admin/products/{productId}/feature
```

**Request Body:**
```json
{
  "featured": true,
  "featuredUntil": "2024-12-31T23:59:59Z"
}
```

### Order Management

#### Get All Orders
Retrieve orders with admin oversight.

```http
GET /api/admin/orders
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `status` (string) - Filter by order status
- `vendor` (string) - Filter by vendor
- `customer` (string) - Filter by customer
- `dateFrom` (string) - Date range filter
- `dateTo` (string) - Date range filter
- `minAmount` (number) - Minimum order amount
- `maxAmount` (number) - Maximum order amount

#### Update Order Status
Override order status (emergency situations).

```http
PUT /api/admin/orders/{orderId}/status
```

**Request Body:**
```json
{
  "status": "CANCELLED",
  "reason": "Payment dispute",
  "refundAmount": 250000.00
}
```

### Analytics & Reports

#### Get Platform Analytics
Get comprehensive platform analytics.

```http
GET /api/admin/analytics
```

**Query Parameters:**
- `period` (string) - Time period (day, week, month, year)
- `metric` (string) - Specific metric focus

**Response:**
```json
{
  "success": true,
  "data": {
    "revenue": {
      "total": 125000000.00,
      "thisMonth": 8500000.00,
      "lastMonth": 7800000.00,
      "growth": 8.97
    },
    "orders": {
      "total": 25600,
      "thisMonth": 1850,
      "averageValue": 4882.81,
      "completionRate": 94.2
    },
    "users": {
      "total": 15420,
      "active": 3200,
      "newThisMonth": 450,
      "retentionRate": 78.5
    },
    "vendors": {
      "total": 1250,
      "active": 980,
      "newThisMonth": 35,
      "averageRating": 4.3
    },
    "products": {
      "total": 8500,
      "active": 7800,
      "outOfStock": 145,
      "lowStock": 320
    }
  }
}
```

#### Generate Report
Generate custom reports.

```http
POST /api/admin/reports
```

**Request Body:**
```json
{
  "type": "SALES_REPORT",
  "period": "MONTHLY",
  "dateFrom": "2024-01-01",
  "dateTo": "2024-01-31",
  "filters": {
    "category": "CNC Machines",
    "vendor": "vendor_123"
  },
  "format": "PDF"
}
```

### System Management

#### Get System Health
Check system health and performance metrics.

```http
GET /api/admin/system/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "HEALTHY",
    "uptime": "15 days, 8 hours",
    "database": {
      "status": "CONNECTED",
      "responseTime": "12ms",
      "connections": 45
    },
    "cache": {
      "status": "ACTIVE",
      "hitRate": 89.5,
      "memoryUsage": "2.1GB"
    },
    "storage": {
      "status": "HEALTHY",
      "usedSpace": "450GB",
      "freeSpace": "1.2TB"
    },
    "services": {
      "paymentGateway": "ACTIVE",
      "emailService": "ACTIVE",
      "smsService": "ACTIVE",
      "searchEngine": "ACTIVE"
    }
  }
}
```

#### Get System Logs
Retrieve system logs for debugging.

```http
GET /api/admin/system/logs
```

**Query Parameters:**
- `level` (string) - Log level (ERROR, WARN, INFO, DEBUG)
- `service` (string) - Filter by service
- `dateFrom` (string) - Date range filter
- `dateTo` (string) - Date range filter
- `limit` (number) - Number of log entries

#### Update System Settings
Update platform-wide settings.

```http
PUT /api/admin/system/settings
```

**Request Body:**
```json
{
  "maintenanceMode": false,
  "registrationEnabled": true,
  "vendorRegistrationEnabled": true,
  "maxFileUploadSize": "10MB",
  "defaultCurrency": "INR",
  "taxSettings": {
    "gstEnabled": true,
    "defaultGstRate": 18.0
  }
}
```

### Content Management

#### Manage Hero Slides
Get and update hero slides.

```http
GET /api/admin/slides
POST /api/admin/slides
PUT /api/admin/slides/{slideId}
DELETE /api/admin/slides/{slideId}
```

#### Manage Advertisements
Control platform advertisements.

```http
GET /api/admin/advertisements
POST /api/admin/advertisements
PUT /api/admin/advertisements/{adId}
DELETE /api/admin/advertisements/{adId}
```

### Notification Management

#### Send Bulk Notifications
Send notifications to multiple users.

```http
POST /api/admin/notifications/bulk
```

**Request Body:**
```json
{
  "title": "Platform Maintenance Notice",
  "message": "Scheduled maintenance on Sunday 2-4 AM",
  "type": "SYSTEM_ANNOUNCEMENT",
  "recipients": {
    "type": "ALL_USERS",
    "filters": {
      "role": ["CUSTOMER", "VENDOR"],
      "isActive": true
    }
  },
  "channels": ["EMAIL", "PUSH", "IN_APP"]
}
```

### Financial Management

#### Get Revenue Analytics
Detailed revenue breakdown.

```http
GET /api/admin/finance/revenue
```

#### Get Commission Reports
Vendor commission tracking.

```http
GET /api/admin/finance/commissions
```

#### Process Vendor Payouts
Initiate vendor payments.

```http
POST /api/admin/finance/payouts
```

## Permission System

### Admin Roles
- `SUPER_ADMIN` - Full system access
- `ADMIN` - Standard admin operations
- `MODERATOR` - Content moderation
- `SUPPORT` - Customer support functions

### Module Permissions
Each admin can have specific permissions for:
- User Management
- Vendor Management
- Product Management
- Order Management
- Financial Operations
- System Settings
- Content Management
- Analytics Access

## Error Codes
- `ADM_001` - Insufficient admin privileges
- `ADM_002` - Invalid admin operation
- `ADM_003` - Resource not found
- `ADM_004` - Operation not permitted
- `ADM_005` - System in maintenance mode
- `ADM_006` - Invalid report parameters
- `ADM_007` - Bulk operation failed
- `ADM_008` - System health check failed
- `ADM_009` - Configuration update failed
- `ADM_010` - Unauthorized access attempt