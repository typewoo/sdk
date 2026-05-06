import { schemaRegistry } from '../../schema-registry.js';
import { CartItemAddRequestSchema } from './cart.item.add.schema.js';
import { CartItemEditRequestSchema } from './cart.item.update.schema.js';
import { CartItemResponseSchema } from './cart.item.schema.js';

schemaRegistry.add(CartItemResponseSchema, {
  surface: 'store',
  route: '/wc/store/v1/cart/items',
  kind: 'response',
});
schemaRegistry.add(CartItemAddRequestSchema, {
  surface: 'store',
  route: '/wc/store/v1/cart/add-item',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(CartItemEditRequestSchema, {
  surface: 'store',
  route: '/wc/store/v1/cart/update-item',
  kind: 'request',
  method: 'POST',
});

export * from './cart.item.add.schema.js';
export * from './cart.item.update.schema.js';
export * from './cart.item.price.schema.js';
export * from './cart.item.quantity.limits.schema.js';
export * from './cart.item.schema.js';
export * from './cart.item.total.schema.js';
export * from './cart.item.variation.schema.js';
