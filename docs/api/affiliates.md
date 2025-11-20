# Affiliates API

The Affiliates API manages the referral program and affiliate rewards.

## Base URL
```
/api/affiliates
```

## Endpoints

### Get Affiliate Profile
```http
GET /api/affiliates/profile
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
    "id": "aff_123",
    "userId": "user_123",
    "coins": 2500,
    "referralCode": "JOHN2024",
    "referredUsers": 15,
    "totalEarnings": 7500.00,
    "level": "Silver",
    "nextLevelRequirement": "Refer 10 more users",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Generate Referral Link
```http
POST /api/affiliates/referral-link
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "prod_123",
  "campaign": "new-year-sale"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "referralLink": "https://martxmart.com/products/cnc-lathe-machine?ref=JOHN2024",
    "shortLink": "https://mxm.co/r/JOHN2024",
    "qrCode": "https://cdn.martxmart.com/qr/JOHN2024.png"
  }
}
```

### Get Referral History
```http
GET /api/affiliates/referrals
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `status` (string) - Filter by status

**Response:**
```json
{
  "success": true,
  "data": {
    "referrals": [
      {
        "id": "ref_123",
        "referredUser": {
          "name": "Jane Smith",
          "email": "jane@example.com"
        },
        "status": "COMPLETED",
        "coinsEarned": 500,
        "orderValue": 25000.00,
        "referredAt": "2024-01-18T10:30:00Z",
        "completedAt": "2024-01-20T15:45:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "pages": 1
    }
  }
}
```

### Redeem Coins
```http
POST /api/affiliates/redeem
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "coins": 1000,
  "redeemType": "CASH",
  "bankDetails": {
    "accountNumber": "1234567890",
    "ifscCode": "HDFC0001234",
    "accountHolderName": "John Doe"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "redemptionId": "redeem_123",
    "coins": 1000,
    "cashValue": 100.00,
    "status": "PENDING",
    "processingTime": "3-5 business days",
    "requestedAt": "2024-01-20T10:30:00Z"
  }
}
```

### Get Redemption History
```http
GET /api/affiliates/redemptions
```

**Headers:**
```
Authorization: Bearer <token>
```

### Get Affiliate Leaderboard
```http
GET /api/affiliates/leaderboard
```

**Query Parameters:**
- `period` (string) - Time period (month, quarter, year)
- `limit` (number) - Number of top affiliates

**Response:**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "user_456",
        "name": "Top Affiliate",
        "referralCode": "TOP2024",
        "referredUsers": 45,
        "coinsEarned": 12500,
        "level": "Gold"
      }
    ],
    "userRank": {
      "rank": 15,
      "totalAffiliates": 250
    }
  }
}
```

### Get Affiliate Analytics (Admin)
```http
GET /api/affiliates/analytics
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalAffiliates": 250,
      "activeAffiliates": 180,
      "totalReferrals": 1250,
      "totalCoinsDistributed": 125000,
      "conversionRate": 15.2
    },
    "topPerformers": [
      {
        "userId": "user_456",
        "name": "Top Affiliate",
        "referrals": 45,
        "earnings": 12500
      }
    ],
    "monthlyTrend": {
      "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      "referrals": [85, 95, 110, 125, 115, 135],
      "conversions": [12, 15, 18, 22, 19, 25]
    }
  }
}
```

## Affiliate Levels
- **Bronze**: 0-9 referrals (10 coins per referral)
- **Silver**: 10-24 referrals (15 coins per referral)
- **Gold**: 25-49 referrals (20 coins per referral)
- **Platinum**: 50+ referrals (25 coins per referral)

## Referral Status
- `PENDING` - User registered but not verified
- `COMPLETED` - User made first purchase
- `EXPIRED` - Referral link expired
- `CANCELLED` - Referral cancelled

## Redemption Types
- `CASH` - Direct bank transfer
- `COUPON` - Platform discount coupon
- `PRODUCT` - Product voucher
- `DONATION` - Charity donation

## Coin Values
- 1 Coin = ₹0.10
- Minimum redemption: 1000 coins (₹100)
- Maximum redemption per month: 50,000 coins (₹5,000)

## Error Codes
- `AFF_001` - Affiliate profile not found
- `AFF_002` - Insufficient coins for redemption
- `AFF_003` - Invalid bank details
- `AFF_004` - Referral code already exists
- `AFF_005` - Self-referral not allowed
- `AFF_006` - Redemption limit exceeded