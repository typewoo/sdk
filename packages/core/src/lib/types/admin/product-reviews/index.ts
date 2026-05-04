import { schemaRegistry } from '../../schema-registry.js';
import { AdminProductReviewSchema } from './product-review.schema.js';
import { AdminProductReviewCreateRequestSchema } from './product-review.create.schema.js';
import { AdminProductReviewUpdateRequestSchema } from './product-review.update.schema.js';
import { AdminProductReviewQueryParamsSchema } from './product-review.query.schema.js';

schemaRegistry.add(AdminProductReviewSchema, {
  surface: 'admin',
  route: '/wc/v3/products/reviews',
  kind: 'response',
});
schemaRegistry.add(AdminProductReviewCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products/reviews',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminProductReviewUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products/reviews/(?P<id>[\\d]+)',
  kind: 'request',
  method: 'PATCH',
});
schemaRegistry.add(AdminProductReviewQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/products/reviews',
  kind: 'query',
  method: 'GET',
});

export * from './product-review.schema.js';
export * from './product-review.create.schema.js';
export * from './product-review.update.schema.js';
export * from './product-review.query.schema.js';
