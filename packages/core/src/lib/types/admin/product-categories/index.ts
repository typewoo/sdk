import { schemaRegistry } from '../../schema-registry.js';
import { AdminTaxonomyCategorySchema } from './product-category.schema.js';
import { AdminTaxonomyCategoryCreateRequestSchema } from './product-category.create.schema.js';
import { AdminTaxonomyCategoryUpdateRequestSchema } from './product-category.update.schema.js';
import { AdminTaxonomyCategoryQueryParamsSchema } from './product-category.query.schema.js';

schemaRegistry.add(AdminTaxonomyCategorySchema, {
  surface: 'admin',
  route: '/wc/v3/products/categories',
  kind: 'response',
});
schemaRegistry.add(AdminTaxonomyCategoryCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products/categories',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminTaxonomyCategoryUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products/categories/(?P<id>[\\d]+)',
  kind: 'request',
  method: 'PATCH',
});
schemaRegistry.add(AdminTaxonomyCategoryQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/products/categories',
  kind: 'query',
  method: 'GET',
});

export * from './product-category.js';
export * from './product-category.schema.js';
export * from './product-category.create.schema.js';
export * from './product-category.update.schema.js';
export * from './product-category.query.schema.js';
