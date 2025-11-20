# Cart API

The Cart API manages shopping cart operations for both products (machines) and shopping items.

## Base URL
```
/api/cart
```

## Endpoints

### Get Cart
Retrieve user's cart with all items.

```http
GET /api/cart
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
    "id": "cart_123",
    "userId": "user_123",
    "items": [
      {
        "id": "item_123",
        "type": "PRODUCT",
        "productId": "prod_123",
        "quantity": 2,
        "price": 250000.00,
        "subtotal": 500000.00,
        "product": {
          "id": "prod_123",
          "name": "CNC Lathe Machine",
          "images": ["image1.jpg"],
          "stock": 5,
          "brand": "TechMach"
        }
      },
      {
        "id": "item_124",
        "type": "SHOPPING",
        "shoppingId": "shop_456",
        "quantity": 1,
        "price": 1500.00,
        "subtotal": 1500.00,
        "shopping": {
          "id": "shop_456",
          "name": "Cotton Saree",
          "images": ["saree1.jpg"],
          "stock": 10
        }
      }
    ],
    "summary": {
      "itemCount": 3,
      "subtotal": 501500.00,
      "tax": 90270.00,
      "shipping": 5000.00,
      "total": 596770.00
    },
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Add Item to Cart
Add a product or shopping item to cart.

```http
POST /api/cart/items
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (Product):**
```json
{
  "type": "PRODUCT",
  "productId": "prod_123",
  "quantity": 2
}
```

**Request Body (Shopping Item):**
```json
{
  "type": "SHOPPING",
  "shoppingId": "shop_456",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "item": {
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
    },
    "cartSummary": {
      "itemCount": 3,
      "subtotal": 501500.00,
      "total": 596770.00
    }
  },
  "message": "Item added to cart successfully"
}
```

### Update Cart Item
Update quantity of an item in cart.

```http
PUT /api/cart/items/{itemId}
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "item": {
      "id": "item_123",
      "quantity": 3,
      "price": 250000.00,
      "subtotal": 750000.00
    },
    "cartSummary": {
      "itemCount": 4,
      "subtotal": 751500.00,
      "total": 846770.00
    }
  },
  "message": "Cart item updated successfully"
}
```

### Remove Item from Cart
Remove an item from cart.

```http
DELETE /api/cart/items/{itemId}
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
    "cartSummary": {
      "itemCount": 1,
      "subtotal": 1500.00,
      "total": 1770.00
    }
  },
  "message": "Item removed from cart successfully"
}
```

### Clear Cart
Remove all items from cart.

```http
DELETE /api/cart
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

### Apply Coupon
Apply a discount coupon to cart.

```http
POST /api/cart/coupon
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "couponCode": "SAVE20"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "coupon": {
      "code": "SAVE20",
      "discount": 20,
      "discountAmount": 100300.00
    },
    "cartSummary": {
      "itemCount": 3,
      "subtotal": 501500.00,
      "discount": 100300.00,
      "tax": 72216.00,
      "shipping": 5000.00,
      "total": 478416.00
    }
  },
  "message": "Coupon applied successfully"
}
```

### Remove Coupon
Remove applied coupon from cart.

```http
DELETE /api/cart/coupon
```

**Headers:**
```
Authorization: Bearer <token>
```

### Get Cart Summary
Get cart summary without full item details.

```http
GET /api/cart/summary
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
    "itemCount": 3,
    "subtotal": 501500.00,
    "tax": 90270.00,
    "shipping": 5000.00,
    "discount": 0.00,
    "total": 596770.00,
    "hasItems": true
  }
}
```

### Validate Cart
Validate cart items for stock availability and pricing.

```http
POST /api/cart/validate
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
    "isValid": true,
    "issues": [],
    "summary": {
      "itemCount": 3,
      "total": 596770.00
    }
  }
}
```

**Response (with issues):**
```json
{
  "success": true,
  "data": {
    "isValid": false,
    "issues": [
      {
        "itemId": "item_123",
        "type": "STOCK_INSUFFICIENT",
        "message": "Only 3 items available in stock",
        "availableStock": 3,
        "requestedQuantity": 5
      },
      {
        "itemId": "item_124",
        "type": "PRICE_CHANGED",
        "message": "Price has been updated",
        "oldPrice": 1500.00,
        "newPrice": 1600.00
      }
    ]
  }
}
```

### Move to Wishlist
Move cart item to wishlist.

```http
POST /api/cart/items/{itemId}/move-to-wishlist
```

**Headers:**
```
Authorization: Bearer <token>
```

### Bulk Add Items
Add multiple items to cart at once.

```http
POST /api/cart/bulk-add
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "type": "PRODUCT",
      "productId": "prod_123",
      "quantity": 2
    },
    {
      "type": "SHOPPING",
      "shoppingId": "shop_456",
      "quantity": 1
    }
  ]
}
```

### Get Abandoned Carts
Get abandoned carts for marketing (Admin only).

```http
GET /api/cart/abandoned
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `days` (number) - Days since last update (default: 7)
- `minValue` (number) - Minimum cart value
- `page` (number) - Page number
- `limit` (number) - Items per page

## Cart Item Types

### Product Items
Items from the Product model (industrial machines).

### Shopping Items
Items from the Shopping model (general products).

## Cart Calculations

### Subtotal
Sum of all item subtotals (quantity × price).

### Tax Calculation
GST calculated based on product HSN codes and applicable rates.

### Shipping Charges
Calculated based on:
- Item weight and dimensions
- Delivery location
- Shipping method selected

### Discount Application
- Percentage discounts applied to subtotal
- Fixed amount discounts deducted from total
- Maximum discount limits enforced

## Error Codes
- `CART_001` - Cart not found
- `CART_002` - Item not found in cart
- `CART_003` - Insufficient stock
- `CART_004` - Invalid quantity
- `CART_005` - Product not available
- `CART_006` - Invalid coupon code
- `CART_007` - Coupon expired
- `CART_008` - Coupon usage limit exceeded
- `CART_009` - Minimum order value not met
- `CART_010` - Maximum cart limit exceeded

## Business Rules

### Stock Validation
- Real-time stock checking before adding items
- Automatic quantity adjustment if stock insufficient
- Out-of-stock items automatically removed

### Pricing
- Prices locked when items added to cart
- Price changes notified during validation
- Discounts applied in real-time

### Cart Persistence
- Cart items persist across sessions
- Automatic cleanup of expired carts
- Guest cart conversion on login