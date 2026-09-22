import { schemaRegistry } from '../../schema-registry.js';
import { AdminTaxonomyTagSchema } from './product-tag.schema.js';
import { AdminTaxonomyTagCreateRequestSchema } from './product-tag.create.schema.js';
import { AdminTaxonomyTagUpdateRequestSchema } from './product-tag.update.schema.js';
import { AdminTaxonomyTagQueryParamsSchema } from './product-tag.query.schema.js';

schemaRegistry.add(AdminTaxonomyTagSchema, {
  surface: 'admin',
  route: '/wc/v3/products/tags',
  kind: 'response',
});
schemaRegistry.add(AdminTaxonomyTagCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products/tags',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminTaxonomyTagUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products/tags/(?P<id>[\\d]+)',
  kind: 'request',
  method: 'PATCH',
});
schemaRegistry.add(AdminTaxonomyTagQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/products/tags',
  kind: 'query',
  method: 'GET',
});

export * from './product-tag.schema.js';
export * from './product-tag.create.schema.js';
export * from './product-tag.update.schema.js';
export * from './product-tag.query.schema.js';
