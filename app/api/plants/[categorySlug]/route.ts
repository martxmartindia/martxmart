import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("categorySlug");

  if (!categorySlug) {
    return new Response(JSON.stringify({ error: "Missing categorySlug parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const plantCategory = await prisma.plantCategory.findUnique({
      where: { slug: categorySlug },
      include: {
        plants: true,
      },
    });

    if (!plantCategory) {
      return new Response(JSON.stringify({ error: "Plant category not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(plantCategory), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching plant category:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch plant category" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
