import { schemaRegistry } from '../../schema-registry.js';
import { ProductReviewRequestSchema } from './product.review.request.js';
import { ProductReviewResponseSchema } from './product.review.response.js';

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

export * from './product.review.request.js';
export * from './product.review.response.js';
