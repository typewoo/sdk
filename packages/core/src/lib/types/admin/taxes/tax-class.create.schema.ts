import { z } from 'zod';

/**
 * Tax class request parameters for POST /taxes/classes (create). WooCommerce
 * does not expose a PUT endpoint for tax classes — they're create/delete only.
 */
export const AdminTaxClassCreateRequestSchema = z.looseObject({
  name: z.string().describe('Tax class name.'),
});

export type AdminTaxClassCreateRequest = z.input<
  typeof AdminTaxClassCreateRequestSchema
>;
