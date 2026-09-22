import { z } from 'zod';
import { schemaRegistry } from '../schema-registry.js';

/**
 * Response body shared by every admin `POST /wc/v3/<resource>/batch`
 * endpoint (products, variations, attributes, terms, categories, tags,
 * brands, reviews, shipping classes, taxes, webhooks, customers, orders,
 * settings). Each array holds the resulting resource for that operation, or
 * an `{ id, error }` object when that item failed.
 */
export const AdminBatchResponseSchema = z.looseObject({
  create: z
    .array(z.looseObject({}))
    .optional()
    .describe('List of created resources.'),
  update: z
    .array(z.looseObject({}))
    .optional()
    .describe('List of updated resources.'),
  delete: z
    .array(z.looseObject({}))
    .optional()
    .describe('List of delete resources.'),
});

export type AdminBatchResponse = z.infer<typeof AdminBatchResponseSchema>;

// Only the response is registered: WP publishes the single-item args as the
// batch route's request args, not the real `{ create, update, delete }` body.
schemaRegistry.add(AdminBatchResponseSchema, {
  surface: 'admin',
  route: '/wc/v3/products/batch',
  kind: 'response',
  // WC reuses the batch request schema as the response schema, so it
  // declares `delete` as a list of IDs. The live API returns the deleted
  // resources (or `{ id, error }`), e.g. POST /products/tags/batch
  // { delete: [49] } → { delete: [{ id: 49, name: …, slug: … }] }.
  knownSchemaBugs: [
    {
      field: 'delete',
      reason:
        'WC declares the batch request shape (integer IDs); the live response holds the deleted resource objects.',
    },
  ],
  alsoAt: [
    '/wc/v3/products/(?P<product_id>[\\d]+)/variations/batch',
    '/wc/v3/products/attributes/batch',
    '/wc/v3/products/attributes/(?P<attribute_id>[\\d]+)/terms/batch',
    '/wc/v3/products/brands/batch',
    '/wc/v3/products/categories/batch',
    '/wc/v3/products/reviews/batch',
    '/wc/v3/products/shipping_classes/batch',
    '/wc/v3/products/tags/batch',
    '/wc/v3/taxes/batch',
    '/wc/v3/webhooks/batch',
    '/wc/v3/customers/batch',
    '/wc/v3/orders/batch',
    '/wc/v3/settings/batch',
    '/wc/v3/settings/(?P<group_id>[\\w-]+)/batch',
  ],
});
