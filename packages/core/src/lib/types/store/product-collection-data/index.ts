import { schemaRegistry } from '../../schema-registry.js';
import { ProductCollectionDataRequestSchema } from './product.collection.data.request.js';
import { ProductCollectionDataResponseSchema } from './product.collection.data.response.js';

schemaRegistry.add(ProductCollectionDataResponseSchema, {
  surface: 'store',
  route: '/wc/store/v1/products/collection-data',
  kind: 'response',
});
schemaRegistry.add(ProductCollectionDataRequestSchema, {
  surface: 'store',
  route: '/wc/store/v1/products/collection-data',
  kind: 'request',
  method: 'POST',
});

export * from './product.collection.data.attribute.counts.response.js';
export * from './product.collection.data.price.range.response.js';
export * from './product.collection.data.rating.counts.response.js';
export * from './product.collection.data.request.js';
export * from './product.collection.data.response.js';
export * from './product.collection.data.taxonomy.counts.response.js';
