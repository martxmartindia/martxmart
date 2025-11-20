import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  auth: process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD ? {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD,
  } : undefined,
  requestTimeout: 30000,
  pingTimeout: 3000,
});

export const PRODUCTS_INDEX = 'products';

export async function initializeIndex() {
  try {
    const exists = await client.indices.exists({ index: PRODUCTS_INDEX });
    if (!exists) {
      await client.indices.create({
        index: PRODUCTS_INDEX,
        body: {
          settings: {
            analysis: {
              analyzer: {
                product_analyzer: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'stop', 'snowball']
                }
              }
            }
          },
          mappings: {
            properties: {
              id: { type: 'keyword' },
              name: { 
                type: 'text', 
                analyzer: 'product_analyzer',
                fields: {
                  keyword: { type: 'keyword' },
                  suggest: { type: 'completion' }
                }
              },
              description: { type: 'text', analyzer: 'product_analyzer' },
              brand: { 
                type: 'keyword',
                fields: {
                  text: { type: 'text', analyzer: 'product_analyzer' }
                }
              },
              category: { type: 'keyword' },
              categoryName: { type: 'text', analyzer: 'product_analyzer' },
              price: { type: 'float' },
              stock: { type: 'integer' },
              featured: { type: 'boolean' },
              averageRating: { type: 'float' },
              reviewCount: { type: 'integer' },
              images: { type: 'keyword' },
              tags: { type: 'keyword' },
              createdAt: { type: 'date' },
            }
          }
        }
      });
    }
  } catch (error) {
    console.error('Error initializing Elasticsearch index:', error);
  }
}

export async function indexProduct(product: any) {
  try {
    await client.index({
      index: PRODUCTS_INDEX,
      id: product.id,
      body: {
        id: product.id,
        name: product.name,
        description: product.description,
        brand: product.brand,
        category: product.categoryId,
        categoryName: product.category?.name,
        price: typeof product.price === 'object' ? product.price.toNumber() : product.price,
        stock: product.stock,
        featured: product.featured,
        averageRating: product.averageRating || 0,
        reviewCount: product.reviewCount || 0,
        images: product.images || [],
        tags: [
          product.name?.toLowerCase(),
          product.brand?.toLowerCase(),
          product.category?.name?.toLowerCase(),
          ...(product.industryType || []),
          ...(product.applications || [])
        ].filter(Boolean),
        createdAt: product.createdAt,
      }
    });
  } catch (error) {
    console.error('Error indexing product:', error);
  }
}

export async function searchProducts(query: string, filters: any = {}, page = 1, limit = 24) {
  try {
    const must: any[] = [];
    const should: any[] = [];
    
    if (query) {
      // Multi-match query with boosting
      must.push({
        bool: {
          should: [
            {
              multi_match: {
                query,
                fields: ['name^3', 'brand^2', 'description', 'categoryName', 'tags'],
                type: 'best_fields',
                fuzziness: 'AUTO'
              }
            },
            {
              match_phrase_prefix: {
                name: {
                  query,
                  boost: 2
                }
              }
            },
            {
              wildcard: {
                'name.keyword': {
                  value: `*${query.toLowerCase()}*`,
                  boost: 1.5
                }
              }
            }
          ],
          minimum_should_match: 1
        }
      });
    }

    const filter: any[] = [];
    
    if (filters.category) {
      filter.push({ term: { category: filters.category } });
    }
    
    if (filters.brand) {
      filter.push({ term: { brand: filters.brand } });
    }
    
    if (filters.featured) {
      filter.push({ term: { featured: true } });
    }
    
    if (filters.minPrice || filters.maxPrice) {
      const range: any = {};
      if (filters.minPrice) range.gte = filters.minPrice;
      if (filters.maxPrice) range.lte = filters.maxPrice;
      filter.push({ range: { price: range } });
    }

    // Stock filter
    filter.push({ range: { stock: { gt: 0 } } });

    const sort: any[] = [];
    switch (filters.sort) {
      case 'price-low':
        sort.push({ price: { order: 'asc' } });
        break;
      case 'price-high':
        sort.push({ price: { order: 'desc' } });
        break;
      case 'rating':
        sort.push({ averageRating: { order: 'desc' } });
        sort.push({ reviewCount: { order: 'desc' } });
        break;
      case 'popularity':
        sort.push({ reviewCount: { order: 'desc' } });
        sort.push({ averageRating: { order: 'desc' } });
        break;
      default:
        sort.push({ _score: { order: 'desc' } });
        sort.push({ createdAt: { order: 'desc' } });
    }

    const response = await client.search({
      index: PRODUCTS_INDEX,
      body: {
        query: {
          bool: {
            must: must.length > 0 ? must : [{ match_all: {} }],
            filter,
            should
          }
        },
        sort,
        from: (page - 1) * limit,
        size: limit,
        highlight: {
          fields: {
            name: {},
            description: {}
          }
        },
        aggs: {
          brands: {
            terms: { field: 'brand', size: 50 }
          },
          categories: {
            terms: { field: 'categoryName.keyword', size: 20 }
          },
          price_ranges: {
            range: {
              field: 'price',
              ranges: [
                { key: 'Under 10000', to: 10000 },
                { key: '10000-50000', from: 10000, to: 50000 },
                { key: '50000-100000', from: 50000, to: 100000 },
                { key: 'Above 100000', from: 100000 }
              ]
            }
          }
        }
      }
    });

    const total = typeof response.hits.total === 'number' ? response.hits.total : response.hits.total?.value || 0;
    const aggregations = response.aggregations as any;
    
    return {
      hits: response.hits.hits.map((hit: any) => ({
        ...hit._source,
        _score: hit._score,
        highlight: hit.highlight
      })),
      total,
      brands: aggregations?.brands?.buckets?.map((bucket: any) => bucket.key) || [],
      categories: aggregations?.categories?.buckets?.map((bucket: any) => bucket.key) || [],
      priceRanges: aggregations?.price_ranges?.buckets || []
    };
  } catch (error) {
    console.error('Error searching products:', error);
    return { hits: [], total: 0, brands: [], categories: [], priceRanges: [] };
  }
}

export async function getSuggestions(query: string, limit = 8) {
  try {
    const response = await client.search({
      index: PRODUCTS_INDEX,
      body: {
        suggest: {
          product_suggest: {
            prefix: query,
            completion: {
              field: 'name.suggest',
              size: limit
            }
          }
        },
        query: {
          bool: {
            should: [
              {
                match_phrase_prefix: {
                  name: {
                    query,
                    max_expansions: 10
                  }
                }
              },
              {
                match_phrase_prefix: {
                  'brand.text': {
                    query,
                    max_expansions: 5
                  }
                }
              }
            ]
          }
        },
        _source: ['name', 'brand'],
        size: limit
      }
    });

    const suggestions = new Set<string>();
    
    // Add completion suggestions
    const suggestOptions = response.suggest?.product_suggest?.[0]?.options;
    if (Array.isArray(suggestOptions)) {
      suggestOptions.forEach((option: any) => {
        suggestions.add(option.text);
      });
    }
    
    // Add search results
    response.hits.hits.forEach((hit: any) => {
      suggestions.add(hit._source.name);
      if (hit._source.brand) {
        suggestions.add(hit._source.brand);
      }
    });

    return Array.from(suggestions).slice(0, limit);
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return [];
  }
}

export async function deleteProduct(productId: string) {
  try {
    await client.delete({
      index: PRODUCTS_INDEX,
      id: productId
    });
  } catch (error) {
    console.error('Error deleting product from index:', error);
  }
}

export async function bulkIndexProducts(products: any[]) {
  try {
    const body = products.flatMap(product => [
      { index: { _index: PRODUCTS_INDEX, _id: product.id } },
      {
        id: product.id,
        name: product.name,
        description: product.description,
        brand: product.brand,
        category: product.categoryId,
        categoryName: product.category?.name,
        price: typeof product.price === 'object' ? product.price.toNumber() : product.price,
        stock: product.stock,
        featured: product.featured,
        averageRating: product.averageRating || 0,
        reviewCount: product.reviewCount || 0,
        images: product.images || [],
        tags: [
          product.name?.toLowerCase(),
          product.brand?.toLowerCase(),
          product.category?.name?.toLowerCase(),
          ...(product.industryType || []),
          ...(product.applications || [])
        ].filter(Boolean),
        createdAt: product.createdAt,
      }
    ]);

    await client.bulk({ body });
  } catch (error) {
    console.error('Error bulk indexing products:', error);
  }
}

export default client;