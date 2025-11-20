# Tickets API

The Tickets API manages support tickets and customer service requests.

## Base URL
```
/api/tickets
```

## Endpoints

### Create Ticket
```http
POST /api/tickets
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "subject": "Payment Issue",
  "description": "Unable to complete payment for order",
  "category": "PAYMENT",
  "priority": "HIGH",
  "orderId": "order_123",
  "attachments": ["screenshot.png"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ticket_123",
    "ticketNumber": "TKT-2024-001234",
    "subject": "Payment Issue",
    "status": "OPEN",
    "priority": "HIGH",
    "category": "PAYMENT",
    "createdAt": "2024-01-20T10:30:00Z",
    "estimatedResolution": "2024-01-22T10:30:00Z"
  }
}
```

### Get User Tickets
```http
GET /api/tickets
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (string) - Filter by status
- `category` (string) - Filter by category
- `priority` (string) - Filter by priority

**Response:**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "id": "ticket_123",
        "ticketNumber": "TKT-2024-001234",
        "subject": "Payment Issue",
        "status": "IN_PROGRESS",
        "priority": "HIGH",
        "category": "PAYMENT",
        "assignee": {
          "name": "Support Agent"
        },
        "lastUpdated": "2024-01-21T09:15:00Z",
        "createdAt": "2024-01-20T10:30:00Z"
      }
    ]
  }
}
```

### Get Ticket Details
```http
GET /api/tickets/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ticket_123",
    "ticketNumber": "TKT-2024-001234",
    "subject": "Payment Issue",
    "description": "Unable to complete payment for order",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "category": "PAYMENT",
    "creator": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignee": {
      "name": "Support Agent",
      "email": "support@martxmart.com"
    },
    "comments": [
      {
        "id": "comment_123",
        "content": "We're looking into this issue",
        "author": {
          "name": "Support Agent"
        },
        "createdAt": "2024-01-21T09:15:00Z"
      }
    ],
    "attachments": ["screenshot.png"],
    "createdAt": "2024-01-20T10:30:00Z"
  }
}
```

### Add Comment
```http
POST /api/tickets/{id}/comments
```

**Request Body:**
```json
{
  "content": "I tried again but still facing the same issue",
  "attachments": ["error_log.txt"]
}
```

### Update Ticket Status (Admin)
```http
PUT /api/tickets/{id}/status
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "status": "RESOLVED",
  "resolution": "Payment gateway issue resolved"
}
```

### Close Ticket
```http
PUT /api/tickets/{id}/close
```

**Request Body:**
```json
{
  "feedback": "Issue resolved satisfactorily",
  "rating": 5
}
```

## Ticket Status
- `OPEN` - Newly created ticket
- `IN_PROGRESS` - Being worked on
- `WAITING_FOR_CUSTOMER` - Awaiting customer response
- `RESOLVED` - Issue resolved
- `CLOSED` - Ticket closed

## Priority Levels
- `LOW` - Non-urgent issues
- `MEDIUM` - Standard priority
- `HIGH` - Urgent issues
- `CRITICAL` - Critical system issues

## Categories
- `TECHNICAL` - Technical issues
- `PAYMENT` - Payment related
- `ORDER` - Order issues
- `ACCOUNT` - Account problems
- `GENERAL` - General inquiries

## Error Codes
- `TKT_001` - Ticket not found
- `TKT_002` - Cannot modify closed ticket
- `TKT_003` - Invalid status transition
- `TKT_004` - Unauthorized access