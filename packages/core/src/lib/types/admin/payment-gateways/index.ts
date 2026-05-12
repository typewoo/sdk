import { schemaRegistry } from '../../schema-registry.js';
import { AdminPaymentGatewaySchema } from './payment-gateway.schema.js';
import { AdminPaymentGatewayUpdateRequestSchema } from './payment-gateway.update.schema.js';
import { AdminPaymentGatewayQueryParamsSchema } from './payment-gateway.query.schema.js';

schemaRegistry.add(AdminPaymentGatewaySchema, {
  surface: 'admin',
  route: '/wc/v3/payment_gateways',
  kind: 'response',
});
schemaRegistry.add(AdminPaymentGatewayUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/payment_gateways',
  kind: 'request',
  method: 'PUT',
});
schemaRegistry.add(AdminPaymentGatewayQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/payment_gateways',
  kind: 'query',
  method: 'GET',
});

export * from './payment-gateway.schema.js';
export * from './payment-gateway.update.schema.js';
export * from './payment-gateway.query.schema.js';
