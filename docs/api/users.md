# Users API

The Users API manages user profiles, account settings, and user-related operations.

## Base URL
```
/api/users
```

## Endpoints

### Get User Profile
Get current user's profile information.

```http
GET /api/users/profile
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
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "image": "https://cdn.martxmart.com/users/avatar_123.jpg",
    "role": "CUSTOMER",
    "isVerified": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T15:45:00Z",
    "preferences": {
      "language": "en",
      "currency": "INR",
      "notifications": {
        "email": true,
        "sms": false,
        "push": true
      }
    },
    "stats": {
      "totalOrders": 15,
      "totalSpent": 125000.00,
      "wishlistItems": 8,
      "reviewsGiven": 12
    }
  }
}
```

### Update User Profile
Update user profile information.

```http
PUT /api/users/profile
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1234567891",
  "image": "https://cdn.martxmart.com/users/new_avatar.jpg",
  "preferences": {
    "language": "en",
    "currency": "INR",
    "notifications": {
      "email": true,
      "sms": true,
      "push": true
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1234567891",
    "image": "https://cdn.martxmart.com/users/new_avatar.jpg",
    "updatedAt": "2024-01-21T10:15:00Z"
  },
  "message": "Profile updated successfully"
}
```

### Upload Profile Picture
Upload or update user profile picture.

```http
POST /api/users/profile/picture
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
image: [binary file data]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "imageUrl": "https://cdn.martxmart.com/users/avatar_123_new.jpg",
    "uploadedAt": "2024-01-21T10:30:00Z"
  },
  "message": "Profile picture updated successfully"
}
```

### Get User Orders
Get user's order history.

```http
GET /api/users/orders
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20)
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
        "totalAmount": 250000.00,
        "status": "DELIVERED",
        "itemCount": 2,
        "createdAt": "2024-01-15T10:30:00Z",
        "deliveredAt": "2024-01-25T14:20:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "pages": 1
    },
    "summary": {
      "totalOrders": 15,
      "totalSpent": 125000.00,
      "averageOrderValue": 8333.33
    }
  }
}
```

### Get User Addresses
Get user's saved addresses.

```http
GET /api/users/addresses
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
    "addresses": [
      {
        "id": "addr_123",
        "type": "HOME",
        "contactName": "John Doe",
        "phone": "+1234567890",
        "email": "john@example.com",
        "addressLine1": "123 Main Street",
        "addressLine2": "Apartment 4B",
        "city": "Mumbai",
        "state": "Maharashtra",
        "zip": "400001",
        "placeOfSupply": "Maharashtra",
        "isDefault": true,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Add User Address
Add a new address to user's profile.

```http
POST /api/users/addresses
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "OFFICE",
  "contactName": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "addressLine1": "456 Business Park",
  "addressLine2": "Floor 5",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zip": "400002",
  "placeOfSupply": "Maharashtra",
  "isDefault": false
}
```

### Update User Address
Update an existing address.

```http
PUT /api/users/addresses/{addressId}
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Delete User Address
Delete a user address.

```http
DELETE /api/users/addresses/{addressId}
```

**Headers:**
```
Authorization: Bearer <token>
```

### Get User Wishlist
Get user's wishlist items.

```http
GET /api/users/wishlist
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `type` (string) - Filter by item type (PRODUCT, SHOPPING)

**Response:**
```json
{
  "success": true,
  "data": {
    "wishlist": [
      {
        "id": "wish_123",
        "type": "PRODUCT",
        "productId": "prod_123",
        "product": {
          "id": "prod_123",
          "name": "CNC Lathe Machine",
          "price": 250000.00,
          "images": ["image1.jpg"],
          "stock": 5,
          "isAvailable": true
        },
        "addedAt": "2024-01-15T10:30:00Z"
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

### Get User Reviews
Get reviews written by the user.

```http
GET /api/users/reviews
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "rev_123",
        "rating": 5,
        "comment": "Excellent product quality",
        "productId": "prod_123",
        "product": {
          "name": "CNC Lathe Machine",
          "images": ["image1.jpg"]
        },
        "createdAt": "2024-01-20T14:30:00Z"
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

### Get User Notifications
Get user's notifications.

```http
GET /api/users/notifications
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `unread` (boolean) - Filter unread notifications

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

### Mark Notifications as Read
Mark notifications as read.

```http
PUT /api/users/notifications/read
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "notificationIds": ["notif_123", "notif_456"]
}
```

### Update Notification Preferences
Update user's notification preferences.

```http
PUT /api/users/notifications/preferences
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
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
```

### Request Account Deletion
Request account deletion (GDPR compliance).

```http
POST /api/users/delete-request
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "No longer need the service",
  "feedback": "Optional feedback about the service"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "requestId": "del_123",
    "scheduledDeletion": "2024-02-15T00:00:00Z",
    "gracePeriod": "30 days"
  },
  "message": "Account deletion requested. You have 30 days to cancel this request."
}
```

### Cancel Account Deletion
Cancel pending account deletion request.

```http
DELETE /api/users/delete-request
```

**Headers:**
```
Authorization: Bearer <token>
```

### Export User Data
Export user data (GDPR compliance).

```http
GET /api/users/export
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
    "exportId": "exp_123",
    "status": "PROCESSING",
    "estimatedCompletion": "2024-01-21T12:00:00Z"
  },
  "message": "Data export initiated. You will receive an email when ready."
}
```

### Get User Statistics
Get user activity statistics.

```http
GET /api/users/stats
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
    "orders": {
      "total": 15,
      "completed": 12,
      "cancelled": 2,
      "returned": 1
    },
    "spending": {
      "total": 125000.00,
      "thisMonth": 25000.00,
      "lastMonth": 18000.00,
      "average": 8333.33
    },
    "activity": {
      "wishlistItems": 8,
      "reviewsGiven": 12,
      "loginCount": 45,
      "lastLogin": "2024-01-21T09:30:00Z"
    },
    "preferences": {
      "favoriteCategories": ["CNC Machines", "Traditional Wear"],
      "preferredBrands": ["TechMach", "Handloom Co"]
    }
  }
}
```

## User Roles

### Role Types
- `CUSTOMER` - Regular customer
- `VENDOR` - Product vendor
- `ADMIN` - Platform administrator
- `FRANCHISE` - Franchise owner
- `AUTHOR` - Blog author

### Role Permissions
Each role has specific permissions for accessing different API endpoints and features.

## Address Types

### Supported Address Types
- `HOME` - Home address
- `OFFICE` - Office/work address
- `OTHER` - Other address type

## Notification Types

### Notification Categories
- `ORDER_UPDATE` - Order status updates
- `PAYMENT_UPDATE` - Payment confirmations
- `PROMOTION` - Promotional offers
- `NEW_PRODUCT` - New product alerts
- `PRICE_DROP` - Price drop notifications
- `WISHLIST_UPDATE` - Wishlist item updates
- `ACCOUNT_UPDATE` - Account-related updates

## Error Codes
- `USER_001` - User not found
- `USER_002` - Invalid user data
- `USER_003` - Email already exists
- `USER_004` - Phone already exists
- `USER_005` - Invalid address format
- `USER_006` - Address not found
- `USER_007` - Cannot delete default address
- `USER_008` - Profile picture upload failed
- `USER_009` - Invalid notification preferences
- `USER_010` - Account deletion not allowed
- `USER_011` - Export request failed
- `USER_012` - Insufficient permissions
- `USER_013` - Account suspended
- `USER_014` - Verification required