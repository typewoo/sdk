import { schemaRegistry } from '../../schema-registry.js';
import { CheckoutCreateRequestSchema } from './checkout.create.request.js';
import { CheckoutResponseSchema } from './checkout.response.js';
import { CheckoutUpdateRequestSchema } from './checkout.update.request.js';

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

export * from './checkout.billing.response.js';
export * from './checkout.create.request.js';
export * from './checkout.response.js';
export * from './checkout.shipping.js';
export * from './checkout.update.request.js';
