// scripts/seedDatabase.ts
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/utils/auth";
import {
  categories,
  foodProcessingProjects,
  serviceProjects,
  manufacturingProjects,
  tradingProjects,
  governmentSchemes,
} from "@/lib/data";

async function main() {
  // Validate environment variables
  const adminEmail = process.env.ADMIN_EMAIL!;
  const adminPassword = process.env.ADMIN_PASSWORD!;

  // if (!adminEmail || !adminPassword) {
  //   throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables.");
  // }

  // Clear existing data
  await prisma.projectMachinery.deleteMany({});
  await prisma.projectReport.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.governmentScheme.deleteMany({});
  await prisma.projectCategory.deleteMany({});

  // Clear franchise-related data
  await prisma.franchiseStaff.deleteMany({});
  await prisma.franchiseDocument.deleteMany({});
  await prisma.franchisePayment.deleteMany({});
  await prisma.franchiseSale.deleteMany({});
  await prisma.productInventory.deleteMany({});
  await prisma.shoppingInventory.deleteMany({});
  await prisma.franchise.deleteMany({});

  // Seed admin user
  const hashedPassword = await hashPassword(adminPassword);
  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      phone: "+919876543210",
    },
  });

  // Create admin user for coupons (Coupon model references User, not Admin)
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      phone: "+919876543210",
      role: "ADMIN",
      isVerified: true,
    },
  });

  // Seed admin permissions
  const modules = [
    "dashboard",
    "users",
    "products",
    "orders",
    "vendors",
    "authors",
    "blogs",
    "settings",
  ];
  for (const module of modules) {
    const existingPermission = await prisma.permission.findFirst({
      where: {
        adminId: admin.id,
        module,
      },
    });

    if (!existingPermission) {
      await prisma.permission.create({
        data: {
          adminId: admin.id,
          module,
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: true,
        },
      });
      console.log(`✅ Permission created for module: ${module}`);
    } else {
      console.log(`ℹ️ Permission already exists for module: ${module}`);
    }
  }

  // Seed project categories
  const createdCategories = await Promise.all(
    categories.map(async (category) => {
      return await prisma.projectCategory.create({
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
        },
      });
    }),
  );
  console.log(`✅ Created ${createdCategories.length} project categories`);

  // Seed projects (food processing, service, manufacturing, business services)
  const allProjects = [
    ...foodProcessingProjects,
    ...serviceProjects,
    ...tradingProjects,
    ...manufacturingProjects,
  ];

  console.log("🌱 Seeding projects...");
  for (const project of allProjects) {
    const category = createdCategories.find((c) => c.slug === project.categorySlug);
    if (!category) {
      console.warn(`⚠️ Category not found for project: ${project.name}`);
      continue;
    }

    const createdProject = await prisma.project.create({
      data: {
        name: project.name,
        slug: project.slug,
        description: project.description,
        longDescription: project.longDescription,
        projectCategoryId: category.id,
        scheme: project.scheme,
        estimatedCost: project.estimatedCost,
        timeline: project.timeline,
        requirements: project.requirements,
        landRequirement: project.landRequirement,
        powerRequirement: project.powerRequirement,
        manpower: project.manpower,
        rawMaterials: project.rawMaterials,
        marketPotential: project.marketPotential,
        profitMargin: project.profitMargin,
        breakEven: project.breakEven,
        subsidyDetails: project.subsidyDetails,
        documents: project.documents,
      },
    });
    console.log(`✅ Created project: ${project.name}`);

    // Seed machinery for the project (if available)
    if (project.machinery && project.machinery.length > 0) {
      for (const machinery of project.machinery) {
        await prisma.projectMachinery.create({
          data: {
            name: machinery.name,
            cost: machinery.cost,
            projectId: createdProject.id,
          },
        });
      }
      console.log(`✅ Created ${project.machinery.length} machinery items for project: ${project.name}`);
    }
  }

  // Seed government schemes
  console.log("🌱 Seeding government schemes...");
  for (const scheme of governmentSchemes) {
    await prisma.governmentScheme.create({
      data: {
        name: scheme.name,
        slug: scheme.slug,
        description: scheme.description,
        ministry: scheme.ministry,
        eligibility: scheme.eligibility,
        benefits: scheme.benefits,
        applicationProcess: scheme.applicationProcess,
        documents: scheme.documents,
        sectors: scheme.sectors,
        status: scheme.status || "Active", // Default to Active if not specified
        website: scheme.website,
      },
    });
    console.log(`✅ Created government scheme: ${scheme.name}`);
  }

  // Seed sample coupons
  console.log("🌱 Seeding sample coupons...");
  const sampleCoupons = [
    {
      code: "WELCOME10",
      discount: 10,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      adminId: adminUser.id,
    },
    {
      code: "SAVE20",
      discount: 20,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      adminId: adminUser.id,
    },
    {
      code: "FESTIVE25",
      discount: 25,
      expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      adminId: adminUser.id,
    }
  ];

  for (const coupon of sampleCoupons) {
    try {
      await prisma.coupon.create({ data: coupon });
      console.log(`✅ Created coupon: ${coupon.code}`);
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`ℹ️ Coupon ${coupon.code} already exists`);
      } else {
        console.error(`❌ Error creating coupon ${coupon.code}:`, error);
      }
    }
  }

  // Seed franchise data
  console.log("🌱 Seeding franchise data...");

  // Create a category for franchise products
  const franchiseCategory = await prisma.category.create({
    data: {
      name: "Industrial Machinery",
      slug: "industrial-machinery",
      type: "MACHINE",
    },
  });
  console.log("✅ Created franchise category");

  // Create franchise user
  const franchisePassword = await hashPassword("franchise123");
  const franchiseUser = await prisma.user.upsert({
    where: { email: "franchise@martxmart.com" },
    update: {},
    create: {
      name: "Rajesh Kumar",
      email: "franchise@martxmart.com",
      phone: "+919876543211",
      password: franchisePassword,
      role: "FRANCHISE",
      isVerified: true,
    },
  });
  console.log("✅ Created franchise user");

  // Create franchise
  const franchise = await prisma.franchise.create({
    data: {
      name: "MartXMart Delhi Franchise",
      businessAddress: "123 Industrial Area, Delhi - 110001",
      district: "New Delhi",
      state: "Delhi",
      contactEmail: "franchise@martxmart.com",
      contactPhone: "+919876543211",
      gstNumber: "07AABCM1234F1Z5",
      panNumber: "AABCM1234F",
      bankAccountNumber: "123456789012",
      bankIfscCode: "HDFC0001234",
      bankName: "HDFC Bank",
      investmentSlab: "SLAB_25_30_LAKH",
      commissionRate: 12.5,
      status: "ACTIVE",
      contractStartDate: new Date("2024-01-01"),
      contractEndDate: new Date("2026-12-31"),
      isActive: true,
      ownerId: franchiseUser.id,
    },
  });
  console.log("✅ Created franchise");

  // Create sample customers
  const customers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Amit Sharma",
        email: "amit.sharma@email.com",
        phone: "+919876543212",
        role: "CUSTOMER",
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        name: "Priya Singh",
        email: "priya.singh@email.com",
        phone: "+919876543213",
        role: "CUSTOMER",
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        name: "Vikram Patel",
        email: "vikram.patel@email.com",
        phone: "+919876543214",
        role: "CUSTOMER",
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        name: "Sneha Gupta",
        email: "sneha.gupta@email.com",
        phone: "+919876543215",
        role: "CUSTOMER",
        isVerified: true,
      },
    }),
  ]);
  console.log("✅ Created sample customers");

  // Create sample addresses for customers
  const addresses = await Promise.all([
    prisma.address.create({
      data: {
        userId: customers[0].id,
        type: "BILLING",
        contactName: "Amit Sharma",
        phone: "+919876543212",
        addressLine1: "456 Market Road",
        city: "Delhi",
        state: "Delhi",
        zip: "110002",
        placeOfSupply: "Delhi",
      },
    }),
    prisma.address.create({
      data: {
        userId: customers[1].id,
        type: "BILLING",
        contactName: "Priya Singh",
        phone: "+919876543213",
        addressLine1: "789 Commercial Street",
        city: "Delhi",
        state: "Delhi",
        zip: "110003",
        placeOfSupply: "Delhi",
      },
    }),
  ]);
  console.log("✅ Created sample addresses");

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Industrial CNC Machine",
        slug: "industrial-cnc-machine",
        description: "High-precision CNC machining center for industrial use",
        price: 2500000.00,
        stock: 5,
        featured: true,
        images: ["https://example.com/cnc-machine.jpg"],
        brand: "TechMach",
        modelNumber: "CNC-5000",
        hsnCode: "84571000",
        gstPercentage: 18,
        capacity: "500kg",
        powerConsumption: "15kW",
        dimensions: "200x150x180cm",
        weight: 1200,
        warranty: "2 Years",
        industryType: ["Manufacturing", "Automotive"],
        applications: ["Metal cutting", "Precision machining"],
        installationRequired: true,
        categoryId: franchiseCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Food Processing Line",
        slug: "food-processing-line",
        description: "Complete automated food processing production line",
        price: 1800000.00,
        stock: 3,
        featured: true,
        images: ["https://example.com/food-processing.jpg"],
        brand: "FoodTech",
        modelNumber: "FPL-2000",
        hsnCode: "84381000",
        gstPercentage: 18,
        capacity: "2000kg/hour",
        powerConsumption: "25kW",
        dimensions: "500x300x250cm",
        weight: 2500,
        warranty: "3 Years",
        industryType: ["Food Processing"],
        applications: ["Food manufacturing", "Packaging"],
        installationRequired: true,
        categoryId: "sample-category-id", // This would need to be a real category ID
      },
    }),
  ]);
  console.log("✅ Created sample products");

  // Create franchise inventory
  await Promise.all([
    prisma.productInventory.create({
      data: {
        productId: products[0].id,
        franchiseId: franchise.id,
        quantity: 2,
        minStock: 1,
        location: "Warehouse A",
      },
    }),
    prisma.productInventory.create({
      data: {
        productId: products[1].id,
        franchiseId: franchise.id,
        quantity: 1,
        minStock: 1,
        location: "Warehouse B",
      },
    }),
  ]);
  console.log("✅ Created franchise inventory");

  // Create sample orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        orderNumber: "ORD-2024-001",
        userId: customers[0].id,
        totalAmount: 2500000.00,
        status: "DELIVERED",
        shippingAddressId: addresses[0].id,
        billingAddressId: addresses[0].id,
        franchiseId: franchise.id,
      },
    }),
    prisma.order.create({
      data: {
        orderNumber: "ORD-2024-002",
        userId: customers[1].id,
        totalAmount: 1800000.00,
        status: "PROCESSING",
        shippingAddressId: addresses[1].id,
        billingAddressId: addresses[1].id,
        franchiseId: franchise.id,
      },
    }),
    prisma.order.create({
      data: {
        orderNumber: "ORD-2024-003",
        userId: customers[2].id,
        totalAmount: 1200000.00,
        status: "SHIPPED",
        franchiseId: franchise.id,
      },
    }),
  ]);
  console.log("✅ Created sample orders");

  // Create order items
  await Promise.all([
    prisma.productOrderItem.create({
      data: {
        orderId: orders[0].id,
        productId: products[0].id,
        quantity: 1,
        price: 2500000.00,
        subtotal: 2500000.00,
      },
    }),
    prisma.productOrderItem.create({
      data: {
        orderId: orders[1].id,
        productId: products[1].id,
        quantity: 1,
        price: 1800000.00,
        subtotal: 1800000.00,
      },
    }),
  ]);
  console.log("✅ Created order items");

  // Create franchise staff
  const staffUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Ravi Kumar",
        email: "ravi.kumar@franchise.com",
        phone: "+919876543216",
        role: "STAFF",
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        name: "Meera Joshi",
        email: "meera.joshi@franchise.com",
        phone: "+919876543217",
        role: "STAFF",
        isVerified: true,
      },
    }),
  ]);

  await Promise.all([
    prisma.franchiseStaff.create({
      data: {
        franchiseId: franchise.id,
        userId: staffUsers[0].id,
        role: "MANAGER",
        permissions: {
          canViewOrders: true,
          canManageInventory: true,
          canManageStaff: false,
          canViewReports: true,
        },
      },
    }),
    prisma.franchiseStaff.create({
      data: {
        franchiseId: franchise.id,
        userId: staffUsers[1].id,
        role: "SALES_EXECUTIVE",
        permissions: {
          canViewOrders: true,
          canManageInventory: false,
          canManageStaff: false,
          canViewReports: false,
        },
      },
    }),
  ]);
  console.log("✅ Created franchise staff");

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });