// app/lib/server-actions/admin.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function getAdminProducts({
  page = 1,
  limit = 10,
  search,
  category,
  featured,
  stock,
  priceRange,
  brand,
}: {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  featured?: string;
  stock?: string;
  priceRange?: string;
  brand?: string;
}) {
  const skip = (page - 1) * limit;

  // Build where conditions
  const where: any = {
    isDeleted: false,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
    ];
  }

  // Apply filters
  if (category && category !== 'all') {
    where.categoryId = category;
  }

  if (featured && featured !== 'all') {
    where.featured = featured === 'true';
  }

  if (brand && brand !== '') {
    where.brand = {
      contains: brand,
      mode: 'insensitive' as const
    };
  }

  // Handle stock filter
  if (stock && stock !== 'all') {
    if (stock === 'in_stock') {
      where.stock = { gt: 10 };
    } else if (stock === 'low_stock') {
      where.stock = { gte: 1, lte: 10 };
    } else if (stock === 'out_of_stock') {
      where.stock = { equals: 0 };
    }
  }

  // Handle price range filter
  if (priceRange && priceRange !== 'all') {
    if (priceRange === '0-1000') {
      where.price = { gte: 0, lte: 1000 };
    } else if (priceRange === '1000-5000') {
      where.price = { gte: 1000, lte: 5000 };
    } else if (priceRange === '5000-10000') {
      where.price = { gte: 5000, lte: 10000 };
    } else if (priceRange === '10000-50000') {
      where.price = { gte: 10000, lte: 50000 };
    } else if (priceRange === '50000+') {
      where.price = { gte: 50000 };
    }
  }

  // Get products with pagination
  const products = await prisma.product.findMany({
    where,
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: limit,
  });

  // Serialize Decimal and Date fields
  const serializedProducts = products.map((product) => ({
    ...product,
    price: Number(product.price),
    shippingCharges: product.shippingCharges ? Number(product.shippingCharges) : null,
    gstPercentage: product.gstPercentage ? Number(product.gstPercentage) : null,
    weight: product.weight ? Number(product.weight) : null,
    discount: product.discount ? Number(product.discount) : null,
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    discountStartDate: product.discountStartDate?.toISOString() ?? null,
    discountEndDate: product.discountEndDate?.toISOString() ?? null,
  }));

  // Get total count for pagination
  const total = await prisma.product.count({ where });

  return {
    products: serializedProducts,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getAdminDashboardStats() {
  // Get total products
  const totalProducts = await prisma.product.count({
    where: {
      isDeleted: false,
    },
  });

  // Get total orders
  const totalOrders = await prisma.order.count();

  // Get total customers
  const totalCustomers = await prisma.user.count({
    where: {
      role: "CUSTOMER",
      isDeleted: false,
    },
  });

  // Get total revenue
  const revenue = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },
    where: {
      status: {
        in: ["DELIVERED", "SHIPPED"],
      },
    },
  });

  // Get recent orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Get low stock products
  const lowStockProducts = await prisma.product.findMany({
    where: {
      stock: {
        lte: 10,
      },
      isDeleted: false,
    },
    take: 5,
    orderBy: {
      stock: "asc",
    },
  });

  // Serialize Decimal and Date fields
  const serializedLowStockProducts = lowStockProducts.map((product) => ({
    ...product,
    price: Number(product.price),
    shippingCharges: product.shippingCharges ? Number(product.shippingCharges) : null,
    gstPercentage: product.gstPercentage ? Number(product.gstPercentage) : null,
    weight: product.weight ? Number(product.weight) : null,
    discount: product.discount ? Number(product.discount) : null,
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    discountStartDate: product.discountStartDate?.toISOString() ?? null,
    discountEndDate: product.discountEndDate?.toISOString() ?? null,
  }));

  const serializedRecentOrders = recentOrders.map((order) => ({
    ...order,
    totalAmount: Number(order.totalAmount),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }));

  return {
    totalProducts,
    totalOrders,
    totalCustomers,
    totalRevenue: revenue._sum.totalAmount ? Number(revenue._sum.totalAmount) : 0,
    recentOrders: serializedRecentOrders,
    lowStockProducts: serializedLowStockProducts,
  };
}