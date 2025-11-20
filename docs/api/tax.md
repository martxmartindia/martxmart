# Tax Management API

The Tax Management API handles GST calculations, tax rates, and compliance.

## Base URL
```
/api/tax
```

## Endpoints

### Calculate Tax
```http
POST /api/tax/calculate
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "prod_123",
      "hsnCode": "84591000",
      "price": 250000.00,
      "quantity": 2
    }
  ],
  "billingState": "Maharashtra",
  "shippingState": "Maharashtra"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subtotal": 500000.00,
    "taxBreakdown": [
      {
        "hsnCode": "84591000",
        "taxableValue": 500000.00,
        "cgst": 45000.00,
        "sgst": 45000.00,
        "igst": 0.00,
        "totalTax": 90000.00,
        "taxRate": 18.0
      }
    ],
    "totalTax": 90000.00,
    "grandTotal": 590000.00,
    "isInterstate": false
  }
}
```

### Get Tax Rates
```http
GET /api/tax/rates
```

**Query Parameters:**
- `hsnCode` (string) - Filter by HSN code
- `category` (string) - Filter by category

**Response:**
```json
{
  "success": true,
  "data": {
    "taxRates": [
      {
        "hsnCode": "84591000",
        "description": "Machine tools for working metal",
        "gstRate": 18.0,
        "category": "Industrial Machinery",
        "effectiveFrom": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### Get HSN Codes
```http
GET /api/tax/hsn-codes
```

**Query Parameters:**
- `search` (string) - Search HSN codes
- `category` (string) - Filter by category

**Response:**
```json
{
  "success": true,
  "data": {
    "hsnCodes": [
      {
        "code": "84591000",
        "description": "Machine tools for working metal by removing material",
        "gstRate": 18.0,
        "category": "Industrial Machinery"
      }
    ]
  }
}
```

### Generate Tax Invoice
```http
POST /api/tax/invoice
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "orderId": "order_123",
  "invoiceType": "TAX_INVOICE"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invoiceNumber": "INV-2024-001234",
    "invoiceUrl": "https://cdn.martxmart.com/invoices/INV-2024-001234.pdf",
    "generatedAt": "2024-01-20T10:30:00Z"
  }
}
```

### Get Tax Summary
```http
GET /api/tax/summary
```

**Headers:**
```
Authorization: Bearer <vendor-token>
```

**Query Parameters:**
- `period` (string) - Time period (month, quarter, year)
- `year` (number) - Tax year

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "2024-01",
    "totalSales": 2500000.00,
    "taxableValue": 2500000.00,
    "cgstCollected": 225000.00,
    "sgstCollected": 225000.00,
    "igstCollected": 0.00,
    "totalTaxCollected": 450000.00,
    "returns": [
      {
        "returnType": "GSTR1",
        "dueDate": "2024-02-11T23:59:59Z",
        "status": "PENDING"
      }
    ]
  }
}
```

### Update Tax Settings (Admin)
```http
PUT /api/tax/settings
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "defaultGstRate": 18.0,
  "enableTaxCalculation": true,
  "taxInclusivePricing": false,
  "reverseChargeApplicable": false
}
```

## Tax Types
- `CGST` - Central GST (Intrastate)
- `SGST` - State GST (Intrastate)
- `IGST` - Integrated GST (Interstate)
- `CESS` - Additional cess if applicable

## GST Rates
- `0%` - Essential goods
- `5%` - Basic necessities
- `12%` - Standard rate for many goods
- `18%` - Standard rate for services and goods
- `28%` - Luxury goods and services

## Invoice Types
- `TAX_INVOICE` - Standard tax invoice
- `BILL_OF_SUPPLY` - For non-GST transactions
- `CREDIT_NOTE` - For returns/adjustments
- `DEBIT_NOTE` - For additional charges

## Error Codes
- `TAX_001` - Invalid HSN code
- `TAX_002` - Tax calculation failed
- `TAX_003` - Invalid tax rate
- `TAX_004` - Invoice generation failed
- `TAX_005` - Missing tax information