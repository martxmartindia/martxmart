# Government Schemes API

The Government Schemes API provides information about various government schemes and subsidies.

## Base URL
```
/api/government-schemes
```

## Endpoints

### Get All Schemes
```http
GET /api/government-schemes
```

**Query Parameters:**
- `sector` (string) - Filter by sector
- `ministry` (string) - Filter by ministry
- `status` (string) - Filter by status
- `search` (string) - Search schemes

**Response:**
```json
{
  "success": true,
  "data": {
    "schemes": [
      {
        "id": "scheme_123",
        "name": "PMFME Scheme",
        "slug": "pmfme-scheme",
        "description": "PM Formalization of Micro Food Processing Enterprises",
        "ministry": "Ministry of Food Processing Industries",
        "eligibility": ["Micro enterprises", "Individual entrepreneurs"],
        "benefits": ["35% subsidy", "Credit support", "Training"],
        "sectors": ["Food Processing", "Agriculture"],
        "status": "Active",
        "website": "https://pmfme.gov.in"
      }
    ]
  }
}
```

### Get Scheme Details
```http
GET /api/government-schemes/{slug}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "scheme_123",
    "name": "PMFME Scheme",
    "slug": "pmfme-scheme",
    "description": "PM Formalization of Micro Food Processing Enterprises",
    "ministry": "Ministry of Food Processing Industries",
    "eligibility": [
      "Micro enterprises in food processing",
      "Individual entrepreneurs",
      "Self Help Groups"
    ],
    "benefits": [
      "35% subsidy on plant & machinery",
      "Credit linked subsidy",
      "Training and skill development"
    ],
    "applicationProcess": [
      "Register on official portal",
      "Submit required documents",
      "Application review",
      "Approval and disbursement"
    ],
    "documents": [
      "Aadhar Card",
      "PAN Card",
      "Bank Account Details",
      "Project Report"
    ],
    "sectors": ["Food Processing", "Agriculture"],
    "status": "Active",
    "website": "https://pmfme.gov.in"
  }
}
```

### Search Schemes
```http
GET /api/government-schemes/search
```

**Query Parameters:**
- `q` (string) - Search query
- `sector` (string) - Sector filter
- `beneficiary` (string) - Beneficiary type

### Get Schemes by Sector
```http
GET /api/government-schemes/sector/{sector}
```

### Create Scheme (Admin)
```http
POST /api/government-schemes
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "New Scheme Name",
  "description": "Scheme description",
  "ministry": "Ministry Name",
  "eligibility": ["Eligibility criteria"],
  "benefits": ["Scheme benefits"],
  "sectors": ["Manufacturing", "Technology"],
  "website": "https://scheme-website.gov.in"
}
```

### Update Scheme (Admin)
```http
PUT /api/government-schemes/{id}
```

## Scheme Sectors
- Manufacturing
- Agriculture
- Food Processing
- Textiles
- Technology
- Healthcare
- Education
- Rural Development
- MSME
- Startup

## Scheme Status
- `Active` - Currently accepting applications
- `Inactive` - Not accepting applications
- `Closed` - Scheme closed permanently

## Beneficiary Types
- Individual Entrepreneurs
- Micro Enterprises
- Small Enterprises
- Medium Enterprises
- Self Help Groups
- Cooperatives
- Startups
- Women Entrepreneurs

## Error Codes
- `SCHEME_001` - Scheme not found
- `SCHEME_002` - Invalid sector
- `SCHEME_003` - Scheme not active
- `SCHEME_004` - Invalid search parameters