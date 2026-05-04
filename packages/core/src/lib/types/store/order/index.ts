import { z } from 'zod';
import { schemaRegistry } from '../../schema-registry.js';
import { OrderResponseSchema } from './order.response.js';

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

export * from './order.billing.response.js';
export * from './order.coupon.response.js';
export * from './order.request.js';
export * from './order.response.js';
export * from './order.shipping.response.js';
export * from './order.total.response.js';
