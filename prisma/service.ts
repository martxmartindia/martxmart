// prisma/service.ts
import { prisma } from "@/lib/prisma";
import { services } from "@/lib/service-data";

export async function seedServices() {
  console.log("🌱 Seeding services...");
  // delete all services
  await prisma.service.deleteMany({});
  // Step 1: Create all services without connecting relatedServices
  const createdServices = [];
  for (const service of services) {
    const { relatedServices, ...serviceData } = service; // Exclude relatedServices for now

    const createdService = await prisma.service.upsert({
      where: { slug: serviceData.slug },
      update: {
        ...serviceData,
        processSteps: serviceData.processSteps,
        faqs: serviceData.faqs,
      },
      create: {
        ...serviceData,
        processSteps: serviceData.processSteps,
        faqs: serviceData.faqs,
      },
    });

    // Store reference for later relation
    createdServices.push({
      id: createdService.id,
      slug: createdService.slug,
      relatedServiceSlugs: relatedServices.map((rs) => rs.slug),
    });
  }

  // Step 2: Connect related services
  for (const service of createdServices) {
    const { id, relatedServiceSlugs, slug } = service;

    if (relatedServiceSlugs.length === 0) continue;

    // Fetch related service IDs by slug
    const related = await prisma.service.findMany({
      where: { slug: { in: relatedServiceSlugs } },
      select: { id: true, slug: true },
    });

    const foundSlugs = related.map((r) => r.slug);
    const missingSlugs = relatedServiceSlugs.filter(
      (s) => !foundSlugs.includes(s)
    );

    if (missingSlugs.length > 0) {
      console.warn(
        `⚠️ Service "${slug}" has missing related service slugs: ${missingSlugs.join(", ")}`
      );
    }

    if (related.length > 0) {
      await prisma.service.update({
        where: { id },
        data: {
          relatedServices: {
            connect: related.map((r) => ({ id: r.id })),
          },
        },
      });
    }
  }

  console.log(`✅ Created and connected ${createdServices.length} services.`);
}

seedServices()
  .catch((e) => {
    console.error("❌ Error seeding services database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
