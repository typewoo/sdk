import { schemaRegistry } from '../../schema-registry.js';
import { AdminShippingZoneSchema } from './shipping-zone.schema.js';
import { AdminShippingZoneCreateRequestSchema } from './shipping-zone.create.schema.js';
import { AdminShippingZoneUpdateRequestSchema } from './shipping-zone.update.schema.js';
import { AdminShippingZoneQueryParamsSchema } from './shipping-zone.query.schema.js';
import { AdminShippingZoneMethodSchema } from './shipping-zone-method.schema.js';
import { AdminShippingZoneMethodCreateRequestSchema } from './shipping-zone-method.create.schema.js';
import { AdminShippingZoneMethodUpdateRequestSchema } from './shipping-zone-method.update.schema.js';
import { AdminShippingZoneMethodQueryParamsSchema } from './shipping-zone-method.query.schema.js';

schemaRegistry.add(AdminShippingZoneSchema, {
  surface: 'admin',
  route: '/wc/v3/shipping/zones',
  kind: 'response',
});
schemaRegistry.add(AdminShippingZoneCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/shipping/zones',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminShippingZoneUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/shipping/zones/(?P<id>[\\d]+)',
  kind: 'request',
  method: 'PATCH',
});
schemaRegistry.add(AdminShippingZoneQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/shipping/zones',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(AdminShippingZoneMethodSchema, {
  surface: 'admin',
  route: '/wc/v3/shipping/zones/(?P<zone_id>[\\d]+)/methods',
  kind: 'response',
});
schemaRegistry.add(AdminShippingZoneMethodCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/shipping/zones/(?P<zone_id>[\\d]+)/methods',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminShippingZoneMethodUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/shipping/zones/(?P<zone_id>[\\d]+)/methods',
  kind: 'request',
  method: 'PUT',
});
schemaRegistry.add(AdminShippingZoneMethodQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/shipping/zones/(?P<zone_id>[\\d]+)/methods',
  kind: 'query',
  method: 'GET',
});

export * from './shipping-zone.schema.js';
export * from './shipping-zone.create.schema.js';
export * from './shipping-zone.update.schema.js';
export * from './shipping-zone.query.schema.js';
export * from './shipping-zone-location.schema.js';
export * from './shipping-zone-method.schema.js';
export * from './shipping-zone-method.create.schema.js';
export * from './shipping-zone-method.update.schema.js';
export * from './shipping-zone-method.query.schema.js';
