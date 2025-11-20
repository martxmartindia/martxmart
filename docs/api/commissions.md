# Commissions API

The Commissions API manages vendor commission tracking and payouts.

## Base URL
```
/api/commissions
```

## Endpoints

### Get Vendor Commissions
```http
GET /api/commissions
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (string) - Time period filter
- `status` (string) - Payout status

**Response:**
```json
{
  "success": true,
  "data": {
    "commissions": [
      {
        "id": "comm_123",
        "vendorId": "vendor_123",
        "percentage": 8.5,
        "totalSales": 500000.00,
        "commissionAmount": 42500.00,
        "status": "PENDING",
        "period": "2024-01",
        "createdAt": "2024-01-31T23:59:59Z"
      }
    ],
    "summary": {
      "totalCommission": 125000.00,
      "paidCommission": 82500.00,
      "pendingCommission": 42500.00,
      "commissionRate": 8.5
    }
  }
}
```

### Get Commission Details
```http
GET /api/commissions/{id}
```

### Process Payout
```http
POST /api/commissions/{id}/payout
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "paymentMethod": "BANK_TRANSFER",
  "transactionId": "TXN123456789",
  "notes": "Monthly commission payout"
}
```

### Get Commission Analytics
```http
GET /api/commissions/analytics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalVendors": 150,
      "totalCommissions": 2500000.00,
      "averageCommissionRate": 8.2,
      "monthlyGrowth": 12.5
    },
    "topVendors": [
      {
        "vendorId": "vendor_123",
        "businessName": "TechMach Industries",
        "commissionEarned": 125000.00,
        "salesVolume": 1470588.24
      }
    ]
  }
}
```

## Commission Status
- `PENDING` - Commission calculated, awaiting payout
- `PAID` - Commission paid to vendor
- `CANCELLED` - Commission cancelled
- `DISPUTED` - Commission under dispute

## Error Codes
- `COMM_001` - Commission record not found
- `COMM_002` - Invalid commission rate
- `COMM_003` - Payout already processed
- `COMM_004` - Insufficient funds for payout