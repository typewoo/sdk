import { schemaRegistry } from '../../schema-registry.js';
import { CartExtensionsRequestSchema } from './cart.extensions.create.schema.js';
import { CartExtensionsResponseSchema } from './cart.extensions.schema.js';

schemaRegistry.add(CartExtensionsRequestSchema, {
  surface: 'store',
  route: '/wc/store/v1/cart/extensions',
  kind: 'request',
  method: 'POST',
});

export * from './cart.extensions.create.schema.js';
export * from './cart.extensions.schema.js';
