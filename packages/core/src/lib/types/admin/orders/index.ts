import { schemaRegistry } from '../../schema-registry.js';
import { AdminOrderSchema } from './order.schema.js';
import { AdminOrderCreateRequestSchema } from './order.create.schema.js';
import { AdminOrderUpdateRequestSchema } from './order.update.schema.js';
import { AdminOrderQueryParamsSchema } from './order.query.schema.js';
import {
  AdminOrderNoteSchema,
  AdminOrderNoteCreateRequestSchema,
} from './order-note.schema.js';

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
  ],
});
schemaRegistry.add(AdminOrderCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/orders',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminOrderUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/orders/(?P<id>[\\d]+)',
  kind: 'request',
  method: 'PATCH',
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
});
schemaRegistry.add(AdminOrderNoteCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/orders/(?P<order_id>[\\d]+)/notes',
  kind: 'request',
  method: 'POST',
});

export * from './order.schema.js';
export * from './order.create.schema.js';
export * from './order.update.schema.js';
export * from './order.query.schema.js';
export * from './order-note.schema.js';
export * from './order-actions.schema.js';
