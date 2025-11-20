import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api-error";

export class ProductService {
  static async createProduct(vendorId: string, productData: any) {
    try {
      const vendor = await prisma.vendorProfile.findUnique({
        where: { id: vendorId }
      });

      if (!vendor) {
        throw ApiError.notFound('Vendor not found');
      }

      const product = await prisma.product.create({
        data: {
          ...productData,
          vendorId,
          averageRating: 0,
          reviewCount: 0
        }
      });

      return product;
    } catch (error) {
      throw error instanceof ApiError ? error : ApiError.internal('Product creation failed');
    }
  }

  static async updateProduct(productId: string, vendorId: string, updateData: any) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product) {
        throw ApiError.notFound('Product not found');
      }
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: updateData
      });

      return updatedProduct;
    } catch (error) {
      throw error instanceof ApiError ? error : ApiError.internal('Product update failed');
    }
  }

  static async createReview(userId: string, productId: string, reviewData: any) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product) {
        throw ApiError.notFound('Product not found');
      }

      const existingReview = await prisma.review.findFirst({
        where: {
          userId,
          productId
        }
      });

      if (existingReview) {
        throw ApiError.badRequest('You have already reviewed this product');
      }

      const review = await prisma.review.create({
        data: {
          ...reviewData,
          userId,
          productId
        }
      });

      // Update product's average rating and review count
      const reviews = await prisma.review.findMany({
        where: { productId }
      });

      const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

      await prisma.product.update({
        where: { id: productId },
        data: {
          averageRating,
          reviewCount: reviews.length
        }
      });

      return review;
    } catch (error) {
      throw error instanceof ApiError ? error : ApiError.internal('Review creation failed');
    }
  }

  static async getVendorProducts(vendorId: string, filters: any = {}) {
    try {
      const products = await prisma.product.findMany({
        where: {
          vendorId,
          isDeleted: false,
          ...filters
        },
        include: {
          category: true,
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });

      return products;
    } catch (error) {
      throw error instanceof ApiError ? error : ApiError.internal('Failed to fetch vendor products');
    }
  }

  static async searchProducts(searchParams: any) {
    try {
      const {
        query,
        categoryId,
        minPrice,
        maxPrice,
        sortBy,
        page = 1,
        limit = 10
      } = searchParams;

      const where: any = {
        isDeleted: false
      };

      if (query) {
        where.OR = [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ];
      }

      if (categoryId) {
        where.categoryId = categoryId;
      }

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = minPrice;
        if (maxPrice) where.price.lte = maxPrice;
      }

      const orderBy: any = {};
      switch (sortBy) {
        case 'price_asc':
          orderBy.price = 'asc';
          break;
        case 'price_desc':
          orderBy.price = 'desc';
          break;
        case 'rating':
          orderBy.averageRating = 'desc';
          break;
        default:
          orderBy.createdAt = 'desc';
      }

      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: {
            category: true,
          }
        }),
        prisma.product.count({ where })
      ]);

      return {
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw error instanceof ApiError ? error : ApiError.internal('Product search failed');
    }
  }
}