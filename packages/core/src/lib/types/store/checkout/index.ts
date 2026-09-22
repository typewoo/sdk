import { schemaRegistry } from '../../schema-registry.js';
import { CheckoutCreateRequestSchema } from './checkout.create.schema.js';
import { CheckoutResponseSchema } from './checkout.schema.js';
import { CheckoutUpdateRequestSchema } from './checkout.update.schema.js';
import { PARTIAL_ADDRESS_SCHEMA_BUGS } from '../known-schema-bugs.js';

schemaRegistry.add(CheckoutResponseSchema, {
  surface: 'store',
  route: '/wc/store/v1/checkout',
  kind: 'response',
  openEnums: ['payment_method'],
});
schemaRegistry.add(CheckoutCreateRequestSchema, {
  surface: 'store',
  route: '/wc/store/v1/checkout',
  kind: 'request',
  method: 'POST',
  openEnums: ['payment_method'],
  undocumented: ['payment_data'],
  knownSchemaBugs: PARTIAL_ADDRESS_SCHEMA_BUGS,
});
schemaRegistry.add(CheckoutUpdateRequestSchema, {
  surface: 'store',
  route: '/wc/store/v1/checkout',
  kind: 'request',
  method: 'PUT',
  openEnums: ['payment_method'],
  knownSchemaBugs: PARTIAL_ADDRESS_SCHEMA_BUGS,
});

export * from './checkout.billing.schema.js';
export * from './checkout.create.schema.js';
export * from './checkout.schema.js';
export * from './checkout.shipping.schema.js';
export * from './checkout.update.schema.js';
