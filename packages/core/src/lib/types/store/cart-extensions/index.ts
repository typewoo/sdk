import { schemaRegistry } from '../../schema-registry.js';
import { CartExtensionsRequestSchema } from './cart.extensions.request.js';
import { CartExtensionsResponseSchema } from './cart.extensions.response.js';

schemaRegistry.add(CartExtensionsRequestSchema, {
  surface: 'store',
  route: '/wc/store/v1/cart/extensions',
  kind: 'request',
  method: 'POST',
});

export * from './cart.extensions.request.js';
export * from './cart.extensions.response.js';
