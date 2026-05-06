import { schemaRegistry } from '../../schema-registry.js';
import { ProductReviewRequestSchema } from './product.review.query.schema.js';
import { ProductReviewResponseSchema } from './product.review.schema.js';

schemaRegistry.add(ProductReviewResponseSchema, {
  surface: 'store',
  route: '/wc/store/v1/products/reviews',
  kind: 'response',
});
schemaRegistry.add(ProductReviewRequestSchema, {
  surface: 'store',
  route: '/wc/store/v1/products/reviews',
  kind: 'query',
  method: 'GET',
});

export * from './product.review.query.schema.js';
export * from './product.review.schema.js';
