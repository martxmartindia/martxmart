export interface VendorApplication {
  id: string
  businessName: string
  businessType: string
  yearsInBusiness: number
  contactName: string
  email: string
  phone: string
  address: string
  website?: string | null
  servicesDescription: string
  whyJoin: string
  status: "pending" | "approved" | "rejected"
  userId: string
  vendorId?: string | null
  createdAt: string
  updatedAt: string
}
export interface VendorProfile {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  gstin?: string;
  panNumber?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  documents: VendorDocument[];
  bankDetails?: VendorBankDetails;
}

export interface VendorDocument {
  id: string;
  vendorProfileId: string;
  documentType: string;
  documentUrl: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VendorBankDetails {
  id: string;
  vendorProfileId: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VendorDashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  totalCommission: number;
  recentOrders: {
    id: string;
    status: string;
    totalAmount: number;
    createdAt: string;
  }[];
  topProducts: {
    id: string;
    name: string;
    price: string;
    stock: number;
  }[];
}