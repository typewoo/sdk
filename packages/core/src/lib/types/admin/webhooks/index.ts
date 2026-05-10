import { schemaRegistry } from '../../schema-registry.js';
import { AdminWebhookSchema } from './webhook.schema.js';
import { AdminWebhookCreateRequestSchema } from './webhook.create.schema.js';
import { AdminWebhookUpdateRequestSchema } from './webhook.update.schema.js';
import { AdminWebhookQueryParamsSchema } from './webhook.query.schema.js';

schemaRegistry.add(AdminWebhookSchema, {
  surface: 'admin',
  route: '/wc/v3/webhooks',
  kind: 'response',
  // WC JSON Schema declares these as non-nullable, but the live API returns
  // null for webhooks that have never been triggered/modified.
  knownNullable: ['date_modified', 'date_modified_gmt'],
});
schemaRegistry.add(AdminWebhookCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/webhooks',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminWebhookUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/webhooks/(?P<id>[\\d]+)',
  kind: 'request',
  method: 'PATCH',
});
schemaRegistry.add(AdminWebhookQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/webhooks',
  kind: 'query',
  method: 'GET',
});

export * from './webhook.schema.js';
export * from './webhook.create.schema.js';
export * from './webhook.update.schema.js';
export * from './webhook.query.schema.js';
