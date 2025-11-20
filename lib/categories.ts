import { prisma } from "@/lib/prisma";

export async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  })

  // Add placeholder images for categories
  return categories.map((category) => ({
    ...category,
    image: `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(category.name)}`,
  }))
}

export async function getCategoryById(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
  })

  if (!category) {
    return null
  }

  return {
    ...category,
    image: `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(category.name)}`,
  }
}

