import { prisma } from '@/lib/prisma';
import { indexProduct, initializeIndex, bulkIndexProducts, deleteProduct } from '@/lib/elasticsearch';

export async function syncProductsToElasticsearch() {
  try {
    console.log('Initializing Elasticsearch index...');
    await initializeIndex();
    
    const products = await prisma.product.findMany({
      where: { isDeleted: false },
      include: {
        category: { select: { name: true } }
      }
    });

    console.log(`Found ${products.length} products to index`);
    
    // Bulk index in batches of 100
    const batchSize = 100;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await bulkIndexProducts(batch);
      console.log(`Indexed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)}`);
    }

    console.log(`Successfully indexed ${products.length} products to Elasticsearch`);
  } catch (error) {
    console.error('Error syncing products to Elasticsearch:', error);
    throw error;
  }
}

export async function indexSingleProduct(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: { select: { name: true } }
      }
    });

    if (product && !product.isDeleted) {
      await indexProduct(product);
      console.log(`Indexed product: ${product.name}`);
    } else if (product?.isDeleted) {
      await deleteProduct(productId);
      console.log(`Removed deleted product from index: ${productId}`);
    }
  } catch (error) {
    console.error('Error indexing single product:', error);
  }
}

export async function removeProductFromIndex(productId: string) {
  try {
    await deleteProduct(productId);
    console.log(`Removed product from index: ${productId}`);
  } catch (error) {
    console.error('Error removing product from index:', error);
  }
}