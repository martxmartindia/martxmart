# Payment API

The Payment API handles payment processing, verification, and management using Razorpay integration.

## Base URL
```
/api/payment
```

## Endpoints

### Initialize Payment
Create a payment order for checkout.

```http
POST /api/payment/init
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "orderId": "order_123",
  "amount": 596770.00,
  "currency": "INR",
  "method": "RAZORPAY"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_123",
    "razorpayOrderId": "order_razorpay_123",
    "amount": 596770.00,
    "currency": "INR",
    "key": "rzp_test_1234567890",
    "orderId": "order_123",
    "orderNumber": "ORD-2024-001234",
    "customerDetails": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "notes": {
      "orderId": "order_123",
      "customerId": "user_123"
    }
  },
  "message": "Payment initialized successfully"
}
```

### Verify Payment
Verify payment after successful transaction.

```http
POST /api/payment/verify
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "razorpayOrderId": "order_razorpay_123",
  "razorpayPaymentId": "pay_razorpay_456",
  "razorpaySignature": "signature_hash_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_123",
    "status": "COMPLETED",
    "orderId": "order_123",
    "amount": 596770.00,
    "transactionId": "txn_123456789",
    "method": "CARD",
    "verifiedAt": "2024-01-15T10:35:00Z"
  },
  "message": "Payment verified successfully"
}
```

### Get Payment Status
Check payment status by ID.

```http
GET /api/payment/{paymentId}/status
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
    "paymentId": "pay_123",
    "status": "COMPLETED",
    "amount": 596770.00,
    "currency": "INR",
    "method": "CARD",
    "razorpayPaymentId": "pay_razorpay_456",
    "transactionId": "txn_123456789",
    "createdAt": "2024-01-15T10:30:00Z",
    "completedAt": "2024-01-15T10:35:00Z"
  }
}
```

### Process Refund
Initiate refund for a payment.

```http
POST /api/payment/{paymentId}/refund
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 596770.00,
  "reason": "Order cancelled by customer",
  "notes": {
    "refund_reason": "customer_request"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "refundId": "rfnd_123",
    "paymentId": "pay_123",
    "amount": 596770.00,
    "status": "PROCESSED",
    "razorpayRefundId": "rfnd_razorpay_789",
    "reason": "Order cancelled by customer",
    "processedAt": "2024-01-15T11:00:00Z",
    "estimatedSettlement": "2024-01-20T00:00:00Z"
  },
  "message": "Refund processed successfully"
}
```

### Get Payment History
Get payment history for user.

```http
GET /api/payment/history
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20)
- `status` (string) - Filter by payment status
- `method` (string) - Filter by payment method
- `dateFrom` (string) - Date range filter (ISO format)
- `dateTo` (string) - Date range filter (ISO format)

**Response:**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "pay_123",
        "orderId": "order_123",
        "orderNumber": "ORD-2024-001234",
        "amount": 596770.00,
        "status": "COMPLETED",
        "method": "CARD",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "pages": 1,
      "hasNext": false,
      "hasPrev": false
    },
    "summary": {
      "totalAmount": 2500000.00,
      "completedPayments": 12,
      "failedPayments": 2,
      "refundedAmount": 150000.00
    }
  }
}
```

### Webhook Handler
Handle Razorpay webhooks for payment events.

```http
POST /api/payment/webhook
```

**Headers:**
```
X-Razorpay-Signature: webhook_signature_here
Content-Type: application/json
```

**Request Body:**
```json
{
  "entity": "event",
  "account_id": "acc_razorpay_123",
  "event": "payment.captured",
  "contains": ["payment"],
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_razorpay_456",
        "amount": 59677000,
        "currency": "INR",
        "status": "captured",
        "order_id": "order_razorpay_123",
        "method": "card"
      }
    }
  },
  "created_at": 1642248600
}
```

### Get Payment Methods
Get available payment methods.

```http
GET /api/payment/methods
```

**Response:**
```json
{
  "success": true,
  "data": {
    "methods": [
      {
        "id": "RAZORPAY",
        "name": "Razorpay",
        "description": "Credit/Debit Cards, UPI, Net Banking",
        "enabled": true,
        "supportedTypes": ["CARD", "UPI", "NETBANKING", "WALLET"]
      },
      {
        "id": "COD",
        "name": "Cash on Delivery",
        "description": "Pay when you receive the order",
        "enabled": true,
        "maxAmount": 50000.00
      }
    ]
  }
}
```

### Calculate Payment Fees
Calculate payment processing fees.

```http
POST /api/payment/calculate-fees
```

**Request Body:**
```json
{
  "amount": 596770.00,
  "method": "RAZORPAY",
  "paymentType": "CARD"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "amount": 596770.00,
    "processingFee": 11935.40,
    "gst": 2148.37,
    "totalFee": 14083.77,
    "netAmount": 582686.23,
    "feePercentage": 2.36
  }
}
```

### Retry Failed Payment
Retry a failed payment.

```http
POST /api/payment/{paymentId}/retry
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
    "paymentId": "pay_124",
    "razorpayOrderId": "order_razorpay_124",
    "amount": 596770.00,
    "retryAttempt": 2
  },
  "message": "Payment retry initiated"
}
```

## Payment Methods

### Razorpay
- **Cards**: Visa, Mastercard, RuPay, American Express
- **UPI**: Google Pay, PhonePe, Paytm, BHIM
- **Net Banking**: All major banks
- **Wallets**: Paytm, Mobikwik, Freecharge
- **EMI**: Credit card EMI options

### Cash on Delivery (COD)
- Available for orders up to ₹50,000
- Additional COD charges may apply
- Verification required for high-value orders

### Bank Transfer
- Direct bank transfer option
- Manual verification required
- 2-3 business days processing time

## Payment Status

### Status Values
- `PENDING` - Payment initiated
- `PROCESSING` - Payment being processed
- `COMPLETED` - Payment successful
- `FAILED` - Payment failed
- `CANCELLED` - Payment cancelled
- `REFUNDED` - Payment refunded
- `PARTIALLY_REFUNDED` - Partial refund processed

### Payment Flow
```
PENDING → PROCESSING → COMPLETED
    ↓         ↓           ↓
CANCELLED  FAILED    REFUNDED
```

## Security Features

### Payment Security
- PCI DSS compliant payment processing
- 256-bit SSL encryption
- Tokenization of sensitive data
- 3D Secure authentication for cards

### Fraud Prevention
- Real-time fraud detection
- Risk scoring algorithms
- Velocity checks
- Device fingerprinting

### Webhook Security
- Signature verification
- IP whitelisting
- Replay attack prevention
- Event deduplication

## Error Codes
- `PAY_001` - Payment not found
- `PAY_002` - Invalid payment amount
- `PAY_003` - Payment method not supported
- `PAY_004` - Payment verification failed
- `PAY_005` - Insufficient funds
- `PAY_006` - Payment gateway error
- `PAY_007` - Refund not allowed
- `PAY_008` - Invalid signature
- `PAY_009` - Payment expired
- `PAY_010` - Duplicate payment attempt

## Webhook Events
- `payment.authorized` - Payment authorized
- `payment.captured` - Payment captured
- `payment.failed` - Payment failed
- `refund.created` - Refund initiated
- `refund.processed` - Refund completed
- `order.paid` - Order payment completed