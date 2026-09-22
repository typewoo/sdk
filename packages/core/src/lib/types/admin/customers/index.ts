import { schemaRegistry } from '../../schema-registry.js';
import { AdminCustomerSchema } from './customer.schema.js';
import { AdminCustomerCreateRequestSchema } from './customer.create.schema.js';
import { AdminCustomerUpdateRequestSchema } from './customer.update.schema.js';
import { AdminCustomerQueryParamsSchema } from './customer.query.schema.js';

schemaRegistry.add(AdminCustomerSchema, {
  surface: 'admin',
  route: '/wc/v3/customers',
  kind: 'response',
  // WC JSON Schema declares these as non-nullable, but the live API returns
  // null for customers who have never been modified.
  knownNullable: ['date_modified', 'date_modified_gmt'],
});
schemaRegistry.add(AdminCustomerCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/customers',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminCustomerUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/customers/(?P<id>[\\d]+)',
  kind: 'request',
  method: 'PATCH',
});
schemaRegistry.add(AdminCustomerQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/customers',
  kind: 'query',
  method: 'GET',
});

export * from './customer.schema.js';
export * from './customer.create.schema.js';
export * from './customer.update.schema.js';
export * from './customer.query.schema.js';
