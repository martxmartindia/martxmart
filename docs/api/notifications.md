# Notifications API

The Notifications API manages push notifications, alerts, and user communications.

## Base URL
```
/api/notifications
```

## Endpoints

### Get User Notifications
```http
GET /api/notifications
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `unread` (boolean) - Filter unread notifications
- `type` (string) - Filter by notification type

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_123",
        "title": "Order Shipped",
        "message": "Your order ORD-2024-001234 has been shipped",
        "type": "ORDER_UPDATE",
        "isRead": false,
        "data": {
          "orderId": "order_123",
          "trackingNumber": "TRK123456789"
        },
        "createdAt": "2024-01-20T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "pages": 2
    },
    "unreadCount": 8
  }
}
```

### Mark as Read
```http
PUT /api/notifications/read
```

**Request Body:**
```json
{
  "notificationIds": ["notif_123", "notif_456"]
}
```

### Mark All as Read
```http
PUT /api/notifications/read-all
```

### Delete Notification
```http
DELETE /api/notifications/{id}
```

### Get Notification Preferences
```http
GET /api/notifications/preferences
```

**Response:**
```json
{
  "success": true,
  "data": {
    "preferences": {
      "email": true,
      "sms": false,
      "push": true,
      "categories": {
        "orderUpdates": true,
        "promotions": false,
        "newProducts": true,
        "priceDrops": true
      }
    }
  }
}
```

### Update Preferences
```http
PUT /api/notifications/preferences
```

**Request Body:**
```json
{
  "email": true,
  "sms": true,
  "push": true,
  "categories": {
    "orderUpdates": true,
    "promotions": false,
    "newProducts": true,
    "priceDrops": true
  }
}
```

### Send Bulk Notification (Admin)
```http
POST /api/notifications/bulk
```

**Headers:**
```
Authorization: Bearer <admin-token>
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
      "role": ["CUSTOMER", "VENDOR"]
    }
  },
  "channels": ["EMAIL", "PUSH", "IN_APP"]
}
```

## Notification Types
- `ORDER_UPDATE` - Order status updates
- `PAYMENT_UPDATE` - Payment confirmations
- `PROMOTION` - Promotional offers
- `NEW_PRODUCT` - New product alerts
- `PRICE_DROP` - Price drop notifications
- `WISHLIST_UPDATE` - Wishlist item updates
- `SYSTEM_ANNOUNCEMENT` - System announcements

## Error Codes
- `NOTIF_001` - Notification not found
- `NOTIF_002` - Invalid notification type
- `NOTIF_003` - Notification already read
- `NOTIF_004` - Bulk send failed