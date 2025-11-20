# Franchise Applications API

The Franchise Applications API manages franchise application submissions and processing.

## Base URL
```
/api/franchise-applications
```

## Endpoints

### Submit Application
```http
POST /api/franchise-applications
```

**Request Body:**
```json
{
  "applicantName": "Rajesh Kumar",
  "businessName": "Kumar Enterprises",
  "email": "rajesh@kumarenterprises.com",
  "phone": "+91-9876543210",
  "address": "123 Business District",
  "city": "Pune",
  "state": "Maharashtra",
  "zip": "411001",
  "investmentCapacity": 2500000.00,
  "preferredLocation": "Pune and surrounding areas",
  "businessExperience": "10 years in retail and distribution",
  "documents": ["pan_card.pdf", "bank_statement.pdf"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "applicationId": "fapp_123",
    "applicantName": "Rajesh Kumar",
    "businessName": "Kumar Enterprises",
    "status": "PENDING",
    "submittedAt": "2024-01-20T10:30:00Z",
    "estimatedReviewTime": "7-10 business days",
    "nextSteps": [
      "Document verification",
      "Business plan review",
      "Interview scheduling",
      "Territory allocation"
    ]
  }
}
```

### Get Application Status
```http
GET /api/franchise-applications/{applicationId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "fapp_123",
    "applicantName": "Rajesh Kumar",
    "businessName": "Kumar Enterprises",
    "email": "rajesh@kumarenterprises.com",
    "phone": "+91-9876543210",
    "city": "Pune",
    "state": "Maharashtra",
    "investmentCapacity": 2500000.00,
    "status": "UNDER_REVIEW",
    "submittedAt": "2024-01-20T10:30:00Z",
    "reviewedAt": null,
    "notes": "Initial review in progress",
    "timeline": [
      {
        "status": "SUBMITTED",
        "timestamp": "2024-01-20T10:30:00Z",
        "description": "Application submitted successfully"
      },
      {
        "status": "DOCUMENT_VERIFICATION",
        "timestamp": "2024-01-21T09:15:00Z",
        "description": "Document verification started"
      }
    ]
  }
}
```

### Get All Applications (Admin)
```http
GET /api/franchise-applications
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `status` (string) - Filter by status
- `city` (string) - Filter by city
- `state` (string) - Filter by state
- `page` (number) - Page number
- `limit` (number) - Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "fapp_123",
        "applicantName": "Rajesh Kumar",
        "businessName": "Kumar Enterprises",
        "email": "rajesh@kumarenterprises.com",
        "phone": "+91-9876543210",
        "city": "Pune",
        "state": "Maharashtra",
        "investmentCapacity": 2500000.00,
        "status": "UNDER_REVIEW",
        "submittedAt": "2024-01-20T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 35,
      "pages": 2
    }
  }
}
```

### Review Application (Admin)
```http
PUT /api/franchise-applications/{applicationId}/review
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "status": "APPROVED",
  "notes": "Excellent business background and investment capacity",
  "interviewDate": "2024-01-25T14:00:00Z",
  "territoryAllocated": "Pune District",
  "investmentSlab": "PREMIUM"
}
```

### Schedule Interview (Admin)
```http
POST /api/franchise-applications/{applicationId}/interview
```

**Request Body:**
```json
{
  "interviewDate": "2024-01-25T14:00:00Z",
  "interviewType": "VIDEO_CALL",
  "interviewerName": "Business Development Manager",
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "agenda": [
    "Business background discussion",
    "Investment capacity verification",
    "Territory preferences",
    "Franchise terms explanation"
  ]
}
```

### Approve Application (Admin)
```http
POST /api/franchise-applications/{applicationId}/approve
```

**Request Body:**
```json
{
  "territoryAllocated": "Pune District",
  "investmentSlab": "PREMIUM",
  "commissionRate": 10.0,
  "contractDuration": "3 years",
  "franchiseFee": 500000.00,
  "securityDeposit": 200000.00,
  "onboardingSteps": [
    "Sign franchise agreement",
    "Pay franchise fee",
    "Complete training program",
    "Setup local operations"
  ]
}
```

### Reject Application (Admin)
```http
POST /api/franchise-applications/{applicationId}/reject
```

**Request Body:**
```json
{
  "reason": "Insufficient investment capacity for preferred territory",
  "feedback": "Consider applying for a smaller territory or increasing investment",
  "canReapply": true,
  "reapplyAfter": "2024-06-01T00:00:00Z"
}
```

### Update Application
```http
PUT /api/franchise-applications/{applicationId}
```

**Request Body:**
```json
{
  "businessName": "Kumar Enterprises Pvt Ltd",
  "investmentCapacity": 3000000.00,
  "preferredLocation": "Pune and Nashik districts"
}
```

### Upload Documents
```http
POST /api/franchise-applications/{applicationId}/documents
```

**Headers:**
```
Content-Type: multipart/form-data
```

**Request Body:**
```
documentType: "BUSINESS_PLAN"
file: [binary file data]
```

### Get Application Analytics (Admin)
```http
GET /api/franchise-applications/analytics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalApplications": 150,
      "pendingApplications": 25,
      "approvedApplications": 85,
      "rejectedApplications": 40,
      "approvalRate": 68.0
    },
    "applicationsByState": [
      {
        "state": "Maharashtra",
        "count": 45,
        "approved": 28
      }
    ],
    "investmentDistribution": {
      "basic": 60,
      "premium": 70,
      "enterprise": 20
    },
    "monthlyTrend": {
      "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      "applications": [12, 15, 18, 22, 20, 25],
      "approvals": [8, 10, 12, 15, 14, 17]
    }
  }
}
```

## Application Status
- `PENDING` - Application submitted
- `UNDER_REVIEW` - Initial review in progress
- `INTERVIEW_SCHEDULED` - Interview scheduled
- `INTERVIEW_COMPLETED` - Interview completed
- `APPROVED` - Application approved
- `REJECTED` - Application rejected
- `ADDITIONAL_INFO_REQUIRED` - More information needed

## Investment Slabs
- `BASIC` - ₹10-25 Lakhs
- `PREMIUM` - ₹25-50 Lakhs
- `ENTERPRISE` - ₹50+ Lakhs

## Required Documents
- PAN Card
- Bank Statement (6 months)
- Address Proof
- Business Plan
- Investment Proof
- Experience Certificate
- Character Certificate

## Error Codes
- `FAPP_001` - Application not found
- `FAPP_002` - Application already exists
- `FAPP_003` - Invalid investment amount
- `FAPP_004` - Territory not available
- `FAPP_005` - Document upload failed
- `FAPP_006` - Cannot modify approved application
- `FAPP_007` - Interview not scheduled
- `FAPP_008` - Invalid status transition