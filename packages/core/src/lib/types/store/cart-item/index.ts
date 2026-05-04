import { schemaRegistry } from '../../schema-registry.js';
import { CartItemAddRequestSchema } from './cart.item.add.request.js';
import { CartItemEditRequestSchema } from './cart.item.edit.request.js';
import { CartItemResponseSchema } from './cart.item.response.js';

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

export * from './cart.item.add.request.js';
export * from './cart.item.edit.request.js';
export * from './cart.item.price.response.js';
export * from './cart.item.quantity.limits.response.js';
export * from './cart.item.response.js';
export * from './cart.item.total.response.js';
export * from './cart.item.variation.response.js';
