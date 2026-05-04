import { schemaRegistry } from '../../schema-registry.js';
import { CartResponseSchema } from './cart.response.js';
import { CartCustomerRequestSchema } from './cart.customer.request.js';

schemaRegistry.add(CartResponseSchema, {
  surface: 'store',
  route: '/wc/store/v1/cart',
  kind: 'response',
});
schemaRegistry.add(CartCustomerRequestSchema, {
  surface: 'store',
  route: '/wc/store/v1/cart/update-customer',
  kind: 'request',
  method: 'POST',
});

export * from './cart.billing.response.js';
export * from './cart.customer.request.js';
export * from './cart.response.js';
export * from './cart.shipping.rate.response.js';
export * from './cart.shipping.response.js';
export * from './cart.total.response.js';
