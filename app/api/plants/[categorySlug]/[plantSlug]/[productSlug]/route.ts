import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("categorySlug");
  const plantSlug = searchParams.get("plantSlug");
  const productSlug = searchParams.get("productSlug");

  if (!categorySlug || !plantSlug || !productSlug) {
    return new Response(JSON.stringify({ error: "Missing required query parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const product = await prisma.product.findFirst({
      where: {
        slug: productSlug,
        plant: {
          slug: plantSlug,
          plantCategory: {
            slug: categorySlug,
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        images: true,
        price: true,
        specifications: true,
        stock: true,
        hsnCode: true,
      },
    });

    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch product" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
