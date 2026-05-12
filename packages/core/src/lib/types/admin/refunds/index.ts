import { schemaRegistry } from '../../schema-registry.js';
import { AdminRefundSchema } from './refund.schema.js';
import { AdminRefundCreateRequestSchema } from './refund.create.schema.js';
import { AdminRefundQueryParamsSchema } from './refund.query.schema.js';

schemaRegistry.add(AdminRefundSchema, {
  surface: 'admin',
  route: '/wc/v3/orders/(?P<order_id>[\\d]+)/refunds',
  kind: 'response',
});
schemaRegistry.add(AdminRefundCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/orders/(?P<order_id>[\\d]+)/refunds',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminRefundQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/orders/(?P<order_id>[\\d]+)/refunds',
  kind: 'query',
  method: 'GET',
});

export * from './refund.js';
export * from './refund.schema.js';
export * from './refund.create.schema.js';
export * from './refund.query.schema.js';
