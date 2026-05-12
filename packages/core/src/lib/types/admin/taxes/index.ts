import { schemaRegistry } from '../../schema-registry.js';
import { AdminTaxSchema } from './tax.schema.js';
import { AdminTaxCreateRequestSchema } from './tax.create.schema.js';
import { AdminTaxUpdateRequestSchema } from './tax.update.schema.js';
import { AdminTaxQueryParamsSchema } from './tax.query.schema.js';
import { AdminTaxClassSchema } from './tax-class.schema.js';
import { AdminTaxClassCreateRequestSchema } from './tax-class.create.schema.js';
import { AdminTaxClassQueryParamsSchema } from './tax-class.query.schema.js';

schemaRegistry.add(AdminTaxSchema, {
  surface: 'admin',
  route: '/wc/v3/taxes',
  kind: 'response',
});
schemaRegistry.add(AdminTaxCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/taxes',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminTaxUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/taxes/(?P<id>[\\d]+)',
  kind: 'request',
  method: 'PATCH',
});
schemaRegistry.add(AdminTaxQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/taxes',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(AdminTaxClassSchema, {
  surface: 'admin',
  route: '/wc/v3/taxes/classes',
  kind: 'response',
});
schemaRegistry.add(AdminTaxClassCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/taxes/classes',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminTaxClassQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/taxes/classes',
  kind: 'query',
  method: 'GET',
});

export * from './tax.schema.js';
export * from './tax.create.schema.js';
export * from './tax.update.schema.js';
export * from './tax.query.schema.js';
export * from './tax-class.schema.js';
export * from './tax-class.create.schema.js';
export * from './tax-class.query.schema.js';
