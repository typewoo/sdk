import { schemaRegistry } from '../../schema-registry.js';
import { ProductTagRequestSchema } from './product.tag.request.js';
import { ProductTagResponseSchema } from './product.tag.response.js';

schemaRegistry.add(ProductTagResponseSchema, {
  surface: 'store',
  route: '/wc/store/v1/products/tags',
  kind: 'response',
});
schemaRegistry.add(ProductTagRequestSchema, {
  surface: 'store',
  route: '/wc/store/v1/products/tags',
  kind: 'query',
  method: 'GET',
});

export * from './product.tag.request.js';
export * from './product.tag.response.js';
