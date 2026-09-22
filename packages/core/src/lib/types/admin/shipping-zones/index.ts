import { schemaRegistry } from '../../schema-registry.js';
import { AdminShippingZoneSchema } from './shipping-zone.schema.js';
import { AdminShippingZoneCreateRequestSchema } from './shipping-zone.create.schema.js';
import { AdminShippingZoneUpdateRequestSchema } from './shipping-zone.update.schema.js';
import { AdminShippingZoneQueryParamsSchema } from './shipping-zone.query.schema.js';
import {
  AdminShippingZoneLocationSchema,
  AdminShippingZoneLocationRequestSchema,
} from './shipping-zone-location.schema.js';
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
schemaRegistry.add(AdminShippingZoneLocationSchema, {
  surface: 'admin',
  route: '/wc/v3/shipping/zones/(?P<id>[\\d]+)/locations',
  kind: 'response',
});
// WC documents a single location, but PUT replaces all of the zone's
// locations and takes an array of them; this schema is one array element.
schemaRegistry.add(AdminShippingZoneLocationRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/shipping/zones/(?P<id>[\\d]+)/locations',
  kind: 'request',
  method: 'PUT',
  knownSchemaBugs: [
    {
      field: 'code',
      reason: 'Required in practice: WC silently skips locations without one.',
      driftKinds: ['optional-mismatch'],
    },
  ],
});
schemaRegistry.add(AdminShippingZoneMethodSchema, {
  surface: 'admin',
  route: '/wc/v3/shipping/zones/(?P<zone_id>[\\d]+)/methods',
  kind: 'response',
  knownSchemaBugs: [
    {
      field: 'settings',
      driftKinds: ['type-mismatch', 'missing-in-sdk'],
      reason:
        "WC's schema describes one setting, but the API returns a map of settings keyed by setting ID.",
    },
  ],
});
schemaRegistry.add(AdminShippingZoneMethodCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/shipping/zones/(?P<zone_id>[\\d]+)/methods',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminShippingZoneMethodUpdateRequestSchema, {
  surface: 'admin',
  route:
    '/wc/v3/shipping/zones/(?P<zone_id>[\\d]+)/methods/(?P<instance_id>[\\d]+)',
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
