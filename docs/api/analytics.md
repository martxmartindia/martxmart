# Analytics API

The Analytics API provides business intelligence and reporting data.

## Base URL
```
/api/analytics
```

## Endpoints

### Platform Overview
```http
GET /api/analytics/overview
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `period` (string) - Time period (day, week, month, year)
- `dateFrom` (string) - Start date
- `dateTo` (string) - End date

**Response:**
```json
{
  "success": true,
  "data": {
    "revenue": {
      "total": 125000000.00,
      "growth": 15.2,
      "monthlyAverage": 10416666.67
    },
    "orders": {
      "total": 25600,
      "growth": 12.8,
      "averageValue": 4882.81,
      "completionRate": 94.2
    },
    "users": {
      "total": 15420,
      "active": 3200,
      "growth": 8.5,
      "retentionRate": 78.5
    },
    "vendors": {
      "total": 1250,
      "active": 980,
      "growth": 5.2,
      "averageRating": 4.3
    }
  }
}
```

### Sales Analytics
```http
GET /api/analytics/sales
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSales": 125000000.00,
    "salesGrowth": 15.2,
    "salesByCategory": [
      {
        "category": "CNC Machines",
        "sales": 45000000.00,
        "percentage": 36.0
      }
    ],
    "salesTrend": {
      "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      "data": [8500000, 9200000, 10100000, 11500000, 10800000, 12200000]
    },
    "topProducts": [
      {
        "productId": "prod_123",
        "name": "CNC Lathe Machine",
        "sales": 5000000.00,
        "units": 20
      }
    ]
  }
}
```

### User Analytics
```http
GET /api/analytics/users
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 15420,
    "activeUsers": 3200,
    "newUsers": 450,
    "userGrowth": 8.5,
    "usersByRole": {
      "CUSTOMER": 14000,
      "VENDOR": 1200,
      "ADMIN": 20
    },
    "userActivity": {
      "dailyActiveUsers": 850,
      "weeklyActiveUsers": 2100,
      "monthlyActiveUsers": 3200
    },
    "registrationTrend": {
      "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      "data": [320, 380, 420, 450, 480, 520]
    }
  }
}
```

### Product Analytics
```http
GET /api/analytics/products
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProducts": 8500,
    "activeProducts": 7800,
    "newProducts": 120,
    "productsByCategory": [
      {
        "category": "CNC Machines",
        "count": 450,
        "percentage": 5.3
      }
    ],
    "topViewedProducts": [
      {
        "productId": "prod_123",
        "name": "CNC Lathe Machine",
        "views": 15420,
        "conversions": 45
      }
    ],
    "inventoryStatus": {
      "inStock": 7200,
      "lowStock": 450,
      "outOfStock": 150
    }
  }
}
```

### Vendor Analytics
```http
GET /api/analytics/vendors
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalVendors": 1250,
    "activeVendors": 980,
    "newVendors": 35,
    "vendorGrowth": 5.2,
    "topVendors": [
      {
        "vendorId": "vendor_123",
        "businessName": "TechMach Industries",
        "sales": 2500000.00,
        "orders": 128,
        "rating": 4.5
      }
    ],
    "vendorPerformance": {
      "averageRating": 4.3,
      "averageResponseTime": "2.5 hours",
      "fulfillmentRate": 96.8
    }
  }
}
```

### Financial Analytics
```http
GET /api/analytics/financial
```

**Response:**
```json
{
  "success": true,
  "data": {
    "revenue": {
      "gross": 125000000.00,
      "net": 112500000.00,
      "commissions": 10625000.00,
      "taxes": 1875000.00
    },
    "profitability": {
      "grossMargin": 25.5,
      "netMargin": 22.8,
      "operatingExpenses": 3375000.00
    },
    "cashFlow": {
      "inflow": 125000000.00,
      "outflow": 112500000.00,
      "netCashFlow": 12500000.00
    }
  }
}
```

### Custom Report
```http
POST /api/analytics/reports
```

**Request Body:**
```json
{
  "reportType": "SALES_REPORT",
  "period": "MONTHLY",
  "dateFrom": "2024-01-01",
  "dateTo": "2024-01-31",
  "filters": {
    "category": "CNC Machines",
    "vendor": "vendor_123"
  },
  "metrics": ["revenue", "orders", "conversion_rate"],
  "format": "JSON"
}
```

### Export Analytics
```http
GET /api/analytics/export
```

**Query Parameters:**
- `type` (string) - Export type (sales, users, products)
- `format` (string) - Export format (CSV, PDF, EXCEL)
- `period` (string) - Time period

**Response:**
```json
{
  "success": true,
  "data": {
    "exportId": "exp_123",
    "downloadUrl": "https://cdn.martxmart.com/exports/analytics_2024_01.csv",
    "expiresAt": "2024-01-25T10:30:00Z"
  }
}
```

## Metrics Available

### Revenue Metrics
- Total revenue
- Revenue growth
- Average order value
- Revenue by category/vendor
- Monthly recurring revenue

### User Metrics
- Total users
- Active users (DAU, WAU, MAU)
- User acquisition cost
- Customer lifetime value
- Retention rate

### Product Metrics
- Product views
- Conversion rate
- Inventory turnover
- Product performance
- Category analysis

### Vendor Metrics
- Vendor performance
- Commission tracking
- Vendor ratings
- Response times
- Fulfillment rates

## Error Codes
- `ANA_001` - Invalid date range
- `ANA_002` - Insufficient permissions
- `ANA_003` - Report generation failed
- `ANA_004` - Export limit exceeded
- `ANA_005` - Invalid metric requested