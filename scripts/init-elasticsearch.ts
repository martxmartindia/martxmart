import { PrismaClient } from '@prisma/client';
import { initializeIndex, bulkIndexProducts } from '../lib/elasticsearch.js';

const prisma = new PrismaClient();

async function initElasticsearch() {
  try {
    console.log('Initializing Elasticsearch index...');
    await initializeIndex();
    console.log('Index created successfully');

    console.log('Fetching products from database...');
    const products = await prisma.product.findMany({
      include: {
        category: true,
      }
    });

    if (products.length > 0) {
      console.log(`Indexing ${products.length} products...`);
      await bulkIndexProducts(products);
      console.log('Products indexed successfully');
    } else {
      console.log('No products found to index');
    }

    console.log('Elasticsearch initialization completed');
  } catch (error) {
    console.error('Error initializing Elasticsearch:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initElasticsearch();