import { z } from 'zod';

export const ProductEmbeddedAttributeResponseSchema = z.looseObject({
  id: z.number(),
  name: z.string(),
  taxonomy: z.string(),
  has_variations: z.boolean(),
  terms: z.array(
    z.looseObject({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
      default: z.boolean().describe('If this is a default attribute'),
    })
  ),
});

export type ProductEmbeddedAttributeResponse = z.infer<
  typeof ProductEmbeddedAttributeResponseSchema
>;

export const ProductEmbeddedVariationResponseSchema = z.looseObject({
  id: z.number(),
  attributes: z.array(
    z.looseObject({
      name: z.string(),
      value: z.string(),
    })
  ),
});

export type ProductEmbeddedVariationResponse = z.infer<
  typeof ProductEmbeddedVariationResponseSchema
>;
