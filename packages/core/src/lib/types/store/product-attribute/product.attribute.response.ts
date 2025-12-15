import { z } from 'zod';

export const ProductAttributeResponseSchema = z.looseObject({
  id: z.number(),
  name: z.string(),
  taxonomy: z.string(),
  type: z.string(),
  order: z.string(),
  has_archives: z.boolean(),
});

export type ProductAttributeResponse = z.infer<
  typeof ProductAttributeResponseSchema
>;
