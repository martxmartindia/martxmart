# Contact API

The Contact API manages contact form submissions and inquiries.

## Base URL
```
/api/contact
```

## Endpoints

### Submit Contact Form
```http
POST /api/contact
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "subject": "Product Inquiry",
  "message": "I am interested in your CNC machines",
  "inquiryType": "PRODUCT_INQUIRY"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "contact_123",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Product Inquiry",
    "inquiryType": "PRODUCT_INQUIRY",
    "status": "SUBMITTED",
    "createdAt": "2024-01-20T10:30:00Z"
  },
  "message": "Your inquiry has been submitted successfully"
}
```

### Get Contact Inquiries (Admin)
```http
GET /api/contact
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `inquiryType` (string) - Filter by inquiry type
- `status` (string) - Filter by status
- `dateFrom` (string) - Date range filter
- `dateTo` (string) - Date range filter
- `page` (number) - Page number
- `limit` (number) - Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "inquiries": [
      {
        "id": "contact_123",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+91-9876543210",
        "subject": "Product Inquiry",
        "message": "I am interested in your CNC machines",
        "inquiryType": "PRODUCT_INQUIRY",
        "status": "PENDING",
        "createdAt": "2024-01-20T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

### Get Contact Details (Admin)
```http
GET /api/contact/{id}
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

### Update Contact Status (Admin)
```http
PUT /api/contact/{id}/status
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "status": "RESOLVED",
  "notes": "Customer inquiry resolved via phone call"
}
```

### Reply to Contact (Admin)
```http
POST /api/contact/{id}/reply
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "subject": "Re: Product Inquiry",
  "message": "Thank you for your inquiry. Our team will contact you soon.",
  "sendEmail": true
}
```

### Get Contact Analytics (Admin)
```http
GET /api/contact/analytics
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `period` (string) - Time period (day, week, month, year)

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalInquiries": 450,
      "pendingInquiries": 25,
      "resolvedInquiries": 400,
      "responseRate": 88.9
    },
    "inquiryTypes": [
      {
        "type": "PRODUCT_INQUIRY",
        "count": 200,
        "percentage": 44.4
      },
      {
        "type": "SUPPORT",
        "count": 150,
        "percentage": 33.3
      }
    ],
    "monthlyTrend": {
      "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      "data": [35, 42, 38, 45, 40, 48]
    }
  }
}
```

## Inquiry Types
- `PRODUCT_INQUIRY` - Product related questions
- `SUPPORT` - Technical support requests
- `PARTNERSHIP` - Business partnership inquiries
- `FEEDBACK` - General feedback
- `COMPLAINT` - Customer complaints
- `FRANCHISE` - Franchise inquiries
- `VENDOR` - Vendor registration inquiries
- `OTHER` - Other inquiries

## Contact Status
- `SUBMITTED` - Inquiry submitted
- `PENDING` - Awaiting response
- `IN_PROGRESS` - Being processed
- `RESOLVED` - Inquiry resolved
- `CLOSED` - Inquiry closed

## Error Codes
- `CONT_001` - Contact inquiry not found
- `CONT_002` - Invalid inquiry type
- `CONT_003` - Email sending failed
- `CONT_004` - Invalid contact data
- `CONT_005` - Spam detection triggered