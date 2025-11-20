# Project Reports API

The Project Reports API manages project reports, applications, and business plan documents.

## Base URL
```
/api/project-reports
```

## Endpoints

### Get Project Categories
```http
GET /api/project-reports/categories
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat_123",
        "name": "Food Processing",
        "slug": "food-processing",
        "description": "Food processing and packaging projects",
        "image": "food_processing.jpg",
        "projectCount": 25
      }
    ]
  }
}
```

### Get Projects
```http
GET /api/project-reports/projects
```

**Query Parameters:**
- `categoryId` (string) - Filter by category
- `investmentRange` (string) - Filter by investment range
- `page` (number) - Page number
- `limit` (number) - Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "proj_123",
        "name": "Rice Mill Project",
        "slug": "rice-mill-project",
        "description": "Complete rice processing unit setup",
        "estimatedCost": "25-30 Lakhs",
        "timeline": "6-8 months",
        "landRequirement": "2000 sq ft",
        "powerRequirement": "50 HP",
        "manpower": "8-10 workers",
        "marketPotential": "High demand in rural areas",
        "profitMargin": "25-30%",
        "breakEven": "18-24 months",
        "subsidyDetails": "Available under PMFME scheme",
        "projectReportCost": 6000.00,
        "category": {
          "name": "Food Processing"
        }
      }
    ]
  }
}
```

### Get Project Details
```http
GET /api/project-reports/projects/{slug}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "proj_123",
    "name": "Rice Mill Project",
    "slug": "rice-mill-project",
    "description": "Complete rice processing unit setup",
    "longDescription": "Detailed project description...",
    "estimatedCost": "25-30 Lakhs",
    "timeline": "6-8 months",
    "requirements": [
      "Land: 2000 sq ft",
      "Power: 50 HP connection",
      "Water: Adequate supply"
    ],
    "landRequirement": "2000 sq ft",
    "powerRequirement": "50 HP",
    "manpower": "8-10 workers",
    "rawMaterials": ["Paddy", "Packaging materials"],
    "marketPotential": "High demand in rural areas",
    "profitMargin": "25-30%",
    "breakEven": "18-24 months",
    "subsidyDetails": "Available under PMFME scheme - up to 35% subsidy",
    "machinery": [
      {
        "name": "Rice Huller",
        "cost": "8-10 Lakhs"
      },
      {
        "name": "Polisher",
        "cost": "5-6 Lakhs"
      }
    ],
    "documents": ["feasibility_report.pdf", "machinery_list.pdf"],
    "projectReportCost": 6000.00,
    "category": {
      "name": "Food Processing",
      "slug": "food-processing"
    }
  }
}
```

### Purchase Project Report
```http
POST /api/project-reports/purchase
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "projectId": "proj_123",
  "paymentMethod": "RAZORPAY"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_456",
    "projectId": "proj_123",
    "amount": 6000.00,
    "paymentDetails": {
      "razorpayOrderId": "order_razorpay_456",
      "amount": 6000.00,
      "currency": "INR"
    }
  }
}
```

### Get Purchased Reports
```http
GET /api/project-reports/purchased
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
    "reports": [
      {
        "id": "report_123",
        "project": {
          "name": "Rice Mill Project",
          "slug": "rice-mill-project"
        },
        "purchasedAt": "2024-01-20T10:30:00Z",
        "downloadUrl": "https://cdn.martxmart.com/reports/rice_mill_report.pdf",
        "status": "COMPLETED"
      }
    ]
  }
}
```

### Download Report
```http
GET /api/project-reports/download/{reportId}
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
    "downloadUrl": "https://cdn.martxmart.com/reports/rice_mill_report.pdf",
    "expiresAt": "2024-01-25T10:30:00Z"
  }
}
```

### Submit Project Application
```http
POST /api/project-reports/applications
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "projectId": "proj_123",
  "applicantName": "John Doe",
  "businessName": "Doe Enterprises",
  "email": "john@doeenterprises.com",
  "phone": "+91-9876543210",
  "address": "123 Business Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "investmentCapacity": 3000000.00,
  "experience": "5 years in food business",
  "landAvailable": true,
  "landDetails": "Own 3000 sq ft industrial plot",
  "documents": ["pan_card.pdf", "land_documents.pdf"]
}
```

### Get Application Status
```http
GET /api/project-reports/applications/{applicationId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "app_123",
    "project": {
      "name": "Rice Mill Project"
    },
    "applicantName": "John Doe",
    "status": "UNDER_REVIEW",
    "submittedAt": "2024-01-20T10:30:00Z",
    "timeline": [
      {
        "status": "SUBMITTED",
        "timestamp": "2024-01-20T10:30:00Z",
        "description": "Application submitted"
      },
      {
        "status": "DOCUMENT_VERIFICATION",
        "timestamp": "2024-01-21T09:15:00Z",
        "description": "Documents under verification"
      }
    ]
  }
}
```

### Search Projects
```http
GET /api/project-reports/search
```

**Query Parameters:**
- `q` (string) - Search query
- `category` (string) - Category filter
- `minInvestment` (number) - Minimum investment
- `maxInvestment` (number) - Maximum investment

## Project Categories
- Food Processing
- Manufacturing
- Textile
- Chemical
- Agriculture
- Service Sector
- Technology
- Healthcare

## Application Status
- `SUBMITTED` - Application submitted
- `UNDER_REVIEW` - Being reviewed
- `APPROVED` - Application approved
- `REJECTED` - Application rejected
- `ADDITIONAL_INFO_REQUIRED` - More info needed

## Error Codes
- `PROJ_001` - Project not found
- `PROJ_002` - Report already purchased
- `PROJ_003` - Payment failed
- `PROJ_004` - Download expired
- `PROJ_005` - Application not found