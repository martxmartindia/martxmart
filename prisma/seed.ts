// scripts/seedDatabase.ts
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
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
  await prisma.admin.deleteMany({});
  await prisma.governmentScheme.deleteMany({});
  await prisma.projectCategory.deleteMany({});

  // Seed admin user
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
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