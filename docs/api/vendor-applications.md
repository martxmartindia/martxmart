# Vendor Applications API

The Vendor Applications API manages the vendor registration and approval process.

## Base URL
```
/api/vendor-applications
```

## Endpoints

### Submit Application
```http
POST /api/vendor-applications
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "businessName": "TechMach Industries",
  "description": "Leading manufacturer of industrial machinery",
  "logo": "logo.jpg",
  "address": "123 Industrial Area",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400069",
  "phone": "+91-9876543210",
  "email": "contact@techmach.com",
  "website": "https://techmach.com",
  "gstNumber": "27ABCDE1234F1Z5",
  "panNumber": "ABCDE1234F",
  "bankName": "HDFC Bank",
  "accountNumber": "12345678901234",
  "ifscCode": "HDFC0001234",
  "documents": [
    {
      "type": "GST_CERTIFICATE",
      "url": "gst_cert.pdf"
    },
    {
      "type": "PAN_CARD",
      "url": "pan_card.pdf"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "applicationId": "app_123",
    "businessName": "TechMach Industries",
    "status": "PENDING",
    "submittedAt": "2024-01-20T10:30:00Z",
    "estimatedReviewTime": "3-5 business days",
    "requiredDocuments": [
      "GST_CERTIFICATE",
      "PAN_CARD",
      "BANK_STATEMENT",
      "BUSINESS_LICENSE"
    ]
  }
}
```

### Get Application Status
```http
GET /api/vendor-applications/{applicationId}
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
    "id": "app_123",
    "businessName": "TechMach Industries",
    "status": "UNDER_REVIEW",
    "submittedAt": "2024-01-20T10:30:00Z",
    "reviewedAt": null,
    "notes": "Documents under verification",
    "timeline": [
      {
        "status": "SUBMITTED",
        "timestamp": "2024-01-20T10:30:00Z",
        "description": "Application submitted successfully"
      },
      {
        "status": "DOCUMENT_VERIFICATION",
        "timestamp": "2024-01-21T09:15:00Z",
        "description": "Document verification in progress"
      }
    ],
    "documents": [
      {
        "type": "GST_CERTIFICATE",
        "status": "VERIFIED",
        "uploadedAt": "2024-01-20T10:30:00Z",
        "verifiedAt": "2024-01-21T09:15:00Z"
      },
      {
        "type": "PAN_CARD",
        "status": "PENDING_VERIFICATION",
        "uploadedAt": "2024-01-20T10:30:00Z"
      }
    ]
  }
}
```

### Upload Documents
```http
POST /api/vendor-applications/{applicationId}/documents
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
documentType: "BANK_STATEMENT"
file: [binary file data]
```

### Update Application
```http
PUT /api/vendor-applications/{applicationId}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "businessName": "TechMach Industries Pvt Ltd",
  "phone": "+91-9876543211",
  "website": "https://newwebsite.com"
}
```

### Get All Applications (Admin)
```http
GET /api/vendor-applications
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `status` (string) - Filter by status
- `page` (number) - Page number
- `limit` (number) - Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "app_123",
        "businessName": "TechMach Industries",
        "applicantName": "Rajesh Kumar",
        "email": "rajesh@techmach.com",
        "status": "UNDER_REVIEW",
        "submittedAt": "2024-01-20T10:30:00Z",
        "city": "Mumbai",
        "state": "Maharashtra"
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

### Review Application (Admin)
```http
PUT /api/vendor-applications/{applicationId}/review
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "status": "APPROVED",
  "notes": "All documents verified successfully",
  "feedback": "Welcome to martXmart platform"
}
```

### Approve Application (Admin)
```http
POST /api/vendor-applications/{applicationId}/approve
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "commissionRate": 8.5,
  "welcomeMessage": "Welcome to martXmart!",
  "onboardingSteps": [
    "Complete profile setup",
    "Add first product",
    "Verify bank details"
  ]
}
```

### Reject Application (Admin)
```http
POST /api/vendor-applications/{applicationId}/reject
```

**Request Body:**
```json
{
  "reason": "Incomplete documentation",
  "feedback": "Please provide complete bank statements",
  "canReapply": true
}
```

### Request Additional Info (Admin)
```http
POST /api/vendor-applications/{applicationId}/request-info
```

**Request Body:**
```json
{
  "requiredInfo": [
    "Updated GST certificate",
    "Latest bank statement",
    "Business registration certificate"
  ],
  "message": "Please provide the following additional documents",
  "deadline": "2024-01-30T23:59:59Z"
}
```

## Application Status
- `PENDING` - Application submitted
- `UNDER_REVIEW` - Being reviewed by admin
- `ADDITIONAL_INFO_REQUIRED` - More information needed
- `APPROVED` - Application approved
- `REJECTED` - Application rejected

## Document Types
- `GST_CERTIFICATE` - GST registration certificate
- `PAN_CARD` - PAN card copy
- `BANK_STATEMENT` - Bank account statement
- `BUSINESS_LICENSE` - Business license/registration
- `ADDRESS_PROOF` - Address verification
- `IDENTITY_PROOF` - Identity verification
- `QUALITY_CERTIFICATES` - ISO/Quality certifications

## Document Status
- `PENDING_UPLOAD` - Document not uploaded
- `UPLOADED` - Document uploaded
- `PENDING_VERIFICATION` - Awaiting verification
- `VERIFIED` - Document verified
- `REJECTED` - Document rejected

## Error Codes
- `APP_001` - Application not found
- `APP_002` - Application already exists
- `APP_003` - Invalid document type
- `APP_004` - Document upload failed
- `APP_005` - Cannot modify approved application
- `APP_006` - Missing required documents
- `APP_007` - Invalid GST number
- `APP_008` - Invalid PAN number