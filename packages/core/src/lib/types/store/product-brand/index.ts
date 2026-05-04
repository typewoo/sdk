import { schemaRegistry } from '../../schema-registry.js';
import { ProductBrandResponseSchema } from './product.brand.response.js';

schemaRegistry.add(ProductBrandResponseSchema, {
  surface: 'store',
  route: '/wc/store/v1/products/brands',
  kind: 'response',
});

export * from './product.brand.response.js';
