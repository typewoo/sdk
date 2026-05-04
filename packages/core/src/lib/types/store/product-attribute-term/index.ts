import { schemaRegistry } from '../../schema-registry.js';
import { ProductAttributeTermRequestSchema } from './product.attribute.term.request.js';
import { ProductAttributeTermResponseSchema } from './product.attribute.term.response.js';

schemaRegistry.add(ProductAttributeTermResponseSchema, {
  surface: 'store',
  route: '/wc/store/v1/products/attributes/(?P<attribute_id>[\\d]+)/terms',
  kind: 'response',
});
schemaRegistry.add(ProductAttributeTermRequestSchema, {
  surface: 'store',
  route: '/wc/store/v1/products/attributes/(?P<attribute_id>[\\d]+)/terms',
  kind: 'query',
  method: 'GET',
});

export * from './product.attribute.term.request.js';
export * from './product.attribute.term.response.js';
