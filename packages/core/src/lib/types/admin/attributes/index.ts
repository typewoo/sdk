import { schemaRegistry } from '../../schema-registry.js';
import { AdminProductAttributeSchema } from './attribute.schema.js';
import { AdminProductAttributeCreateRequestSchema } from './attribute.create.schema.js';
import { AdminProductAttributeUpdateRequestSchema } from './attribute.update.schema.js';
import { AdminProductAttributeQueryParamsSchema } from './attribute.query.schema.js';
import { AdminProductAttributeTermSchema } from './attribute-term.schema.js';
import { AdminProductAttributeTermCreateRequestSchema } from './attribute-term.create.schema.js';
import { AdminProductAttributeTermUpdateRequestSchema } from './attribute-term.update.schema.js';
import { AdminProductAttributeTermQueryParamsSchema } from './attribute-term.query.schema.js';

schemaRegistry.add(AdminProductAttributeSchema, {
  surface: 'admin',
  route: '/wc/v3/products/attributes',
  kind: 'response',
});
schemaRegistry.add(AdminProductAttributeCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products/attributes',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminProductAttributeUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products/attributes',
  kind: 'request',
  method: 'PUT',
});
schemaRegistry.add(AdminProductAttributeQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/products/attributes',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(AdminProductAttributeTermSchema, {
  surface: 'admin',
  route: '/wc/v3/products/attributes/(?P<attribute_id>[\\d]+)/terms',
  kind: 'response',
});
schemaRegistry.add(AdminProductAttributeTermCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products/attributes/(?P<attribute_id>[\\d]+)/terms',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminProductAttributeTermUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products/attributes/(?P<attribute_id>[\\d]+)/terms',
  kind: 'request',
  method: 'PUT',
});
schemaRegistry.add(AdminProductAttributeTermQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/products/attributes/(?P<attribute_id>[\\d]+)/terms',
  kind: 'query',
  method: 'GET',
});

export * from './attribute.schema.js';
export * from './attribute.create.schema.js';
export * from './attribute.update.schema.js';
export * from './attribute.query.schema.js';
export * from './attribute-term.schema.js';
export * from './attribute-term.create.schema.js';
export * from './attribute-term.update.schema.js';
export * from './attribute-term.query.schema.js';
