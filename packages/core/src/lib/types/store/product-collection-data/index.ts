import { schemaRegistry } from '../../schema-registry.js';
import { ProductCollectionDataRequestSchema } from './product.collection.data.query.schema.js';
import { ProductCollectionDataResponseSchema } from './product.collection.data.schema.js';

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

export * from './product.collection.data.attribute.counts.schema.js';
export * from './product.collection.data.price.range.schema.js';
export * from './product.collection.data.rating.counts.schema.js';
export * from './product.collection.data.query.schema.js';
export * from './product.collection.data.schema.js';
export * from './product.collection.data.taxonomy.counts.schema.js';
