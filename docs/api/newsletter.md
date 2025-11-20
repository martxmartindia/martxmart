# Newsletter API

The Newsletter API manages email subscriptions and newsletter campaigns.

## Base URL
```
/api/newsletter
```

## Endpoints

### Subscribe to Newsletter
```http
POST /api/newsletter/subscribe
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "email": "john@example.com",
    "subscribed": true,
    "subscribedAt": "2024-01-20T10:30:00Z"
  },
  "message": "Successfully subscribed to newsletter"
}
```

### Unsubscribe from Newsletter
```http
POST /api/newsletter/unsubscribe
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

### Check Subscription Status
```http
GET /api/newsletter/status
```

**Query Parameters:**
- `email` (string) - Email address to check

**Response:**
```json
{
  "success": true,
  "data": {
    "email": "john@example.com",
    "subscribed": true,
    "subscribedAt": "2024-01-20T10:30:00Z"
  }
}
```

### Get Subscribers (Admin)
```http
GET /api/newsletter/subscribers
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `dateFrom` (string) - Subscription date filter
- `dateTo` (string) - Subscription date filter

**Response:**
```json
{
  "success": true,
  "data": {
    "subscribers": [
      {
        "id": "sub_123",
        "email": "john@example.com",
        "subscribedAt": "2024-01-20T10:30:00Z",
        "isActive": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 2500,
      "pages": 50
    },
    "summary": {
      "totalSubscribers": 2500,
      "activeSubscribers": 2350,
      "newSubscribersThisMonth": 150
    }
  }
}
```

### Send Newsletter Campaign (Admin)
```http
POST /api/newsletter/campaign
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "subject": "Latest Product Updates",
  "content": "Newsletter HTML content...",
  "recipientType": "ALL_SUBSCRIBERS",
  "scheduledAt": "2024-01-21T10:00:00Z"
}
```

### Get Campaign Analytics (Admin)
```http
GET /api/newsletter/analytics
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
      "totalSubscribers": 2500,
      "activeSubscribers": 2350,
      "unsubscribeRate": 2.1,
      "openRate": 25.5,
      "clickRate": 3.2
    },
    "growthTrend": {
      "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      "subscribers": [2100, 2200, 2300, 2350, 2400, 2500],
      "unsubscribes": [15, 12, 18, 10, 8, 12]
    },
    "recentCampaigns": [
      {
        "id": "camp_123",
        "subject": "Latest Product Updates",
        "sentAt": "2024-01-15T10:00:00Z",
        "recipients": 2350,
        "openRate": 28.5,
        "clickRate": 4.1
      }
    ]
  }
}
```

### Export Subscribers (Admin)
```http
GET /api/newsletter/export
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `format` (string) - Export format (CSV, EXCEL)
- `dateFrom` (string) - Date range filter
- `dateTo` (string) - Date range filter

**Response:**
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://cdn.martxmart.com/exports/subscribers_2024_01.csv",
    "expiresAt": "2024-01-25T10:30:00Z"
  }
}
```

## Recipient Types
- `ALL_SUBSCRIBERS` - All active subscribers
- `NEW_SUBSCRIBERS` - Recently subscribed users
- `CUSTOMERS` - Users who have made purchases
- `VENDORS` - Registered vendors
- `CUSTOM` - Custom recipient list

## Campaign Status
- `DRAFT` - Campaign being prepared
- `SCHEDULED` - Campaign scheduled
- `SENDING` - Campaign being sent
- `SENT` - Campaign sent successfully
- `FAILED` - Campaign sending failed

## Error Codes
- `NEWS_001` - Email already subscribed
- `NEWS_002` - Email not found
- `NEWS_003` - Invalid email format
- `NEWS_004` - Campaign sending failed
- `NEWS_005` - Export generation failed