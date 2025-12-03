 # martXmart - Multi-Vendor E-commerce Platform

martXmart is a modern, feature-rich e-commerce platform built with Next.js 15, enabling multiple vendors to sell their products through a unified marketplace. The platform offers a seamless shopping experience with integrated payment processing, real-time chat, comprehensive order management, and advanced analytics. Our platform prioritizes security, scalability, and user experience while providing robust tools for vendors and administrators.

## Overview

- **Multi-vendor Support**: Enable multiple sellers to manage their stores independently
- **Real-time Features**: Instant messaging, live notifications, and order updates
- **Responsive Design**: Optimized for all devices and screen sizes
- **Scalable Architecture**: Built to handle high traffic and large product catalogs
- **Security First**: Implements industry best practices for e-commerce security
- **Analytics & Reporting**: Comprehensive insights for vendors and administrators

## Key Features

### For Customers
- User authentication and profile management
- Product browsing with advanced filtering and search
- Shopping cart and wishlist functionality
- Secure checkout with multiple payment options
- Real-time order tracking
- Direct chat with vendors
- Product reviews and ratings

### For Vendors
- Vendor dashboard for product management
- Order processing and fulfillment
- Inventory management
- Sales analytics and reporting
- Customer communication through integrated chat
- Product listing and pricing management

### For Administrators
- Comprehensive admin dashboard
- Vendor approval and management
- Product category management
- User management
- Platform-wide analytics
- Content management system

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router for server-side rendering and optimal performance
- **UI Library**: React 18 with TypeScript for type-safe development
- **Styling**: Tailwind CSS for responsive and maintainable design
- **State Management**: Custom hooks and context for efficient state handling
- **Real-time**: WebSocket integration for chat and notifications

### Backend
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Authentication**: JWT-based system with refresh token rotation
- **File Storage**: Cloudinary for scalable media management
- **Caching**: Redis for performance optimization
- **API**: RESTful endpoints with OpenAPI specification

### Infrastructure
- **Payment**: Razorpay integration with webhook support
- **Monitoring**: Sentry for error tracking
- **Analytics**: Google Analytics 4 integration
- **Search**: Elasticsearch for fast product search
- **Email**: SendGrid for transactional emails

## Getting Started

### Prerequisites

- Node.js 16.x or later
- PostgreSQL database
- Razorpay account for payment processing
- Cloudinary account for image storage

### Installation

1. Clone the repository:
```bash
git clone https://github.com/raobadalyadav11/whatsupmart.git
cd martXmart
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add the following variables:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/martXmart"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Razorpay
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

4. Initialize the database:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
├── app/                 # Next.js 13 app directory
│   ├── (admin)/        # Admin dashboard routes
│   ├── (auth)/         # Authentication routes
│   ├── (vendor)/       # Vendor dashboard routes
│   ├── api/            # API routes
│   └── ...             # Other app routes
├── components/         # Reusable React components
├── lib/                # Utility functions and configurations
├── prisma/             # Database schema and migrations
├── public/             # Static assets
├── store/              # State management
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## API Documentation

📚 **Complete API Documentation**: [View Full Documentation](./docs/api/index.md)

The API is organized around REST principles with comprehensive documentation covering all 40+ endpoints. All endpoints return JSON responses and use standard HTTP response codes. Rate limiting is applied to all endpoints.

### 🔗 Quick Links
- **[Authentication API](./docs/api/auth.md)** - Login, registration, OTP verification
- **[Products API](./docs/api/products.md)** - Industrial machinery catalog
- **[Shopping API](./docs/api/shopping.md)** - Consumer products catalog
- **[Orders API](./docs/api/orders.md)** - Order processing and tracking
- **[Payment API](./docs/api/payment.md)** - Razorpay integration
- **[Vendors API](./docs/api/vendors.md)** - Vendor management
- **[Franchises API](./docs/api/franchises.md)** - Franchise operations

### 🎯 API Features

#### Multi-Product Support
- **Industrial Machinery** - Heavy equipment, CNC machines, manufacturing tools
- **Consumer Products** - Clothing, electronics, home goods, groceries
- **Festival Products** - Seasonal and festival-specific items

#### Business Models
- **B2B** - Quote-to-order workflow for industrial equipment
- **B2C** - Direct purchase for consumer products
- **Marketplace** - Multi-vendor platform with commission tracking
- **Franchise** - Regional franchise operations

#### Advanced Features
- ✅ JWT authentication with refresh tokens
- ✅ Role-based access control (Customer, Vendor, Admin, Franchise)
- ✅ Real-time inventory management
- ✅ Integrated payment processing (Razorpay)
- ✅ Comprehensive analytics and reporting
- ✅ Multi-language support
- ✅ Webhook integration

### 📋 API Categories

#### Core E-commerce (6 APIs)
- Authentication, Products, Shopping, Orders, Cart, Payment

#### User & Vendor Management (5 APIs)
- Users, Addresses, Wishlist, Vendors, Vendor Applications

#### Business Operations (7 APIs)
- Quotations, Inventory, Commissions, Coupons, Categories, Reviews, Tax

#### Franchise System (2 APIs)
- Franchises, Franchise Applications

#### Services & Support (8 APIs)
- Services, Government Schemes, Plants, Contact, Newsletter, Messages, Notifications, Tickets

#### Content & Media (6 APIs)
- Blog, Media, Careers, Slides, Advertisements, Project Reports

#### Analytics & Growth (4 APIs)
- Analytics, Affiliates, Credit Score, Quote Requests

#### Administrative (3 APIs)
- Admin, Permissions, Tax Management

### 🚀 Quick Start Example

```javascript
// Authentication
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { token } = await response.json();

// Get products
const products = await fetch('/api/products', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### 📊 Response Format

**Success Response:**
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

### 🔐 Security Features
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- Security headers (HSTS, CSP)

### 📈 Rate Limits
- **Authenticated Users**: 1000 requests/hour
- **Unauthenticated Users**: 100 requests/hour
- **Admin Users**: 5000 requests/hour

## Deployment

### Vercel Deployment (Recommended)

1. Push your code to a GitHub repository
2. Create a new project on [Vercel](https://vercel.com)
3. Connect your GitHub repository
4. Configure environment variables in Vercel dashboard
5. Deploy and verify the deployment

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t martXmart .
```

2. Run the container:
```bash
docker run -p 3000:3000 --env-file .env martXmart
```

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

### Environment Configuration

Ensure all required environment variables are set:

```env
# App
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.example.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/martXmart

# External Services
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Security Considerations

- All API endpoints are protected with rate limiting
- JWT tokens are rotated regularly
- Password hashing using bcrypt with appropriate salt rounds
- Input validation and sanitization on all endpoints
- CORS configuration for allowed origins
- Security headers implementation (HSTS, CSP, etc.)
- Regular security audits and dependency updates

## Performance Optimization

- Implemented lazy loading for images and components
- API response caching with Redis
- Database query optimization with proper indexing
- CDN integration for static assets
- Compression and minification of assets
- Optimized bundle size with code splitting

## Testing

### Unit Testing
```bash
npm run test:unit
```

### Integration Testing
```bash
npm run test:integration
```

### E2E Testing
```bash
npm run test:e2e
```

## Monitoring

- Error tracking with Sentry
- Performance monitoring with New Relic
- Custom analytics dashboard for business metrics
- Automated alerts for system issues
- Regular backup and recovery testing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Development Workflow

### Code Style and Standards
- ESLint configuration for consistent code style
- Prettier for automatic code formatting
- TypeScript strict mode enabled
- Conventional commits for version control

### Branch Strategy
- `main` - Production branch
- `develop` - Development branch
- `feature/*` - Feature branches
- `hotfix/*` - Hotfix branches

### CI/CD Pipeline
- Automated testing on pull requests
- Code quality checks with SonarQube
- Automated deployment to staging
- Manual approval for production deployment

## Internationalization

martXmart supports multiple languages through Next.js Internationalization:

- Default language: English
- Supported languages: Spanish, French, German, Arabic
- RTL support for Arabic language
- Language detection based on browser settings
- Language switching without page reload

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connection
npx prisma db pull

# Reset database
npx prisma migrate reset
```

#### Payment Integration
- Verify Razorpay credentials
- Check webhook configuration
- Validate order creation payload

#### Image Upload
- Verify Cloudinary configuration
- Check file size limits
- Validate supported formats

### Debug Mode

Enable debug mode by setting:
```env
DEBUG=martXmart:*
LOG_LEVEL=debug
```

## Support

For support:
- Email: support@martXmart.com
- Slack: [Join our community](https://slack.martXmart.com)
- Documentation: [docs.martXmart.com](https://docs.martXmart.com)
- GitHub Issues: [Report bugs](https://github.com/raobadalyadav11/martXmart/issues)

