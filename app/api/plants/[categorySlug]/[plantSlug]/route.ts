import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("categorySlug");
  const plantSlug = searchParams.get("plantSlug");

  if (!categorySlug || !plantSlug) {
    return new Response(JSON.stringify({ error: "Missing required query parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const plant = await prisma.plant.findFirst({
      where: {
        slug: plantSlug,
        plantCategory: {
          slug: categorySlug,
        },
      },
      include: {
        plantCategory: {
          select: {
            name: true,
            slug: true,
          },
        },
        products: {
          select: {
            id: true,
            name: true,
            description: true,
            images: true,
            price: true,
            specifications: true,
            stock: true,
            hsnCode: true,
          },
        },
      },
    });

    if (!plant) {
      return new Response(JSON.stringify({ error: "Plant not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(plant), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching plant:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch plant" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
