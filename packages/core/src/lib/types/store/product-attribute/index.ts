import { schemaRegistry } from '../../schema-registry.js';
import { ProductAttributeResponseSchema } from './product.attribute.schema.js';

schemaRegistry.add(ProductAttributeResponseSchema, {
  surface: 'store',
  route: '/wc/store/v1/products/attributes',
  kind: 'response',
  alsoAt: ['/wc/store/v1/products/attributes/(?P<id>[\\d]+)'],
});

export * from './product.attribute.schema.js';
