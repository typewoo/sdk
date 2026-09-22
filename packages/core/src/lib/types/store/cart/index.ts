import { schemaRegistry } from '../../schema-registry.js';
import { CartResponseSchema } from './cart.schema.js';
import { CartCustomerRequestSchema } from './cart.customer.update.schema.js';
import { PARTIAL_ADDRESS_SCHEMA_BUGS } from '../known-schema-bugs.js';

schemaRegistry.add(CartResponseSchema, {
  surface: 'store',
  route: '/wc/store/v1/cart',
  kind: 'response',
  // Every cart mutation route responds with the updated cart.
  alsoAt: [
    '/wc/store/v1/cart/add-item',
    '/wc/store/v1/cart/apply-coupon',
    '/wc/store/v1/cart/remove-coupon',
    '/wc/store/v1/cart/remove-item',
    '/wc/store/v1/cart/select-shipping-rate',
    '/wc/store/v1/cart/update-customer',
    '/wc/store/v1/cart/update-item',
  ],
});
schemaRegistry.add(CartCustomerRequestSchema, {
  surface: 'store',
  route: '/wc/store/v1/cart/update-customer',
  kind: 'request',
  method: 'POST',
  knownSchemaBugs: PARTIAL_ADDRESS_SCHEMA_BUGS,
});

export * from './cart.billing.schema.js';
export * from './cart.customer.update.schema.js';
export * from './cart.error.schema.js';
export * from './cart.fee.schema.js';
export * from './cart.schema.js';
export * from './cart.shipping.rate.schema.js';
export * from './cart.shipping.schema.js';
export * from './cart.total.schema.js';
