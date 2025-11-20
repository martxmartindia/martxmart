# martXmart API Documentation

Welcome to the martXmart API documentation. This comprehensive guide covers all API endpoints for the multi-vendor e-commerce platform.

## Base URL
```
Production: https://api.martxmart.com
Development: http://localhost:3000/api
```

## Authentication
All API requests require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Modules

### Core Modules
- [Authentication](./auth.md) - User login, registration, and token management
- [Products](./products.md) - Product catalog management (machines)
- [Shopping](./shopping.md) - General products management
- [Orders](./orders.md) - Order processing and management
- [Cart](./cart.md) - Shopping cart operations
- [Payment](./payment.md) - Payment processing with Razorpay

### User Management
- [Users](./users.md) - User profile and account management
- [Addresses](./addresses.md) - User address management
- [Wishlist](./wishlist.md) - User wishlist operations

### Vendor Management
- [Vendors](./vendors.md) - Vendor registration and profile management
- [Vendor Applications](./vendor-applications.md) - Vendor application process

### Content Management
- [Categories](./categories.md) - Product category management
- [Reviews](./reviews.md) - Product reviews and ratings
- [Blog](./blog.md) - Blog and content management

### Business Operations
- [Quotations](./quotations.md) - Quote request and management
- [Inventory](./inventory.md) - Stock and inventory management
- [Commissions](./commissions.md) - Vendor commission tracking
- [Coupons](./coupons.md) - Discount and coupon management

### Franchise System
- [Franchises](./franchises.md) - Franchise management
- [Franchise Applications](./franchise-applications.md) - Franchise application process

### Support & Communication
- [Notifications](./notifications.md) - Push notifications and alerts
- [Messages](./messages.md) - Internal messaging system
- [Tickets](./tickets.md) - Support ticket system
- [Contact](./contact.md) - Contact form and inquiries
- [Newsletter](./newsletter.md) - Email subscriptions and campaigns

### Services & Business Support
- [Services](./services.md) - Business services (GST, MSME, Company registration)
- [Government Schemes](./government-schemes.md) - Government schemes and subsidies
- [Plants](./plants.md) - Industrial plant and machinery catalog
- [Credit Score](./credit-score.md) - Credit score checking services

### Analytics & Reporting
- [Analytics](./analytics.md) - Business analytics and reporting
- [Project Reports](./project-reports.md) - Project report management

### Content & Media
- [Media](./media.md) - Press releases, news, and media kits
- [Careers](./careers.md) - Job postings and applications

### Marketing & Growth
- [Affiliates](./affiliates.md) - Referral program and affiliate rewards
- [Quote Requests](./quote-requests.md) - Customer quote requests and vendor responses
- [Slides](./slides.md) - Hero slides and carousel management
- [Advertisements](./advertisements.md) - Promotional banners and ads

### Administrative
- [Admin](./admin.md) - Administrative operations
- [Permissions](./permissions.md) - Role-based access control
- [Tax Management](./tax.md) - Tax calculation and management

## Response Format
All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
```

## HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting
API requests are rate-limited to prevent abuse:
- **Authenticated users**: 1000 requests per hour
- **Unauthenticated users**: 100 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Pagination
List endpoints support pagination with the following parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

Pagination response format:
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtering and Sorting
Most list endpoints support filtering and sorting:
- `sort` - Sort field (e.g., `createdAt`, `name`)
- `order` - Sort order (`asc` or `desc`)
- `filter[field]` - Filter by field value

Example:
```
GET /api/products?sort=price&order=asc&filter[category]=electronics
```

## Webhooks
martXmart supports webhooks for real-time event notifications:
- Payment confirmations
- Order status updates
- Inventory changes

Configure webhooks in your vendor dashboard.

## SDKs and Libraries
Official SDKs are available for:
- JavaScript/Node.js
- Python
- PHP
- Java

## Support
For API support:
- Email: api-support@martxmart.com
- Documentation: https://docs.martxmart.com
- Status Page: https://status.martxmart.com