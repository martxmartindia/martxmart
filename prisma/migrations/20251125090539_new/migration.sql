-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('CUSTOMER', 'ADMIN', 'VENDOR', 'AUTHOR', 'FRANCHISE', 'STAFF');

-- CreateEnum
CREATE TYPE "public"."CategoryType" AS ENUM ('MACHINE', 'SHOP');

-- CreateEnum
CREATE TYPE "public"."DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'BUY_ONE_GET_ONE');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."ServiceType" AS ENUM ('INSTALLATION', 'MAINTENANCE', 'TRAINING', 'WARRANTY_CLAIM');

-- CreateEnum
CREATE TYPE "public"."SupplierStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."QuotationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('RAZORPAY', 'UPI', 'PHONEPAY', 'NET_BANKING', 'CREDIT_CARD', 'DEBIT_CARD', 'EMI', 'COD');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."TaxType" AS ENUM ('CGST', 'SGST', 'IGST', 'CUSTOM_DUTY');

-- CreateEnum
CREATE TYPE "public"."AddressType" AS ENUM ('BILLING', 'DISPATCH');

-- CreateEnum
CREATE TYPE "public"."BlogStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."FranchisePaymentType" AS ENUM ('INITIAL_FEE', 'RENEWAL_FEE', 'ROYALTY', 'MARKETING_FEE', 'INVOICE_PAYMENT', 'SERVICE_PAYMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."SaleStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."FranchiseApplicationStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'INTERVIEW_SCHEDULED');

-- CreateEnum
CREATE TYPE "public"."ServiceApplicationType" AS ENUM ('GST_REGISTRATION', 'MSME_REGISTRATION', 'COMPANY_REGISTRATION', 'TRADEMARK_REGISTRATION', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."GSTType" AS ENUM ('REGULAR', 'COMPOSITION');

-- CreateEnum
CREATE TYPE "public"."MSMECategory" AS ENUM ('MICRO', 'SMALL', 'MEDIUM');

-- CreateEnum
CREATE TYPE "public"."CompanyType" AS ENUM ('PRIVATE_LIMITED', 'LLP', 'OPC', 'PARTNERSHIP', 'SOLE_PROPRIETORSHIP');

-- CreateEnum
CREATE TYPE "public"."TrademarkType" AS ENUM ('WORDMARK', 'LOGO', 'COMBINED');

-- CreateEnum
CREATE TYPE "public"."PromotionType" AS ENUM ('ADVERTISEMENT', 'BANNER', 'FLYER', 'SOCIAL_MEDIA', 'EVENT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."PromotionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."QuoteRequestStatus" AS ENUM ('PENDING', 'REVIEWING', 'MATCHED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."VendorQuoteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "public"."ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK');

-- CreateEnum
CREATE TYPE "public"."CustomerStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."StaffRole" AS ENUM ('MANAGER', 'SALES_EXECUTIVE', 'CUSTOMER_SUPPORT', 'INVENTORY_MANAGER', 'ACCOUNTANT');

-- CreateEnum
CREATE TYPE "public"."InvestmentSlab" AS ENUM ('SLAB_10_15_LAKH', 'SLAB_15_25_LAKH', 'SLAB_25_30_LAKH');

-- CreateEnum
CREATE TYPE "public"."FranchiseStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'APPROVED', 'REJECTED', 'SUSPENDED', 'CLOSED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."ApplicationType" AS ENUM ('FRANCHISE_REGISTRATION', 'VENDOR_REGISTRATION', 'SERVICE_REQUEST', 'PROJECT_REPORT', 'PRODUCT_ORDER');

-- CreateEnum
CREATE TYPE "public"."OTPVerificationPurpose" AS ENUM ('CUSTOMER_LOGIN', 'CUSTOMER_REGISTRATION', 'ADMIN_LOGIN', 'AUTHOR_LOGIN', 'FRANCHISE_LOGIN', 'FORGOT_PASSWORD', 'PHONE_VERIFICATION', 'EMAIL_VERIFICATION');

-- CreateEnum
CREATE TYPE "public"."OTPVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'FAILED', 'EXPIRED', 'BLOCKED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "image" TEXT,
    "password" TEXT,
    "otp" TEXT,
    "otpExpiresAt" TIMESTAMP(3),
    "role" "public"."Role" NOT NULL DEFAULT 'CUSTOMER',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletionRequestedAt" TIMESTAMP(3),
    "deletionApprovedAt" TIMESTAMP(3),
    "deletionReason" TEXT,
    "dataRetentionUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vendorProfileid" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OTPCode" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "code" TEXT NOT NULL,
    "purpose" "public"."OTPVerificationPurpose" NOT NULL,
    "status" "public"."OTPVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OTPCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Permission" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "canView" BOOLEAN NOT NULL DEFAULT false,
    "canCreate" BOOLEAN NOT NULL DEFAULT false,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Coupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "type" "public"."CategoryType" NOT NULL DEFAULT 'MACHINE',
    "parentId" TEXT,
    "isFestival" BOOLEAN NOT NULL DEFAULT false,
    "festivalType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "originalPrice" DECIMAL(10,2),
    "stock" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "images" TEXT[],
    "videoUrl" TEXT,
    "brand" TEXT,
    "modelNumber" TEXT,
    "productType" TEXT,
    "hsnCode" TEXT NOT NULL,
    "gstPercentage" DOUBLE PRECISION,
    "capacity" TEXT,
    "powerConsumption" TEXT,
    "material" TEXT,
    "automation" TEXT,
    "dimensions" TEXT,
    "weight" DOUBLE PRECISION,
    "certifications" TEXT[],
    "warranty" TEXT,
    "warrantyDetails" TEXT,
    "returnPolicy" TEXT,
    "afterSalesService" TEXT,
    "industryType" TEXT[],
    "applications" TEXT[],
    "accessories" TEXT[],
    "installationRequired" BOOLEAN NOT NULL DEFAULT false,
    "documentationLinks" TEXT[],
    "manufacturer" TEXT,
    "madeIn" TEXT,
    "specifications" TEXT,
    "discount" DOUBLE PRECISION DEFAULT 0,
    "discountType" "public"."DiscountType" DEFAULT 'PERCENTAGE',
    "discountStartDate" TIMESTAMP(3),
    "discountEndDate" TIMESTAMP(3),
    "shippingCharges" DECIMAL(10,2),
    "minimumOrderQuantity" INTEGER,
    "deliveryTime" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "averageRating" DOUBLE PRECISION,
    "reviewCount" INTEGER,
    "categoryId" TEXT NOT NULL,
    "plantId" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Shopping" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "originalPrice" DECIMAL(10,2),
    "stock" INTEGER NOT NULL DEFAULT 0,
    "images" TEXT[],
    "brand" TEXT,
    "hsnCode" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "gstPercentage" DOUBLE PRECISION,
    "categoryId" TEXT NOT NULL,
    "isFestival" BOOLEAN NOT NULL DEFAULT false,
    "festivalType" TEXT,
    "attributes" JSONB,
    "expiryDate" TIMESTAMP(3),
    "weight" DOUBLE PRECISION,
    "dimensions" TEXT,
    "discount" DOUBLE PRECISION DEFAULT 0,
    "discountType" "public"."DiscountType" DEFAULT 'PERCENTAGE',
    "discountStartDate" TIMESTAMP(3),
    "discountEndDate" TIMESTAMP(3),
    "shippingCharges" DECIMAL(10,2),
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "averageRating" DOUBLE PRECISION,
    "reviewCount" INTEGER,

    CONSTRAINT "Shopping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductCartItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductCartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShoppingCartItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "shoppingId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShoppingCartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'PENDING',
    "shippingAddressId" TEXT,
    "billingAddressId" TEXT,
    "paymentId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "franchiseId" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductOrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShoppingOrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "shoppingId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShoppingOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductInventory" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "franchiseId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "minStock" INTEGER NOT NULL DEFAULT 1,
    "serialNumber" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShoppingInventory" (
    "id" TEXT NOT NULL,
    "shoppingId" TEXT NOT NULL,
    "franchiseId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "minStock" INTEGER NOT NULL DEFAULT 5,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShoppingInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Wishlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT,
    "shoppingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT,
    "shoppingId" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShippingInfo" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "shoppingId" TEXT,
    "shippingCharge" DECIMAL(10,2),
    "deliveryTime" TEXT,
    "packagingCost" DECIMAL(10,2),
    "insurance" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShippingInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Slide" (
    "id" SERIAL NOT NULL,
    "type" "public"."CategoryType" NOT NULL DEFAULT 'MACHINE',
    "imageorVideo" TEXT NOT NULL,
    "mobileImageorVideo" TEXT NOT NULL,
    "link" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Slide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Advertisement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "offer" TEXT NOT NULL,
    "offerExpiry" TEXT NOT NULL,
    "benefits" TEXT[],
    "link" TEXT NOT NULL,
    "bgColor" TEXT NOT NULL DEFAULT 'bg-orange-500',
    "hoverColor" TEXT NOT NULL DEFAULT 'hover:bg-orange-600',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Advertisement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductService" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "serviceType" "public"."ServiceType" NOT NULL,
    "details" TEXT,
    "cost" DECIMAL(10,2),
    "duration" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProductService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VendorProfile" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "password" TEXT,
    "website" TEXT,
    "gstNumber" TEXT,
    "panNumber" TEXT,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "ifscCode" TEXT,
    "verificationData" JSONB,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "franchiseId" TEXT,

    CONSTRAINT "VendorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VendorApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logo" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "gstNumber" TEXT,
    "panNumber" TEXT,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "ifscCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "verificationData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VendorDocument" (
    "id" TEXT NOT NULL,
    "vendorApplicationId" TEXT,
    "vendorProfileId" TEXT,
    "documentType" TEXT NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "cloudinaryPublicId" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Quotation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "addressId" TEXT,
    "status" "public"."QuotationStatus" NOT NULL DEFAULT 'PENDING',
    "subtotal" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "validity" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuotationItem" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "hsnCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuotationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "method" "public"."PaymentMethod" NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serviceId" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tax" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "shoppingId" TEXT,
    "userId" TEXT,
    "taxType" "public"."TaxType" NOT NULL,
    "percentage" INTEGER NOT NULL,

    CONSTRAINT "Tax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Commission" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "percentage" INTEGER NOT NULL,
    "totalSales" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Commission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Address" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."AddressType" NOT NULL,
    "contactName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "placeOfSupply" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlogCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Blog" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "featuredImage" TEXT,
    "status" "public"."BlogStatus" NOT NULL DEFAULT 'DRAFT',
    "authorId" TEXT NOT NULL,
    "tags" TEXT[],
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlogComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "authorId" TEXT,

    CONSTRAINT "BlogComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Like" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."View" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "View_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Author" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "profileImage" TEXT,
    "bio" TEXT,
    "specialty" TEXT,
    "socialLinks" JSONB,
    "location" TEXT,
    "education" TEXT,
    "experience" TEXT,
    "achievements" TEXT,
    "website" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."newsletter" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Career" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "responsibilities" TEXT[],
    "requirements" TEXT[],
    "benefits" TEXT[],
    "salary" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "postedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closingDate" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Career_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Application" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "resumeUrl" TEXT NOT NULL,
    "coverLetter" TEXT,
    "portfolioUrl" TEXT,
    "experience" TEXT,
    "currentCompany" TEXT,
    "noticePeriod" TEXT,
    "expectedSalary" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "documents" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "careerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "franchiseId" TEXT,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Franchise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "gstNumber" TEXT NOT NULL,
    "panNumber" TEXT NOT NULL,
    "bankAccountNumber" TEXT,
    "bankIfscCode" TEXT,
    "bankName" TEXT,
    "investmentSlab" "public"."InvestmentSlab" NOT NULL,
    "commissionRate" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "status" "public"."FranchiseStatus" NOT NULL DEFAULT 'PENDING',
    "contractStartDate" TIMESTAMP(3),
    "contractEndDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "razorpayContactId" TEXT,
    "razorpayFundAccountId" TEXT,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Franchise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FranchiseStaff" (
    "id" TEXT NOT NULL,
    "role" "public"."StaffRole" NOT NULL,
    "permissions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "franchiseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FranchiseStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FranchiseDocument" (
    "id" TEXT NOT NULL,
    "franchiseId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "FranchiseDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Territory" (
    "id" TEXT NOT NULL,
    "franchiseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCodes" TEXT[],
    "population" INTEGER,
    "businessPotential" DECIMAL(10,2),
    "isExclusive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Territory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FranchiseSale" (
    "id" TEXT NOT NULL,
    "franchiseId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "commission" DECIMAL(10,2) NOT NULL,
    "status" "public"."SaleStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FranchiseSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FranchiseApplication" (
    "id" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "investmentCapacity" DECIMAL(10,2) NOT NULL,
    "preferredLocation" TEXT NOT NULL,
    "businessExperience" TEXT NOT NULL,
    "status" "public"."FranchiseApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "FranchiseApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProjectCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "longDescription" TEXT,
    "projectCategoryId" TEXT NOT NULL,
    "scheme" TEXT,
    "estimatedCost" TEXT,
    "timeline" TEXT,
    "requirements" TEXT[],
    "landRequirement" TEXT,
    "powerRequirement" TEXT,
    "manpower" TEXT,
    "rawMaterials" TEXT[],
    "marketPotential" TEXT,
    "profitMargin" TEXT,
    "breakEven" TEXT,
    "subsidyDetails" TEXT,
    "documents" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectReportCost" DECIMAL(10,2) NOT NULL DEFAULT 6000,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProjectMachinery" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cost" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectMachinery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GovernmentScheme" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "ministry" TEXT,
    "eligibility" TEXT[],
    "benefits" TEXT[],
    "applicationProcess" TEXT[],
    "documents" TEXT[],
    "sectors" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'Active',
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovernmentScheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortName" TEXT,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "priceAmount" DOUBLE PRECISION NOT NULL,
    "governmentFee" TEXT,
    "processingTime" TEXT NOT NULL,
    "validity" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT,
    "features" TEXT[],
    "requiredDocuments" TEXT[],
    "processSteps" JSONB[],
    "faqs" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServiceOrder" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "razorpayOrderId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paymentId" TEXT,

    CONSTRAINT "ServiceOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServiceApplication" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "userId" TEXT,
    "serviceOrderId" TEXT,
    "serviceApplicationType" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "businessName" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "message" TEXT,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "assignedToUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gstType" "public"."GSTType",
    "annualTurnover" TEXT,
    "businessType" TEXT,
    "msmeCategory" "public"."MSMECategory",
    "investmentInPlant" DECIMAL(10,2),
    "numberOfEmployees" INTEGER,
    "companyType" "public"."CompanyType",
    "proposedNames" TEXT[],
    "businessActivity" TEXT,
    "trademarkType" "public"."TrademarkType",
    "trademarkClass" INTEGER,
    "logoUrl" TEXT,

    CONSTRAINT "ServiceApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServiceDocument" (
    "id" TEXT NOT NULL,
    "serviceApplicationId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServiceNote" (
    "id" TEXT NOT NULL,
    "serviceApplicationId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "inquiryType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PressRelease" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "excerpt" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT,
    "content" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PressRelease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NewsArticle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MediaKit" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaKit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlantCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlantCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Plant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "longDescription" TEXT,
    "plantCategoryId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "specifications" TEXT[],
    "capacity" TEXT,
    "powerConsumption" TEXT,
    "price" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CreditCheck" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "panCard" TEXT NOT NULL,
    "creditScore" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProjectReport" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "paymentStatus" TEXT NOT NULL DEFAULT 'Pending',
    "paymentId" TEXT,
    "paymentAmount" DECIMAL(10,2) NOT NULL,
    "paymentMethod" TEXT,
    "applicationData" JSONB,
    "reportUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProjectReportApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tradeName" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "dobName" TEXT NOT NULL,
    "panCard" TEXT NOT NULL,
    "aadharCard" TEXT NOT NULL,
    "activityNatureOfProduct" TEXT NOT NULL,
    "totalProjectCost" DOUBLE PRECISION NOT NULL,
    "residencePincode" TEXT NOT NULL,
    "residenceState" TEXT NOT NULL,
    "residenceAddress" TEXT NOT NULL,
    "residenceDistrict" TEXT NOT NULL,
    "plantPincode" TEXT NOT NULL,
    "plantState" TEXT NOT NULL,
    "plantAddress" TEXT NOT NULL,
    "plantDistrict" TEXT NOT NULL,
    "documents" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectReportApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "products" TEXT[],
    "status" "public"."SupplierStatus" NOT NULL DEFAULT 'ACTIVE',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."hsnDetail" (
    "id" TEXT NOT NULL,
    "hsnCode" TEXT NOT NULL,
    "hsnName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hsnDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SacDetail" (
    "id" TEXT NOT NULL,
    "sacCode" TEXT NOT NULL,
    "sacName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SacDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PromotionRequest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "public"."PromotionType" NOT NULL,
    "status" "public"."PromotionStatus" NOT NULL DEFAULT 'PENDING',
    "materials" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "franchiseId" TEXT NOT NULL,

    CONSTRAINT "PromotionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VendorPayment" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'SERVICE_PAYMENT',
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "razorpayPayoutId" TEXT,
    "referenceId" TEXT,
    "notes" TEXT,
    "paidDate" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "franchiseId" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "franchiseId" TEXT,
    "vendorId" TEXT,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FranchisePayment" (
    "id" TEXT NOT NULL,
    "franchiseId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" "public"."FranchisePaymentType" NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "razorpayPayoutId" TEXT,
    "referenceId" TEXT,
    "notes" TEXT,
    "dueDate" TIMESTAMP(3),
    "paidDate" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FranchisePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ticket" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "public"."TicketPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "public"."TicketStatus" NOT NULL DEFAULT 'OPEN',
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "assignedToId" TEXT,
    "franchiseId" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TicketComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TicketComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuoteRequest" (
    "id" TEXT NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "company" VARCHAR(100),
    "productCategory" VARCHAR(50) NOT NULL,
    "productName" VARCHAR(200) NOT NULL,
    "quantity" VARCHAR(50) NOT NULL,
    "requirements" TEXT NOT NULL,
    "budget" VARCHAR(100),
    "timeframe" VARCHAR(50) NOT NULL,
    "contactPreference" VARCHAR(20) NOT NULL,
    "fileUrl" TEXT,
    "status" "public"."QuoteRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "QuoteRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VendorQuote" (
    "id" TEXT NOT NULL,
    "quoteRequestId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "description" TEXT NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "status" "public"."VendorQuoteStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorQuote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Affiliate" (
    "id" TEXT NOT NULL,
    "coins" INTEGER NOT NULL DEFAULT 0,
    "referralCode" TEXT NOT NULL,
    "referredUsers" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Affiliate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_AdminToAuthor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdminToAuthor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AdminToBlog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdminToBlog_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AdminToCommission" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdminToCommission_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AdminToCoupon" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdminToCoupon_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AdminToNotification" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdminToNotification_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AdminToOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdminToOrder_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AdminToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdminToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AdminToShopping" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdminToShopping_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AdminToQuotation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdminToQuotation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AdminToReview" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdminToReview_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AdminToTax" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdminToTax_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AdminToVendorProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdminToVendorProfile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AdminToWishlist" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdminToWishlist_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AdminToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdminToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_VendorProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_VendorProducts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_VendorShoppingProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_VendorShoppingProducts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_VendorCommissions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_VendorCommissions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_BlogToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BlogToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_Related" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Related_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");

-- CreateIndex
CREATE INDEX "User_name_email_phone_idx" ON "public"."User"("name", "email", "phone");

-- CreateIndex
CREATE INDEX "User_role_isVerified_isDeleted_idx" ON "public"."User"("role", "isVerified", "isDeleted");

-- CreateIndex
CREATE INDEX "OTPCode_phone_purpose_status_idx" ON "public"."OTPCode"("phone", "purpose", "status");

-- CreateIndex
CREATE INDEX "OTPCode_email_purpose_status_idx" ON "public"."OTPCode"("email", "purpose", "status");

-- CreateIndex
CREATE INDEX "OTPCode_expiresAt_idx" ON "public"."OTPCode"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- CreateIndex
CREATE INDEX "Admin_name_email_phone_idx" ON "public"."Admin"("name", "email", "phone");

-- CreateIndex
CREATE INDEX "Permission_adminId_module_idx" ON "public"."Permission"("adminId", "module");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "public"."Coupon"("code");

-- CreateIndex
CREATE INDEX "Coupon_code_idx" ON "public"."Coupon"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "public"."Category"("slug");

-- CreateIndex
CREATE INDEX "Category_name_slug_type_idx" ON "public"."Category"("name", "slug", "type");

-- CreateIndex
CREATE INDEX "Category_isFestival_festivalType_idx" ON "public"."Category"("isFestival", "festivalType");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "public"."Product"("slug");

-- CreateIndex
CREATE INDEX "Product_discount_discountEndDate_idx" ON "public"."Product"("discount", "discountEndDate");

-- CreateIndex
CREATE INDEX "Product_price_stock_featured_idx" ON "public"."Product"("price", "stock", "featured");

-- CreateIndex
CREATE INDEX "Product_name_categoryId_idx" ON "public"."Product"("name", "categoryId");

-- CreateIndex
CREATE INDEX "Product_createdAt_isDeleted_idx" ON "public"."Product"("createdAt", "isDeleted");

-- CreateIndex
CREATE INDEX "Product_brand_productType_manufacturer_idx" ON "public"."Product"("brand", "productType", "manufacturer");

-- CreateIndex
CREATE UNIQUE INDEX "Shopping_slug_key" ON "public"."Shopping"("slug");

-- CreateIndex
CREATE INDEX "Shopping_categoryId_isFestival_festivalType_idx" ON "public"."Shopping"("categoryId", "isFestival", "festivalType");

-- CreateIndex
CREATE INDEX "Shopping_price_stock_isAvailable_idx" ON "public"."Shopping"("price", "stock", "isAvailable");

-- CreateIndex
CREATE INDEX "Shopping_name_slug_isDeleted_idx" ON "public"."Shopping"("name", "slug", "isDeleted");

-- CreateIndex
CREATE INDEX "Shopping_brand_hsnCode_idx" ON "public"."Shopping"("brand", "hsnCode");

-- CreateIndex
CREATE INDEX "Cart_userId_idx" ON "public"."Cart"("userId");

-- CreateIndex
CREATE INDEX "ProductCartItem_cartId_productId_idx" ON "public"."ProductCartItem"("cartId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCartItem_cartId_productId_key" ON "public"."ProductCartItem"("cartId", "productId");

-- CreateIndex
CREATE INDEX "ShoppingCartItem_cartId_shoppingId_idx" ON "public"."ShoppingCartItem"("cartId", "shoppingId");

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingCartItem_cartId_shoppingId_key" ON "public"."ShoppingCartItem"("cartId", "shoppingId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "public"."Order"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Order_paymentId_key" ON "public"."Order"("paymentId");

-- CreateIndex
CREATE INDEX "Order_userId_status_orderNumber_idx" ON "public"."Order"("userId", "status", "orderNumber");

-- CreateIndex
CREATE INDEX "Order_createdAt_franchiseId_idx" ON "public"."Order"("createdAt", "franchiseId");

-- CreateIndex
CREATE INDEX "ProductOrderItem_orderId_productId_idx" ON "public"."ProductOrderItem"("orderId", "productId");

-- CreateIndex
CREATE INDEX "ShoppingOrderItem_orderId_shoppingId_idx" ON "public"."ShoppingOrderItem"("orderId", "shoppingId");

-- CreateIndex
CREATE INDEX "ProductInventory_productId_quantity_franchiseId_idx" ON "public"."ProductInventory"("productId", "quantity", "franchiseId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductInventory_productId_franchiseId_key" ON "public"."ProductInventory"("productId", "franchiseId");

-- CreateIndex
CREATE INDEX "ShoppingInventory_shoppingId_quantity_franchiseId_idx" ON "public"."ShoppingInventory"("shoppingId", "quantity", "franchiseId");

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingInventory_shoppingId_franchiseId_key" ON "public"."ShoppingInventory"("shoppingId", "franchiseId");

-- CreateIndex
CREATE INDEX "Wishlist_createdAt_idx" ON "public"."Wishlist"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userId_productId_key" ON "public"."Wishlist"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userId_shoppingId_key" ON "public"."Wishlist"("userId", "shoppingId");

-- CreateIndex
CREATE INDEX "Review_productId_shoppingId_rating_idx" ON "public"."Review"("productId", "shoppingId", "rating");

-- CreateIndex
CREATE INDEX "Review_userId_createdAt_idx" ON "public"."Review"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ShippingInfo_productId_shoppingId_shippingCharge_idx" ON "public"."ShippingInfo"("productId", "shoppingId", "shippingCharge");

-- CreateIndex
CREATE INDEX "Slide_id_isActive_idx" ON "public"."Slide"("id", "isActive");

-- CreateIndex
CREATE INDEX "Advertisement_isActive_priority_idx" ON "public"."Advertisement"("isActive", "priority");

-- CreateIndex
CREATE INDEX "ProductService_productId_serviceType_idx" ON "public"."ProductService"("productId", "serviceType");

-- CreateIndex
CREATE UNIQUE INDEX "VendorProfile_userId_key" ON "public"."VendorProfile"("userId");

-- CreateIndex
CREATE INDEX "VendorProfile_businessName_businessType_idx" ON "public"."VendorProfile"("businessName", "businessType");

-- CreateIndex
CREATE INDEX "VendorProfile_isVerified_createdAt_idx" ON "public"."VendorProfile"("isVerified", "createdAt");

-- CreateIndex
CREATE INDEX "VendorApplication_status_createdAt_idx" ON "public"."VendorApplication"("status", "createdAt");

-- CreateIndex
CREATE INDEX "VendorApplication_businessName_email_idx" ON "public"."VendorApplication"("businessName", "email");

-- CreateIndex
CREATE INDEX "VendorDocument_vendorProfileId_documentType_idx" ON "public"."VendorDocument"("vendorProfileId", "documentType");

-- CreateIndex
CREATE INDEX "VendorDocument_isVerified_createdAt_idx" ON "public"."VendorDocument"("isVerified", "createdAt");

-- CreateIndex
CREATE INDEX "Quotation_userId_status_idx" ON "public"."Quotation"("userId", "status");

-- CreateIndex
CREATE INDEX "Quotation_createdAt_validity_idx" ON "public"."Quotation"("createdAt", "validity");

-- CreateIndex
CREATE INDEX "QuotationItem_quotationId_productId_idx" ON "public"."QuotationItem"("quotationId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "public"."Payment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_razorpayOrderId_key" ON "public"."Payment"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_serviceId_key" ON "public"."Payment"("serviceId");

-- CreateIndex
CREATE INDEX "Payment_serviceId_status_idx" ON "public"."Payment"("serviceId", "status");

-- CreateIndex
CREATE INDEX "Payment_status_method_idx" ON "public"."Payment"("status", "method");

-- CreateIndex
CREATE INDEX "Payment_createdAt_status_idx" ON "public"."Payment"("createdAt", "status");

-- CreateIndex
CREATE INDEX "Tax_taxType_percentage_idx" ON "public"."Tax"("taxType", "percentage");

-- CreateIndex
CREATE INDEX "Tax_productId_shoppingId_idx" ON "public"."Tax"("productId", "shoppingId");

-- CreateIndex
CREATE INDEX "Commission_vendorId_createdAt_idx" ON "public"."Commission"("vendorId", "createdAt");

-- CreateIndex
CREATE INDEX "Address_userId_type_idx" ON "public"."Address"("userId", "type");

-- CreateIndex
CREATE INDEX "Address_city_state_zip_idx" ON "public"."Address"("city", "state", "zip");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_slug_key" ON "public"."BlogCategory"("slug");

-- CreateIndex
CREATE INDEX "BlogCategory_slug_idx" ON "public"."BlogCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "public"."Blog"("slug");

-- CreateIndex
CREATE INDEX "Blog_authorId_status_idx" ON "public"."Blog"("authorId", "status");

-- CreateIndex
CREATE INDEX "Blog_createdAt_isDeleted_idx" ON "public"."Blog"("createdAt", "isDeleted");

-- CreateIndex
CREATE INDEX "Blog_slug_status_idx" ON "public"."Blog"("slug", "status");

-- CreateIndex
CREATE INDEX "Blog_publishedAt_idx" ON "public"."Blog"("publishedAt");

-- CreateIndex
CREATE INDEX "BlogComment_postId_userId_idx" ON "public"."BlogComment"("postId", "userId");

-- CreateIndex
CREATE INDEX "Like_blogId_createdAt_idx" ON "public"."Like"("blogId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Like_blogId_authorId_key" ON "public"."Like"("blogId", "authorId");

-- CreateIndex
CREATE INDEX "View_blogId_viewedAt_idx" ON "public"."View"("blogId", "viewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Author_userId_key" ON "public"."Author"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Author_email_key" ON "public"."Author"("email");

-- CreateIndex
CREATE INDEX "Author_name_isActive_idx" ON "public"."Author"("name", "isActive");

-- CreateIndex
CREATE INDEX "Author_userId_createdAt_idx" ON "public"."Author"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_email_key" ON "public"."newsletter"("email");

-- CreateIndex
CREATE INDEX "newsletter_email_createdAt_idx" ON "public"."newsletter"("email", "createdAt");

-- CreateIndex
CREATE INDEX "Career_department_location_type_idx" ON "public"."Career"("department", "location", "type");

-- CreateIndex
CREATE INDEX "Career_status_postedDate_idx" ON "public"."Career"("status", "postedDate");

-- CreateIndex
CREATE INDEX "Career_createdAt_isDeleted_idx" ON "public"."Career"("createdAt", "isDeleted");

-- CreateIndex
CREATE INDEX "Application_careerId_status_idx" ON "public"."Application"("careerId", "status");

-- CreateIndex
CREATE INDEX "Application_userId_createdAt_idx" ON "public"."Application"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Franchise_gstNumber_key" ON "public"."Franchise"("gstNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Franchise_panNumber_key" ON "public"."Franchise"("panNumber");

-- CreateIndex
CREATE INDEX "Franchise_ownerId_status_idx" ON "public"."Franchise"("ownerId", "status");

-- CreateIndex
CREATE INDEX "FranchiseStaff_franchiseId_userId_idx" ON "public"."FranchiseStaff"("franchiseId", "userId");

-- CreateIndex
CREATE INDEX "FranchiseDocument_franchiseId_documentType_idx" ON "public"."FranchiseDocument"("franchiseId", "documentType");

-- CreateIndex
CREATE INDEX "FranchiseDocument_isVerified_uploadedAt_idx" ON "public"."FranchiseDocument"("isVerified", "uploadedAt");

-- CreateIndex
CREATE INDEX "Territory_franchiseId_city_idx" ON "public"."Territory"("franchiseId", "city");

-- CreateIndex
CREATE INDEX "Territory_state_isExclusive_idx" ON "public"."Territory"("state", "isExclusive");

-- CreateIndex
CREATE INDEX "FranchiseSale_franchiseId_status_idx" ON "public"."FranchiseSale"("franchiseId", "status");

-- CreateIndex
CREATE INDEX "FranchiseSale_orderId_createdAt_idx" ON "public"."FranchiseSale"("orderId", "createdAt");

-- CreateIndex
CREATE INDEX "FranchiseApplication_status_submittedAt_idx" ON "public"."FranchiseApplication"("status", "submittedAt");

-- CreateIndex
CREATE INDEX "FranchiseApplication_city_state_idx" ON "public"."FranchiseApplication"("city", "state");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectCategory_slug_key" ON "public"."ProjectCategory"("slug");

-- CreateIndex
CREATE INDEX "ProjectCategory_slug_idx" ON "public"."ProjectCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "public"."Project"("slug");

-- CreateIndex
CREATE INDEX "Project_slug_idx" ON "public"."Project"("slug");

-- CreateIndex
CREATE INDEX "ProjectMachinery_projectId_idx" ON "public"."ProjectMachinery"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "GovernmentScheme_slug_key" ON "public"."GovernmentScheme"("slug");

-- CreateIndex
CREATE INDEX "GovernmentScheme_slug_idx" ON "public"."GovernmentScheme"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "public"."Service"("slug");

-- CreateIndex
CREATE INDEX "Service_category_idx" ON "public"."Service"("category");

-- CreateIndex
CREATE INDEX "Service_slug_idx" ON "public"."Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceOrder_paymentId_key" ON "public"."ServiceOrder"("paymentId");

-- CreateIndex
CREATE INDEX "ServiceOrder_customerEmail_idx" ON "public"."ServiceOrder"("customerEmail");

-- CreateIndex
CREATE INDEX "ServiceOrder_serviceId_idx" ON "public"."ServiceOrder"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceApplication_serviceOrderId_key" ON "public"."ServiceApplication"("serviceOrderId");

-- CreateIndex
CREATE INDEX "ServiceApplication_serviceId_userId_status_idx" ON "public"."ServiceApplication"("serviceId", "userId", "status");

-- CreateIndex
CREATE INDEX "ServiceDocument_serviceApplicationId_idx" ON "public"."ServiceDocument"("serviceApplicationId");

-- CreateIndex
CREATE INDEX "ServiceNote_serviceApplicationId_idx" ON "public"."ServiceNote"("serviceApplicationId");

-- CreateIndex
CREATE INDEX "Contact_email_idx" ON "public"."Contact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PressRelease_slug_key" ON "public"."PressRelease"("slug");

-- CreateIndex
CREATE INDEX "PressRelease_slug_idx" ON "public"."PressRelease"("slug");

-- CreateIndex
CREATE INDEX "NewsArticle_source_idx" ON "public"."NewsArticle"("source");

-- CreateIndex
CREATE UNIQUE INDEX "PlantCategory_slug_key" ON "public"."PlantCategory"("slug");

-- CreateIndex
CREATE INDEX "PlantCategory_slug_idx" ON "public"."PlantCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Plant_slug_key" ON "public"."Plant"("slug");

-- CreateIndex
CREATE INDEX "Plant_slug_idx" ON "public"."Plant"("slug");

-- CreateIndex
CREATE INDEX "CreditCheck_mobileNumber_panCard_idx" ON "public"."CreditCheck"("mobileNumber", "panCard");

-- CreateIndex
CREATE INDEX "ProjectReport_projectId_userId_idx" ON "public"."ProjectReport"("projectId", "userId");

-- CreateIndex
CREATE INDEX "ProjectReportApplication_userId_status_idx" ON "public"."ProjectReportApplication"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_email_key" ON "public"."Supplier"("email");

-- CreateIndex
CREATE INDEX "Supplier_email_phone_idx" ON "public"."Supplier"("email", "phone");

-- CreateIndex
CREATE INDEX "Supplier_name_status_idx" ON "public"."Supplier"("name", "status");

-- CreateIndex
CREATE INDEX "hsnDetail_hsnCode_hsnName_idx" ON "public"."hsnDetail"("hsnCode", "hsnName");

-- CreateIndex
CREATE INDEX "SacDetail_sacCode_sacName_idx" ON "public"."SacDetail"("sacCode", "sacName");

-- CreateIndex
CREATE INDEX "PromotionRequest_franchiseId_status_idx" ON "public"."PromotionRequest"("franchiseId", "status");

-- CreateIndex
CREATE INDEX "VendorPayment_vendorId_status_idx" ON "public"."VendorPayment"("vendorId", "status");

-- CreateIndex
CREATE INDEX "VendorPayment_razorpayPayoutId_idx" ON "public"."VendorPayment"("razorpayPayoutId");

-- CreateIndex
CREATE INDEX "VendorPayment_referenceId_idx" ON "public"."VendorPayment"("referenceId");

-- CreateIndex
CREATE INDEX "Notification_isRead_createdAt_idx" ON "public"."Notification"("isRead", "createdAt");

-- CreateIndex
CREATE INDEX "Message_senderId_receiverId_idx" ON "public"."Message"("senderId", "receiverId");

-- CreateIndex
CREATE INDEX "FranchisePayment_franchiseId_type_idx" ON "public"."FranchisePayment"("franchiseId", "type");

-- CreateIndex
CREATE INDEX "FranchisePayment_status_dueDate_idx" ON "public"."FranchisePayment"("status", "dueDate");

-- CreateIndex
CREATE INDEX "FranchisePayment_razorpayPayoutId_idx" ON "public"."FranchisePayment"("razorpayPayoutId");

-- CreateIndex
CREATE INDEX "FranchisePayment_referenceId_idx" ON "public"."FranchisePayment"("referenceId");

-- CreateIndex
CREATE INDEX "Ticket_franchiseId_status_idx" ON "public"."Ticket"("franchiseId", "status");

-- CreateIndex
CREATE INDEX "TicketComment_ticketId_idx" ON "public"."TicketComment"("ticketId");

-- CreateIndex
CREATE INDEX "QuoteRequest_email_phone_status_idx" ON "public"."QuoteRequest"("email", "phone", "status");

-- CreateIndex
CREATE INDEX "VendorQuote_quoteRequestId_vendorId_status_idx" ON "public"."VendorQuote"("quoteRequestId", "vendorId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Affiliate_referralCode_key" ON "public"."Affiliate"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "Affiliate_userId_key" ON "public"."Affiliate"("userId");

-- CreateIndex
CREATE INDEX "Affiliate_referralCode_idx" ON "public"."Affiliate"("referralCode");

-- CreateIndex
CREATE INDEX "_AdminToAuthor_B_index" ON "public"."_AdminToAuthor"("B");

-- CreateIndex
CREATE INDEX "_AdminToBlog_B_index" ON "public"."_AdminToBlog"("B");

-- CreateIndex
CREATE INDEX "_AdminToCommission_B_index" ON "public"."_AdminToCommission"("B");

-- CreateIndex
CREATE INDEX "_AdminToCoupon_B_index" ON "public"."_AdminToCoupon"("B");

-- CreateIndex
CREATE INDEX "_AdminToNotification_B_index" ON "public"."_AdminToNotification"("B");

-- CreateIndex
CREATE INDEX "_AdminToOrder_B_index" ON "public"."_AdminToOrder"("B");

-- CreateIndex
CREATE INDEX "_AdminToProduct_B_index" ON "public"."_AdminToProduct"("B");

-- CreateIndex
CREATE INDEX "_AdminToShopping_B_index" ON "public"."_AdminToShopping"("B");

-- CreateIndex
CREATE INDEX "_AdminToQuotation_B_index" ON "public"."_AdminToQuotation"("B");

-- CreateIndex
CREATE INDEX "_AdminToReview_B_index" ON "public"."_AdminToReview"("B");

-- CreateIndex
CREATE INDEX "_AdminToTax_B_index" ON "public"."_AdminToTax"("B");

-- CreateIndex
CREATE INDEX "_AdminToVendorProfile_B_index" ON "public"."_AdminToVendorProfile"("B");

-- CreateIndex
CREATE INDEX "_AdminToWishlist_B_index" ON "public"."_AdminToWishlist"("B");

-- CreateIndex
CREATE INDEX "_AdminToUser_B_index" ON "public"."_AdminToUser"("B");

-- CreateIndex
CREATE INDEX "_VendorProducts_B_index" ON "public"."_VendorProducts"("B");

-- CreateIndex
CREATE INDEX "_VendorShoppingProducts_B_index" ON "public"."_VendorShoppingProducts"("B");

-- CreateIndex
CREATE INDEX "_VendorCommissions_B_index" ON "public"."_VendorCommissions"("B");

-- CreateIndex
CREATE INDEX "_BlogToUser_B_index" ON "public"."_BlogToUser"("B");

-- CreateIndex
CREATE INDEX "_Related_B_index" ON "public"."_Related"("B");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_vendorProfileid_fkey" FOREIGN KEY ("vendorProfileid") REFERENCES "public"."VendorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Coupon" ADD CONSTRAINT "Coupon_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "public"."Plant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Shopping" ADD CONSTRAINT "Shopping_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductCartItem" ADD CONSTRAINT "ProductCartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "public"."Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductCartItem" ADD CONSTRAINT "ProductCartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShoppingCartItem" ADD CONSTRAINT "ShoppingCartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "public"."Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShoppingCartItem" ADD CONSTRAINT "ShoppingCartItem_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "public"."Shopping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "public"."Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_billingAddressId_fkey" FOREIGN KEY ("billingAddressId") REFERENCES "public"."Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "public"."Franchise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductOrderItem" ADD CONSTRAINT "ProductOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductOrderItem" ADD CONSTRAINT "ProductOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShoppingOrderItem" ADD CONSTRAINT "ShoppingOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShoppingOrderItem" ADD CONSTRAINT "ShoppingOrderItem_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "public"."Shopping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductInventory" ADD CONSTRAINT "ProductInventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductInventory" ADD CONSTRAINT "ProductInventory_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "public"."Franchise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShoppingInventory" ADD CONSTRAINT "ShoppingInventory_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "public"."Shopping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShoppingInventory" ADD CONSTRAINT "ShoppingInventory_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "public"."Franchise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Wishlist" ADD CONSTRAINT "Wishlist_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Wishlist" ADD CONSTRAINT "Wishlist_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "public"."Shopping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "public"."Shopping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShippingInfo" ADD CONSTRAINT "ShippingInfo_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShippingInfo" ADD CONSTRAINT "ShippingInfo_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "public"."Shopping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductService" ADD CONSTRAINT "ProductService_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VendorProfile" ADD CONSTRAINT "VendorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VendorProfile" ADD CONSTRAINT "VendorProfile_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "public"."Franchise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VendorApplication" ADD CONSTRAINT "VendorApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VendorDocument" ADD CONSTRAINT "VendorDocument_vendorApplicationId_fkey" FOREIGN KEY ("vendorApplicationId") REFERENCES "public"."VendorApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VendorDocument" ADD CONSTRAINT "VendorDocument_vendorProfileId_fkey" FOREIGN KEY ("vendorProfileId") REFERENCES "public"."VendorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quotation" ADD CONSTRAINT "Quotation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quotation" ADD CONSTRAINT "Quotation_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuotationItem" ADD CONSTRAINT "QuotationItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuotationItem" ADD CONSTRAINT "QuotationItem_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "public"."Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tax" ADD CONSTRAINT "Tax_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tax" ADD CONSTRAINT "Tax_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "public"."Shopping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tax" ADD CONSTRAINT "Tax_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Commission" ADD CONSTRAINT "Commission_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Blog" ADD CONSTRAINT "Blog_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."BlogCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Blog" ADD CONSTRAINT "Blog_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogComment" ADD CONSTRAINT "BlogComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogComment" ADD CONSTRAINT "BlogComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogComment" ADD CONSTRAINT "BlogComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."BlogComment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."BlogComment" ADD CONSTRAINT "BlogComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "public"."Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."View" ADD CONSTRAINT "View_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "public"."Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Author" ADD CONSTRAINT "Author_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "public"."Career"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "public"."Franchise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Franchise" ADD CONSTRAINT "Franchise_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FranchiseStaff" ADD CONSTRAINT "FranchiseStaff_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "public"."Franchise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FranchiseStaff" ADD CONSTRAINT "FranchiseStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FranchiseDocument" ADD CONSTRAINT "FranchiseDocument_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "public"."Franchise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Territory" ADD CONSTRAINT "Territory_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "public"."Franchise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FranchiseSale" ADD CONSTRAINT "FranchiseSale_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "public"."Franchise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_projectCategoryId_fkey" FOREIGN KEY ("projectCategoryId") REFERENCES "public"."ProjectCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectMachinery" ADD CONSTRAINT "ProjectMachinery_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceOrder" ADD CONSTRAINT "ServiceOrder_payment_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceOrder" ADD CONSTRAINT "ServiceOrder_service_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceOrder" ADD CONSTRAINT "ServiceOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceApplication" ADD CONSTRAINT "ServiceApplication_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceApplication" ADD CONSTRAINT "ServiceApplication_serviceOrderId_fkey" FOREIGN KEY ("serviceOrderId") REFERENCES "public"."ServiceOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceApplication" ADD CONSTRAINT "ServiceApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceDocument" ADD CONSTRAINT "ServiceDocument_serviceApplicationId_fkey" FOREIGN KEY ("serviceApplicationId") REFERENCES "public"."ServiceApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceNote" ADD CONSTRAINT "ServiceNote_serviceApplicationId_fkey" FOREIGN KEY ("serviceApplicationId") REFERENCES "public"."ServiceApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Plant" ADD CONSTRAINT "Plant_plantCategoryId_fkey" FOREIGN KEY ("plantCategoryId") REFERENCES "public"."PlantCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectReport" ADD CONSTRAINT "ProjectReport_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectReport" ADD CONSTRAINT "ProjectReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectReportApplication" ADD CONSTRAINT "ProjectReportApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PromotionRequest" ADD CONSTRAINT "PromotionRequest_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "public"."Franchise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VendorPayment" ADD CONSTRAINT "VendorPayment_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "public"."Franchise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "public"."Franchise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FranchisePayment" ADD CONSTRAINT "FranchisePayment_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "public"."Franchise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "public"."Franchise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TicketComment" ADD CONSTRAINT "TicketComment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TicketComment" ADD CONSTRAINT "TicketComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuoteRequest" ADD CONSTRAINT "QuoteRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VendorQuote" ADD CONSTRAINT "VendorQuote_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "public"."QuoteRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VendorQuote" ADD CONSTRAINT "VendorQuote_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Affiliate" ADD CONSTRAINT "Affiliate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToAuthor" ADD CONSTRAINT "_AdminToAuthor_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToAuthor" ADD CONSTRAINT "_AdminToAuthor_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToBlog" ADD CONSTRAINT "_AdminToBlog_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToBlog" ADD CONSTRAINT "_AdminToBlog_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToCommission" ADD CONSTRAINT "_AdminToCommission_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToCommission" ADD CONSTRAINT "_AdminToCommission_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Commission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToCoupon" ADD CONSTRAINT "_AdminToCoupon_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToCoupon" ADD CONSTRAINT "_AdminToCoupon_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Coupon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToNotification" ADD CONSTRAINT "_AdminToNotification_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToNotification" ADD CONSTRAINT "_AdminToNotification_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToOrder" ADD CONSTRAINT "_AdminToOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToOrder" ADD CONSTRAINT "_AdminToOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToProduct" ADD CONSTRAINT "_AdminToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToProduct" ADD CONSTRAINT "_AdminToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToShopping" ADD CONSTRAINT "_AdminToShopping_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToShopping" ADD CONSTRAINT "_AdminToShopping_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Shopping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToQuotation" ADD CONSTRAINT "_AdminToQuotation_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToQuotation" ADD CONSTRAINT "_AdminToQuotation_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToReview" ADD CONSTRAINT "_AdminToReview_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToReview" ADD CONSTRAINT "_AdminToReview_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToTax" ADD CONSTRAINT "_AdminToTax_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToTax" ADD CONSTRAINT "_AdminToTax_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tax"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToVendorProfile" ADD CONSTRAINT "_AdminToVendorProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToVendorProfile" ADD CONSTRAINT "_AdminToVendorProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."VendorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToWishlist" ADD CONSTRAINT "_AdminToWishlist_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToWishlist" ADD CONSTRAINT "_AdminToWishlist_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Wishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToUser" ADD CONSTRAINT "_AdminToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AdminToUser" ADD CONSTRAINT "_AdminToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_VendorProducts" ADD CONSTRAINT "_VendorProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_VendorProducts" ADD CONSTRAINT "_VendorProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."VendorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_VendorShoppingProducts" ADD CONSTRAINT "_VendorShoppingProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Shopping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_VendorShoppingProducts" ADD CONSTRAINT "_VendorShoppingProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."VendorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_VendorCommissions" ADD CONSTRAINT "_VendorCommissions_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Commission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_VendorCommissions" ADD CONSTRAINT "_VendorCommissions_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."VendorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BlogToUser" ADD CONSTRAINT "_BlogToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BlogToUser" ADD CONSTRAINT "_BlogToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_Related" ADD CONSTRAINT "_Related_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_Related" ADD CONSTRAINT "_Related_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
