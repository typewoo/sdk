import { schemaRegistry } from '../../schema-registry.js';
import { ProductRequestSchema } from './product.query.schema.js';
import { ProductResponseSchema } from './product.schema.js';

schemaRegistry.add(ProductResponseSchema, {
  surface: 'store',
  route: '/wc/store/v1/products',
  kind: 'response',
});
schemaRegistry.add(ProductRequestSchema, {
  surface: 'store',
  route: '/wc/store/v1/products',
  kind: 'query',
  method: 'GET',
});

export * from './product.embedded.schema.js';
export * from './product.price.schema.js';
export * from './product.query.schema.js';
export * from './product.schema.js';
