import { prisma } from "@/lib/prisma";
import { hsn } from "./hsn";

async function main() {
  try {
    const result = await prisma.hsnDetail.createMany({
      data: hsn,
      skipDuplicates: true, // avoids inserting duplicates if ID or hsnCode is unique
    });
  } catch (error) {
    console.error("❌ Error inserting HSNs:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
