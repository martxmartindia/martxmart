# Messages API

The Messages API manages internal messaging between users, vendors, and support.

## Base URL
```
/api/messages
```

## Endpoints

### Get Conversations
```http
GET /api/messages/conversations
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
    "conversations": [
      {
        "id": "conv_123",
        "participant": {
          "id": "user_456",
          "name": "TechMach Industries",
          "type": "VENDOR"
        },
        "lastMessage": {
          "content": "Thank you for your inquiry",
          "timestamp": "2024-01-20T15:30:00Z",
          "isRead": false
        },
        "unreadCount": 2
      }
    ]
  }
}
```

### Get Messages
```http
GET /api/messages/conversations/{conversationId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_123",
        "senderId": "user_123",
        "receiverId": "user_456",
        "content": "Hi, I'm interested in your CNC machine",
        "type": "TEXT",
        "isRead": true,
        "createdAt": "2024-01-20T14:30:00Z"
      }
    ]
  }
}
```

### Send Message
```http
POST /api/messages
```

**Request Body:**
```json
{
  "receiverId": "user_456",
  "content": "Hi, I'm interested in your CNC machine",
  "type": "TEXT",
  "attachments": []
}
```

### Mark as Read
```http
PUT /api/messages/{id}/read
```

### Delete Message
```http
DELETE /api/messages/{id}
```

## Message Types
- `TEXT` - Text message
- `IMAGE` - Image attachment
- `FILE` - File attachment
- `SYSTEM` - System generated message

## Error Codes
- `MSG_001` - Message not found
- `MSG_002` - Cannot message yourself
- `MSG_003` - User blocked
- `MSG_004` - Attachment too large