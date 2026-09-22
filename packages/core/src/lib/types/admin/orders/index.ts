import { schemaRegistry } from '../../schema-registry.js';
import { AdminOrderSchema } from './order.schema.js';
import { AdminOrderCreateRequestSchema } from './order.create.schema.js';
import { AdminOrderUpdateRequestSchema } from './order.update.schema.js';
import { AdminOrderQueryParamsSchema } from './order.query.schema.js';
import {
  AdminOrderNoteSchema,
  AdminOrderNoteCreateRequestSchema,
} from './order-note.schema.js';
import {
  AdminOrderActionResultSchema,
  AdminOrderEmailTemplateSchema,
  AdminOrderReceiptRequestSchema,
  AdminOrderReceiptSchema,
  AdminOrderSendDetailsRequestSchema,
  AdminOrderSendEmailRequestSchema,
  AdminOrderStatusInfoSchema,
} from './order-actions.schema.js';

/** Formatted meta fields WC adds to every order item type. */
const ITEM_META_DISPLAY_FIELDS = [
  'line_items',
  'tax_lines',
  'shipping_lines',
  'fee_lines',
  'coupon_lines',
].flatMap((line) => [
  `${line}[].meta_data[].display_key`,
  `${line}[].meta_data[].display_value`,
]);

schemaRegistry.add(AdminOrderSchema, {
  surface: 'admin',
  route: '/wc/v3/orders',
  kind: 'response',
  // WC JSON Schema declares these as non-nullable, but the live API returns
  // null for orders that have not yet been paid or completed.
  knownNullable: [
    'date_completed',
    'date_completed_gmt',
    'date_paid',
    'date_paid_gmt',
    // Null when the line item's product no longer exists.
    'line_items[].sku',
    'line_items[].global_unique_id',
    // Null unless the product is a variation.
    'line_items[].parent_name',
    // Falls back to the raw meta value, which can be null.
    'line_items[].meta_data[].display_value',
  ],
  undocumented: [
    // WC stores the rate percent on tax items and returns it, but its schema
    // omits the field.
    'tax_lines[].rate_percent',
    // WC adds display_key/display_value to every order item's meta, but only
    // documents them on line items.
    ...ITEM_META_DISPLAY_FIELDS.filter((f) => !f.startsWith('line_items')),
  ],
});

// WC lists display_key/display_value as writable line item meta, but only
// key, value and id are used when saving.
const LINE_ITEM_META_DISPLAY_BUGS = [
  'line_items[].meta_data[].display_key',
  'line_items[].meta_data[].display_value',
].map((field) => ({
  field,
  reason: 'Read-only formatted meta; WC ignores it when saving line items.',
  driftKinds: ['missing-in-sdk'],
}));

schemaRegistry.add(AdminOrderCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/orders',
  kind: 'request',
  method: 'POST',
  knownSchemaBugs: LINE_ITEM_META_DISPLAY_BUGS,
  // Echoed back from responses, where it is null for non-variations.
  knownNullable: ['line_items[].parent_name'],
});
schemaRegistry.add(AdminOrderUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/orders/(?P<id>[\\d]+)',
  kind: 'request',
  method: 'PATCH',
  knownSchemaBugs: LINE_ITEM_META_DISPLAY_BUGS,
  // Echoed back from responses, where it is null for non-variations.
  knownNullable: ['line_items[].parent_name'],
});
schemaRegistry.add(AdminOrderQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/orders',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(AdminOrderNoteSchema, {
  surface: 'admin',
  route: '/wc/v3/orders/(?P<order_id>[\\d]+)/notes',
  kind: 'response',
  alsoAt: ['/wc/v3/orders/(?P<order_id>[\\d]+)/notes/(?P<id>[\\d]+)'],
});
schemaRegistry.add(AdminOrderNoteCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/orders/(?P<order_id>[\\d]+)/notes',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminOrderEmailTemplateSchema, {
  surface: 'admin',
  route: '/wc/v3/orders/(?P<id>[\\d]+)/actions/email_templates',
  kind: 'response',
  // WC's enum lists every email the mailer has registered, which depends on
  // the store's extensions.
  openEnums: ['id'],
});
schemaRegistry.add(AdminOrderSendEmailRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/orders/(?P<id>[\\d]+)/actions/send_email',
  kind: 'request',
  method: 'POST',
  // Same mailer-dependent enum as the email_templates response.
  openEnums: ['template_id'],
});
schemaRegistry.add(AdminOrderSendDetailsRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/orders/(?P<id>[\\d]+)/actions/send_order_details',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminOrderActionResultSchema, {
  surface: 'admin',
  route: '/wc/v3/orders/(?P<id>[\\d]+)/actions/send_email',
  kind: 'response',
  alsoAt: ['/wc/v3/orders/(?P<id>[\\d]+)/actions/send_order_details'],
});
schemaRegistry.add(AdminOrderReceiptRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/orders/(?P<id>[\\d]+)/receipt',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminOrderReceiptSchema, {
  surface: 'admin',
  route: '/wc/v3/orders/(?P<id>[\\d]+)/receipt',
  kind: 'response',
  noUpstreamSchema:
    'WC registers the receipt route without a response schema; it returns { receipt_url, expiration_date }.',
});
schemaRegistry.add(AdminOrderStatusInfoSchema, {
  surface: 'admin',
  route: '/wc/v3/orders/statuses',
  kind: 'response',
});

export * from './order.schema.js';
export * from './order.create.schema.js';
export * from './order.update.schema.js';
export * from './order.query.schema.js';
export * from './order-note.schema.js';
export * from './order-actions.schema.js';
