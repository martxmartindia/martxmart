# Orders API

The Orders API handles order creation, processing, tracking, and management for both products and shopping items.

## Base URL
```
/api/orders
```

## Endpoints

### Create Order
Create a new order from cart items.

```http
POST /api/orders
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "shippingAddressId": "addr_123",
  "billingAddressId": "addr_124",
  "paymentMethod": "RAZORPAY",
  "notes": "Please handle with care",
  "items": [
    {
      "type": "PRODUCT",
      "id": "prod_123",
      "quantity": 2,
      "price": 250000.00
    },
    {
      "type": "SHOPPING",
      "id": "shop_456",
      "quantity": 1,
      "price": 1500.00
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "order_123",
      "orderNumber": "ORD-2024-001234",
      "userId": "user_123",
      "totalAmount": 501500.00,
      "status": "PENDING",
      "shippingAddress": {
        "id": "addr_123",
        "contactName": "John Doe",
        "addressLine1": "123 Main St",
        "city": "Mumbai",
        "state": "Maharashtra",
        "zip": "400001"
      },
      "billingAddress": {
        "id": "addr_124",
        "contactName": "John Doe",
        "addressLine1": "123 Main St",
        "city": "Mumbai",
        "state": "Maharashtra",
        "zip": "400001"
      },
      "items": [
        {
          "id": "item_123",
          "type": "PRODUCT",
          "productId": "prod_123",
          "quantity": 2,
          "price": 250000.00,
          "subtotal": 500000.00,
          "product": {
            "name": "CNC Lathe Machine",
            "images": ["image1.jpg"]
          }
        }
      ],
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "paymentDetails": {
      "razorpayOrderId": "order_razorpay_123",
      "amount": 501500.00,
      "currency": "INR"
    }
  },
  "message": "Order created successfully"
}
```

### Get User Orders
Get orders for authenticated user.

```http
GET /api/orders
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20)
- `status` (string) - Filter by order status
- `dateFrom` (string) - Filter orders from date (ISO format)
- `dateTo` (string) - Filter orders to date (ISO format)

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order_123",
        "orderNumber": "ORD-2024-001234",
        "totalAmount": 501500.00,
        "status": "CONFIRMED",
        "itemCount": 3,
        "createdAt": "2024-01-15T10:30:00Z",
        "items": [
          {
            "id": "item_123",
            "quantity": 2,
            "price": 250000.00,
            "product": {
              "name": "CNC Lathe Machine",
              "images": ["image1.jpg"]
            }
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "pages": 2,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Get Order by ID
Get detailed order information.

```http
GET /api/orders/{id}
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
    "id": "order_123",
    "orderNumber": "ORD-2024-001234",
    "userId": "user_123",
    "totalAmount": 501500.00,
    "status": "CONFIRMED",
    "shippingAddress": {
      "contactName": "John Doe",
      "phone": "+1234567890",
      "addressLine1": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zip": "400001"
    },
    "billingAddress": {
      "contactName": "John Doe",
      "addressLine1": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zip": "400001"
    },
    "payment": {
      "id": "pay_123",
      "method": "RAZORPAY",
      "status": "COMPLETED",
      "amount": 501500.00,
      "razorpayPaymentId": "pay_razorpay_123",
      "createdAt": "2024-01-15T10:35:00Z"
    },
    "items": [
      {
        "id": "item_123",
        "productId": "prod_123",
        "quantity": 2,
        "price": 250000.00,
        "subtotal": 500000.00,
        "product": {
          "name": "CNC Lathe Machine",
          "images": ["image1.jpg"],
          "brand": "TechMach"
        }
      },
      {
        "id": "item_124",
        "shoppingId": "shop_456",
        "quantity": 1,
        "price": 1500.00,
        "subtotal": 1500.00,
        "shopping": {
          "name": "Cotton Saree",
          "images": ["saree1.jpg"]
        }
      }
    ],
    "notes": "Please handle with care",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:35:00Z"
  }
}
```

### Update Order Status
Update order status (Vendor/Admin only).

```http
PUT /api/orders/{id}/status
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "SHIPPED",
  "trackingNumber": "TRK123456789",
  "notes": "Order shipped via courier"
}
```

### Cancel Order
Cancel an order (Customer/Admin only).

```http
POST /api/orders/{id}/cancel
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Changed mind",
  "refundRequested": true
}
```

### Get Order Tracking
Get order tracking information.

```http
GET /api/orders/{id}/tracking
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_123",
    "orderNumber": "ORD-2024-001234",
    "status": "SHIPPED",
    "trackingNumber": "TRK123456789",
    "estimatedDelivery": "2024-01-25T18:00:00Z",
    "timeline": [
      {
        "status": "PENDING",
        "timestamp": "2024-01-15T10:30:00Z",
        "description": "Order placed successfully"
      },
      {
        "status": "CONFIRMED",
        "timestamp": "2024-01-15T11:00:00Z",
        "description": "Order confirmed by vendor"
      },
      {
        "status": "PROCESSING",
        "timestamp": "2024-01-16T09:00:00Z",
        "description": "Order is being processed"
      },
      {
        "status": "SHIPPED",
        "timestamp": "2024-01-18T14:30:00Z",
        "description": "Order shipped via courier"
      }
    ]
  }
}
```

### Get Vendor Orders
Get orders for vendor's products (Vendor only).

```http
GET /api/orders/vendor
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `status` (string) - Filter by status
- `productId` (string) - Filter by product

### Get Admin Orders
Get all orders (Admin only).

```http
GET /api/orders/admin
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `status` (string) - Filter by status
- `vendorId` (string) - Filter by vendor
- `dateFrom` (string) - Date range filter
- `dateTo` (string) - Date range filter

### Generate Invoice
Generate invoice for an order.

```http
GET /api/orders/{id}/invoice
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
    "invoiceUrl": "https://cdn.martxmart.com/invoices/INV-2024-001234.pdf",
    "invoiceNumber": "INV-2024-001234"
  }
}
```

### Bulk Update Orders
Update multiple orders (Admin only).

```http
PUT /api/orders/bulk
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "orderIds": ["order_123", "order_456"],
  "updates": {
    "status": "SHIPPED"
  }
}
```

## Order Status Flow

### Status Values
- `PENDING` - Order placed, awaiting confirmation
- `CONFIRMED` - Order confirmed by vendor
- `PROCESSING` - Order being prepared
- `SHIPPED` - Order dispatched
- `DELIVERED` - Order delivered to customer
- `CANCELLED` - Order cancelled
- `RETURNED` - Order returned by customer
- `REFUNDED` - Order refunded

### Status Transitions
```
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
    ↓         ↓           ↓          ↓
CANCELLED  CANCELLED  CANCELLED  RETURNED → REFUNDED
```

## Payment Integration

### Payment Methods
- `RAZORPAY` - Razorpay payment gateway
- `COD` - Cash on delivery
- `BANK_TRANSFER` - Direct bank transfer
- `UPI` - UPI payments

### Payment Status
- `PENDING` - Payment initiated
- `COMPLETED` - Payment successful
- `FAILED` - Payment failed
- `REFUNDED` - Payment refunded

## Error Codes
- `ORD_001` - Order not found
- `ORD_002` - Insufficient stock
- `ORD_003` - Invalid address
- `ORD_004` - Payment failed
- `ORD_005` - Order cannot be cancelled
- `ORD_006` - Invalid status transition
- `ORD_007` - Unauthorized access
- `ORD_008` - Order already processed
- `ORD_009` - Invalid order items
- `ORD_010` - Delivery address required