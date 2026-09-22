import { schemaRegistry } from '../../schema-registry.js';
import { AdminBrandSchema } from './brand.schema.js';
import { AdminBrandCreateRequestSchema } from './brand.create.schema.js';
import { AdminBrandUpdateRequestSchema } from './brand.update.schema.js';
import { AdminBrandQueryParamsSchema } from './brand.query.schema.js';

schemaRegistry.add(AdminBrandSchema, {
  surface: 'admin',
  route: '/wc/v3/products/brands',
  kind: 'response',
  // WC JSON Schema declares image as non-nullable, but the live API returns
  // null when no image has been assigned to the brand.
  knownNullable: ['image'],
});
schemaRegistry.add(AdminBrandCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products/brands',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminBrandUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products/brands/(?P<id>[\\d]+)',
  kind: 'request',
  method: 'PATCH',
});
schemaRegistry.add(AdminBrandQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/products/brands',
  kind: 'query',
  method: 'GET',
});

export * from './brand.schema.js';
export * from './brand.create.schema.js';
export * from './brand.update.schema.js';
export * from './brand.query.schema.js';
