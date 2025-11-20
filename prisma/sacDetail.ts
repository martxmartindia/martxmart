import { prisma } from "@/lib/prisma";
import { sac } from "./sac";

async function main() {
  try {
    const result = await prisma.sacDetail.createMany({
      data: sac,
      skipDuplicates: true, // avoids inserting duplicates if ID or hsnCode is unique
    });
    console.log(`✅ Inserted ${result.count} sac records.`);
  } catch (error) {
    console.error("❌ Error inserting sac:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
