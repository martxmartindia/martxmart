# Careers API

The Careers API manages job postings and applications.

## Base URL
```
/api/careers
```

## Endpoints

### Get Job Openings
```http
GET /api/careers
```

**Query Parameters:**
- `department` (string) - Filter by department
- `location` (string) - Filter by location
- `type` (string) - Filter by job type
- `experience` (string) - Filter by experience level

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "job_123",
        "title": "Software Engineer",
        "department": "Engineering",
        "location": "Mumbai",
        "type": "Full-time",
        "experience": "2-4 years",
        "description": "Join our engineering team",
        "responsibilities": ["Develop features", "Code review"],
        "requirements": ["React.js", "Node.js"],
        "benefits": ["Health insurance", "Flexible hours"],
        "salary": "8-12 LPA",
        "status": "ACTIVE",
        "postedDate": "2024-01-20T10:30:00Z",
        "closingDate": "2024-02-20T23:59:59Z"
      }
    ]
  }
}
```

### Get Job Details
```http
GET /api/careers/{id}
```

### Apply for Job
```http
POST /api/careers/{id}/apply
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "resumeUrl": "resume.pdf",
  "coverLetter": "I am interested in this position...",
  "experience": "3 years",
  "currentCompany": "Tech Corp",
  "expectedSalary": "10 LPA"
}
```

### Get Applications (Admin)
```http
GET /api/careers/applications
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

### Update Application Status (Admin)
```http
PUT /api/careers/applications/{id}/status
```

**Request Body:**
```json
{
  "status": "SHORTLISTED",
  "notes": "Good candidate for interview"
}
```

## Job Status
- `ACTIVE` - Job is open for applications
- `CLOSED` - Job closed
- `FILLED` - Position filled

## Application Status
- `PENDING` - Application submitted
- `SHORTLISTED` - Candidate shortlisted
- `INTERVIEWED` - Interview completed
- `SELECTED` - Candidate selected
- `REJECTED` - Application rejected

## Error Codes
- `CAR_001` - Job not found
- `CAR_002` - Application deadline passed
- `CAR_003` - Already applied
- `CAR_004` - Invalid resume format