import { schemaRegistry } from '../../schema-registry.js';
import { AdminShippingClassSchema } from './shipping-class.schema.js';
import { AdminShippingClassCreateRequestSchema } from './shipping-class.create.schema.js';
import { AdminShippingClassUpdateRequestSchema } from './shipping-class.update.schema.js';
import { AdminShippingClassQueryParamsSchema } from './shipping-class.query.schema.js';

schemaRegistry.add(AdminShippingClassSchema, {
  surface: 'admin',
  route: '/wc/v3/products/shipping_classes',
  kind: 'response',
});
schemaRegistry.add(AdminShippingClassCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products/shipping_classes',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminShippingClassUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products/shipping_classes/(?P<id>[\\d]+)',
  kind: 'request',
  method: 'PATCH',
});
schemaRegistry.add(AdminShippingClassQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/products/shipping_classes',
  kind: 'query',
  method: 'GET',
});

export * from './shipping-class.schema.js';
export * from './shipping-class.create.schema.js';
export * from './shipping-class.update.schema.js';
export * from './shipping-class.query.schema.js';
