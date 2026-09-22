import { PARTIAL_ADDRESS_SCHEMA_BUGS } from '../known-schema-bugs.js';
import { schemaRegistry } from '../../schema-registry.js';
import { OrderResponseSchema } from './order.schema.js';
import {
  OrderQueryParamsSchema,
  OrderRequestSchema,
} from './order.query.schema.js';

schemaRegistry.add(OrderResponseSchema, {
  surface: 'store',
  route: '/wc/store/v1/order/(?P<id>[\\d]+)',
  kind: 'response',
});
schemaRegistry.add(OrderQueryParamsSchema, {
  surface: 'store',
  route: '/wc/store/v1/order/(?P<id>[\\d]+)',
  kind: 'query',
  method: 'GET',
  // The order key and billing email are read from the query by the route's
  // permission check, not declared in its schema.
  undocumented: ['key', 'billing_email'],
});
schemaRegistry.add(OrderRequestSchema, {
  surface: 'store',
  route: '/wc/store/v1/checkout/(?P<id>[\\d]+)',
  kind: 'request',
  method: 'POST',
  openEnums: ['payment_method'],
  knownSchemaBugs: [
    ...PARTIAL_ADDRESS_SCHEMA_BUGS,
    {
      field: 'extensions',
      reason:
        'WC fills an empty order-attribution bucket server-side when extensions is omitted; the SDK should not send it by default.',
      driftKinds: ['default-mismatch'],
    },
  ],
  // The order key and billing email are read from the request by the
  // route's permission check, not declared in its schema.
  undocumented: ['key', 'billing_email'],
});

export * from './order.billing.schema.js';
export * from './order.coupon.schema.js';
export * from './order.query.schema.js';
export * from './order.schema.js';
export * from './order.shipping.schema.js';
export * from './order.total.schema.js';
