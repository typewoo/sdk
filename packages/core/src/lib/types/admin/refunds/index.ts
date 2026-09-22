import { schemaRegistry } from '../../schema-registry.js';
import { AdminRefundSchema } from './refund.schema.js';
import { AdminRefundCreateRequestSchema } from './refund.create.schema.js';
import { AdminRefundQueryParamsSchema } from './refund.query.schema.js';

schemaRegistry.add(AdminRefundSchema, {
  surface: 'admin',
  route: '/wc/v3/orders/(?P<order_id>[\\d]+)/refunds',
  kind: 'response',
  alsoAt: [
    '/wc/v3/orders/(?P<order_id>[\\d]+)/refunds/(?P<id>[\\d]+)',
    '/wc/v3/refunds',
  ],
  // WC stores the rate percent on tax items and returns it, but its schema
  // omits the field.
  undocumented: ['tax_lines[].rate_percent'],
  // WC's v3 schema adds these refund inputs to the response items, but the
  // live API never returns them.
  knownSchemaBugs: [
    ...['line_items[].refund_total', 'line_items[].taxes[].refund_total'].map(
      (field) => ({
        field,
        reason: 'Refund-create input; not returned in refund responses.',
        driftKinds: ['missing-in-sdk'],
      })
    ),
    // One schema serves both the order-scoped routes and `/refunds`; only
    // the latter returns (and documents) the parent order ID.
    {
      field: 'parent_id',
      reason: 'Only returned by /wc/v3/refunds; optional in the SDK.',
      driftKinds: ['extra-in-sdk'],
    },
  ],
});
schemaRegistry.add(AdminRefundCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/orders/(?P<order_id>[\\d]+)/refunds',
  kind: 'request',
  method: 'POST',
  // WC marks line_items read-only, but the v3 controller passes them to
  // wc_create_refund() to refund individual items.
  undocumented: ['line_items'],
});
schemaRegistry.add(AdminRefundQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/orders/(?P<order_id>[\\d]+)/refunds',
  kind: 'query',
  method: 'GET',
  alsoAt: ['/wc/v3/refunds'],
});

export * from './refund.js';
export * from './refund.schema.js';
export * from './refund.create.schema.js';
export * from './refund.query.schema.js';
