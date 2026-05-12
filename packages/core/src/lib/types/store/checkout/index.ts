import { schemaRegistry } from '../../schema-registry.js';
import { CheckoutCreateRequestSchema } from './checkout.create.schema.js';
import { CheckoutResponseSchema } from './checkout.schema.js';
import { CheckoutUpdateRequestSchema } from './checkout.update.schema.js';

schemaRegistry.add(CheckoutResponseSchema, {
  surface: 'store',
  route: '/wc/store/v1/checkout',
  kind: 'response',
});
schemaRegistry.add(CheckoutCreateRequestSchema, {
  surface: 'store',
  route: '/wc/store/v1/checkout',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(CheckoutUpdateRequestSchema, {
  surface: 'store',
  route: '/wc/store/v1/checkout/(?P<id>[\\d]+)',
  kind: 'request',
  method: 'PUT',
});

export * from './checkout.billing.schema.js';
export * from './checkout.create.schema.js';
export * from './checkout.schema.js';
export * from './checkout.shipping.schema.js';
export * from './checkout.update.schema.js';
