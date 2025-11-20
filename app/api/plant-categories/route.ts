import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export  async function GET(req: Request) {
    try {
      const plantCategories = await prisma.plantCategory.findMany({
        include: {
          plants: {
            select: {
              id: true,
            },
          },
        },
      });
      return NextResponse.json({message:"Fetch Successfully Plant Category",plantCategories})
    } catch (error) {
      console.error("Error fetching plant categories:", error);
      return NextResponse.json({message:"Error fetching plant categories"})
    }
}