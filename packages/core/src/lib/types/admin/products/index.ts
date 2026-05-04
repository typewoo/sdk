import { schemaRegistry } from '../../schema-registry.js';
import { AdminProductSchema } from './product.schema.js';
import { AdminProductCreateRequestSchema } from './product.create.schema.js';
import { AdminProductUpdateRequestSchema } from './product.update.schema.js';
import { AdminProductQueryParamsSchema } from './product.query.schema.js';

schemaRegistry.add(AdminProductSchema, {
  surface: 'admin',
  route: '/wc/v3/products',
  kind: 'response',
});
schemaRegistry.add(AdminProductCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminProductUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products/(?P<id>[\\d]+)',
  kind: 'request',
  method: 'PATCH',
});
schemaRegistry.add(AdminProductQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/products',
  kind: 'query',
  method: 'GET',
});

export * from './product.schema.js';
export * from './product.create.schema.js';
export * from './product.update.schema.js';
export * from './product.query.schema.js';
