import { schemaRegistry } from '../../schema-registry.js';
import { AdminPaymentGatewaySchema } from './payment-gateway.schema.js';
import { AdminPaymentGatewayUpdateRequestSchema } from './payment-gateway.update.schema.js';
import { AdminPaymentGatewayQueryParamsSchema } from './payment-gateway.query.schema.js';

schemaRegistry.add(AdminPaymentGatewaySchema, {
  surface: 'admin',
  route: '/wc/v3/payment_gateways',
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
schemaRegistry.add(AdminPaymentGatewayUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/payment_gateways/(?P<id>[\\w-]+)',
  kind: 'request',
  method: 'PUT',
  knownSchemaBugs: [
    {
      field: 'settings',
      driftKinds: ['type-mismatch', 'missing-in-sdk'],
      reason:
        "The update handler takes settings as a map of setting ID to value; the published schema describes one setting's response shape.",
    },
  ],
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
