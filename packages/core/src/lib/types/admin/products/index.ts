import { schemaRegistry } from '../../schema-registry.js';
import {
  AdminProductSchema,
  AdminProductVariationSchema,
} from './product.schema.js';
import {
  AdminProductVariationCreateRequestSchema,
  AdminProductVariationUpdateRequestSchema,
  AdminProductVariationQueryParamsSchema,
  AdminProductVariationGenerateRequestSchema,
} from './product-variation.schema.js';
import { AdminProductDuplicateRequestSchema } from './product-duplicate.schema.js';
import { AdminProductCreateRequestSchema } from './product.create.schema.js';
import { AdminProductUpdateRequestSchema } from './product.update.schema.js';
import {
  AdminProductQueryParamsSchema,
  AdminProductCustomFieldNameQueryParamsSchema,
} from './product.query.schema.js';

// WC documents a string, but get_shipping_class_id() returns an int.
const SHIPPING_CLASS_ID_BUG = {
  field: 'shipping_class_id',
  reason:
    'WC documents a string; the live API returns an integer (0 when unset).',
};

schemaRegistry.add(AdminProductSchema, {
  surface: 'admin',
  route: '/wc/v3/products',
  kind: 'response',
  // WC JSON Schema declares these as non-nullable, but the live API returns
  // null for non-sale products (date_on_sale_*) and products without stock
  // management enabled (stock_quantity).
  knownNullable: [
    'date_on_sale_from',
    'date_on_sale_from_gmt',
    'date_on_sale_to',
    'date_on_sale_to_gmt',
    'stock_quantity',
  ],
  knownSchemaBugs: [SHIPPING_CLASS_ID_BUG],
});
schemaRegistry.add(AdminProductCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminProductUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products/(?P<id>[\\d]+)',
  kind: 'request',
  method: 'PATCH',
});
schemaRegistry.add(AdminProductQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/products',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(AdminProductVariationSchema, {
  surface: 'admin',
  route: '/wc/v3/products/(?P<product_id>[\\d]+)/variations',
  kind: 'response',
  alsoAt: ['/wc/v3/products/(?P<product_id>[\\d]+)/variations/(?P<id>[\\d]+)'],
  // Live API returns null for unset sale dates, untracked stock and
  // variations without their own image.
  knownNullable: [
    'date_on_sale_from',
    'date_on_sale_from_gmt',
    'date_on_sale_to',
    'date_on_sale_to_gmt',
    'stock_quantity',
    'image',
  ],
  // Returned by the live API but missing from WC's variation schema.
  undocumented: ['name', 'date_created_gmt', 'date_modified_gmt'],
  knownSchemaBugs: [
    SHIPPING_CLASS_ID_BUG,
    {
      field: 'status',
      reason:
        'WC documents get_post_statuses(), but a variation takes any post status: "trash" when its product is trashed, "future" when scheduled.',
      driftKinds: ['enum-drift'],
    },
  ],
});
schemaRegistry.add(AdminProductVariationCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products/(?P<product_id>[\\d]+)/variations',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminProductVariationUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products/(?P<product_id>[\\d]+)/variations/(?P<id>[\\d]+)',
  kind: 'request',
  method: 'PUT',
});
schemaRegistry.add(AdminProductVariationQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/products/(?P<product_id>[\\d]+)/variations',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(AdminProductVariationGenerateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products/(?P<product_id>[\\d]+)/variations/generate',
  kind: 'request',
  method: 'POST',
  // WC publishes the variation create args as this route's top-level args,
  // but `generate()` only reads `delete`, `default_values` and `meta_data`
  // (the rest go inside `default_values`).
  knownSchemaBugs: Object.keys(AdminProductVariationCreateRequestSchema.shape)
    .filter((field) => field !== 'meta_data')
    // `field` also covers `field.x`; add `field[]` for array element fields.
    .flatMap((field) => [field, `${field}[]`])
    .map((field) => ({
      field,
      reason:
        'Variation args listed at the top level; generate() only reads them from default_values.',
      driftKinds: ['missing-in-sdk'],
    })),
});
// Only the request is registered for /duplicate: WC publishes the REST
// product schema as its response, but the handler returns the raw
// WC_Product::get_data() array (see AdminProductDuplicateResponseSchema).
schemaRegistry.add(AdminProductDuplicateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/products/(?P<id>[\\d]+)/duplicate',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminProductCustomFieldNameQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/products/custom-fields/names',
  kind: 'query',
  method: 'GET',
});

export * from './product.schema.js';
export * from './product-variation.schema.js';
export * from './product-duplicate.schema.js';
export * from './product.create.schema.js';
export * from './product.update.schema.js';
export * from './product.query.schema.js';
