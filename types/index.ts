// Enums
export enum Role {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
  VENDOR = "VENDOR",
  FRANCHISE = "FRANCHISE",
}

export enum NotificationType {
  EMAIL = "EMAIL",
  SMS = "SMS",
  PUSH = "PUSH",
}

export enum ServiceType {
  INSTALLATION = "INSTALLATION",
  MAINTENANCE = "MAINTENANCE",
  TRAINING = "TRAINING",
  WARRANTY_CLAIM = "WARRANTY_CLAIM",
}

export enum AddressType{
    BILLING="BILLING",
    SHIPPING="SHIPPING"
}

export enum QuotationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  UPI = "UPI",
  EMI = "EMI",
  COD = "COD",
  PHONEPAY="PHONEPAY"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export enum TaxType {
  CGST = "CGST",
  SGST = "SGST",
  IGST = "IGST",
  CUSTOM_DUTY = "CUSTOM_DUTY",
}

// Interfaces for models

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
  otpExpiresAt?: Date;
  role: Role;
  isVerified: boolean;
  isDeleted: boolean;
  deletionRequestedAt?: Date;
  deletionApprovedAt?: Date;
  deletionReason?: string;
  dataRetentionUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  orders: Order[];
  quotations: Quotation[];
  reviews: Review[];
  notifications: Notification[];
  wishlist: Wishlist[];
  taxes: Tax[];
  commissions: Commission[];
  otps: OTP[];
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface OTP {
  id: string;
  userId: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
}

export interface Product {
  [x: string]: any;
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: string;
  stock: number;
  images: string[];
  videoUrl?: string;
  brand?: string;
  modelNumber?: string;
  productType?: string;
  hsnCode?: string;
  gstPercentage?: number;

  // Technical Specifications
  capacity?: string;
  powerConsumption?: string;
  material?: string;
  automation?: string;
  dimensions?: string;
  weight?: number;
  certifications?: string[];

  // Pricing and Delivery
  discountPercentage?: number;
  shippingCharges?: string;
  minimumOrderQuantity?: number;
  deliveryTime?: string;

  // Warranty and Service
  warranty?: string;
  warrantyDetails?: string;
  returnPolicy?: string;
  afterSalesService?: string;

  // Usage and Applications
  industryType?: string[];
  applications?: string[];

  // Additional Details
  accessories?: string[];
  installationRequired?: boolean;
  documentationLinks?: string[];
  manufacturer?: string;
  madeIn?: string;
  specifications?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Review aggregation fields:
  averageRating?: number;
  reviewCount?: number;

  orderItems: OrderItem[];
  quotationItems: QuotationItem[];
  reviews: Review[];
  wishlist: Wishlist[];

  // Opposite relations:
  productServices: ProductService[];
  shippingInfos: ShippingInfo[];
  taxes: Tax[];
}

export interface ProductService {
  id: string;
  productId: string;
  serviceType: ServiceType;
  details?: string;
  cost?: string; // Decimal as string or a custom Decimal type.
  duration?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface Wishlist {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
}

export interface ShippingInfo {
  id: string;
  productId: string;
  shippingCharge?: string; // Decimal value as string.
  deliveryTime?: string;
  packagingCost?: string; // Decimal as string.
  insurance: boolean;
  createdAt: Date;
}

export interface Quotation {
  id: string;
  userId: string;
  status: QuotationStatus;
  validity: Date;
  createdAt: Date;
  items: QuotationItem[];
}

export interface QuotationItem {
  id: string;
  quotationId: string;
  productId: string;
  quantity: number;
  price: string; // Decimal as string.
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: string; // Decimal as string.
  status: OrderStatus;
  createdAt: Date;
  items: OrderItem[];
  payment?: Payment;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: string; // Decimal as string.
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: Date;
}

export interface Tax {
  id: string;
  productId?: string;
  userId?: string;
  taxType: TaxType;
  percentage: number;
}

export interface Commission {
  id: string;
  vendorId: string;
  percentage: number;
  totalSales: string; // Decimal as string.
  createdAt: Date;
}

export interface VendorDashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalSales: string; // Decimal as string
  totalCommission: string; // Decimal as string
  recentOrders: Order[];
  topProducts: Product[];
}

export interface VendorProduct extends Omit<Product, 'taxes' | 'productServices'> {
  vendorId: string;
  approved: boolean;
  featured: boolean;
  commission: Commission;
}

export interface VendorOrder extends Omit<Order, 'payment'> {
  vendorId: string;
  commission: Commission;
  shippingDetails: ShippingInfo;
}

export interface VendorProfile {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  gstin?: string;
  panNumber?: string;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName: string;
  };
  documents: {
    type: string;
    url: string;
    verified: boolean;
  }[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  rating: number;
  totalProducts: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}


export interface Coupon {
  id: string;
  code: string;
  discount: number;
  isActive: boolean;
  expiresAt: string;
}

export interface Application {
  id: string;
  type: 'FRANCHISE_REGISTRATION' | 'VENDOR_REGISTRATION' | 'SERVICE_REQUEST' | 'PROJECT_REPORT' | 'PRODUCT_ORDER';
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt: string;
  name?: string; // Changed from businessName to name
  serviceId?: string;
}

export interface Affiliate {
  userId: string;
  coins: number;
  referralCode: string;
  referredUsers: number;
}