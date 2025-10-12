import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ProductAttributeResponseSchema = z.object({
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
export class ApiProductAttributeResponse extends createZodDto(
  ProductAttributeResponseSchema
) {}
