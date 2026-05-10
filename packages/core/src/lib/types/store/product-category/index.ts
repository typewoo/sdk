import { schemaRegistry } from '../../schema-registry.js';
import { ProductCategoryRequestSchema } from './product.category.query.schema.js';
import { ProductCategoryResponseSchema } from './product.category.schema.js';

schemaRegistry.add(ProductCategoryResponseSchema, {
  surface: 'store',
  route: '/wc/store/v1/products/categories',
  kind: 'response',
  // WC JSON Schema declares image as non-nullable, but the live API returns
  // null when no image has been assigned to the category.
  knownNullable: ['image'],
});
schemaRegistry.add(ProductCategoryRequestSchema, {
  surface: 'store',
  route: '/wc/store/v1/products/categories',
  kind: 'query',
  method: 'GET',
});

export * from './product.category.query.schema.js';
export * from './product.category.schema.js';
