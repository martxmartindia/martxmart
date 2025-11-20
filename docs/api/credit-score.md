# Credit Score API

The Credit Score API provides credit score checking services.

## Base URL
```
/api/credit-score
```

## Endpoints

### Check Credit Score
```http
POST /api/credit-score/check
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-15",
  "mobileNumber": "+91-9876543210",
  "panCard": "ABCDE1234F"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "credit_123",
    "fullName": "John Doe",
    "mobileNumber": "+91-9876543210",
    "panCard": "ABCDE1234F",
    "creditScore": "750",
    "creditRating": "Good",
    "factors": [
      "Payment history: Excellent",
      "Credit utilization: Low",
      "Credit age: Good"
    ],
    "recommendations": [
      "Maintain low credit utilization",
      "Pay bills on time"
    ],
    "checkedAt": "2024-01-20T10:30:00Z"
  },
  "message": "Credit score retrieved successfully"
}
```

### Get Credit History
```http
GET /api/credit-score/history
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
    "history": [
      {
        "id": "credit_123",
        "creditScore": "750",
        "creditRating": "Good",
        "checkedAt": "2024-01-20T10:30:00Z"
      }
    ]
  }
}
```

### Get Credit Score Analytics (Admin)
```http
GET /api/credit-score/analytics
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalChecks": 1250,
      "averageScore": 685,
      "scoreDistribution": {
        "excellent": 125,
        "good": 450,
        "fair": 500,
        "poor": 175
      }
    },
    "monthlyTrend": {
      "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      "checks": [180, 220, 195, 240, 210, 250]
    }
  }
}
```

## Credit Score Ranges
- **Excellent**: 750-900
- **Good**: 650-749
- **Fair**: 550-649
- **Poor**: 300-549

## Credit Factors
- Payment History (35%)
- Credit Utilization (30%)
- Length of Credit History (15%)
- Types of Credit (10%)
- New Credit Inquiries (10%)

## Error Codes
- `CREDIT_001` - Invalid PAN card format
- `CREDIT_002` - Credit bureau unavailable
- `CREDIT_003` - Insufficient credit history
- `CREDIT_004` - Invalid personal details
- `CREDIT_005` - Service temporarily unavailable