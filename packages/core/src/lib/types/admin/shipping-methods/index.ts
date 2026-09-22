import { schemaRegistry } from '../../schema-registry.js';
import { AdminShippingMethodSchema } from './shipping-method.schema.js';
import { AdminShippingMethodQueryParamsSchema } from './shipping-method.query.schema.js';

schemaRegistry.add(AdminShippingMethodSchema, {
  surface: 'admin',
  route: '/wc/v3/shipping_methods',
  kind: 'response',
  alsoAt: ['/wc/v3/shipping_methods/(?P<id>[\\w-]+)'],
});
schemaRegistry.add(AdminShippingMethodQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/shipping_methods',
  kind: 'query',
  method: 'GET',
});

export * from './shipping-method.schema.js';
export * from './shipping-method.query.schema.js';
