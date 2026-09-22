import { schemaRegistry } from '../../schema-registry.js';
import { ProductBrandResponseSchema } from './product.brand.schema.js';

schemaRegistry.add(ProductBrandResponseSchema, {
  surface: 'store',
  route: '/wc/store/v1/products/brands',
  kind: 'response',
  alsoAt: ['/wc/store/v1/products/brands/(?P<identifier>[\\w-]+)'],
});

export * from './product.brand.schema.js';
