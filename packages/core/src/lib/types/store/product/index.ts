import { schemaRegistry } from '../../schema-registry.js';
import { ProductRequestSchema } from './product.request.js';
import { ProductResponseSchema } from './product.response.js';

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

export * from './product.price.response.js';
export * from './product.request.js';
export * from './product.response.js';
