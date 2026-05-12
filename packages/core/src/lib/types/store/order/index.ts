import { z } from 'zod';
import { schemaRegistry } from '../../schema-registry.js';
import { OrderResponseSchema } from './order.schema.js';

const OrderGetQuerySchema = z.object({
  context: z.string().optional(),
});

schemaRegistry.add(OrderResponseSchema, {
  surface: 'store',
  route: '/wc/store/v1/order/(?P<id>[\\d]+)',
  kind: 'response',
});
schemaRegistry.add(OrderGetQuerySchema, {
  surface: 'store',
  route: '/wc/store/v1/order/(?P<id>[\\d]+)',
  kind: 'query',
  method: 'GET',
});

export * from './order.billing.schema.js';
export * from './order.coupon.schema.js';
export * from './order.query.schema.js';
export * from './order.schema.js';
export * from './order.shipping.schema.js';
export * from './order.total.schema.js';
