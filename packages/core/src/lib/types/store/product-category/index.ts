import { schemaRegistry } from '../../schema-registry.js';
import { ProductCategoryRequestSchema } from './product.category.query.schema.js';
import { ProductCategoryResponseSchema } from './product.category.schema.js';

schemaRegistry.add(ProductCategoryResponseSchema, {
  surface: 'store',
  route: '/wc/store/v1/products/categories',
  kind: 'response',
});
schemaRegistry.add(ProductCategoryRequestSchema, {
  surface: 'store',
  route: '/wc/store/v1/products/categories',
  kind: 'query',
  method: 'GET',
});

export * from './product.category.query.schema.js';
export * from './product.category.schema.js';
