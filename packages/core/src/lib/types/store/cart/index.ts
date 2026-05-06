import { schemaRegistry } from '../../schema-registry.js';
import { CartResponseSchema } from './cart.schema.js';
import { CartCustomerRequestSchema } from './cart.customer.update.schema.js';

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

export * from './cart.billing.schema.js';
export * from './cart.customer.update.schema.js';
export * from './cart.error.schema.js';
export * from './cart.fee.schema.js';
export * from './cart.schema.js';
export * from './cart.shipping.rate.schema.js';
export * from './cart.shipping.schema.js';
export * from './cart.total.schema.js';
