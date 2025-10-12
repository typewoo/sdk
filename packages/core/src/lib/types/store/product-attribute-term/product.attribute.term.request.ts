import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ProductAttributeTermRequestSchema = z.object({
  /**
   * The ID of the attribute to retrieve terms for.
   */
  id: z.number(),
  /**
   * Order ascending or descending.
   * Allowed values: `asc`, `desc`
   */
  order: z.enum(['asc', 'desc']),
  /**
   * Sort collection by object attribute.
   * Allowed values: `id`, `name`, `name_num`, `slug`, `count`, `menu_order`.
   */
  orderby: z.enum(['id', 'name', 'name_num', 'slug', 'count', 'menu_order']),
});

export type ProductAttributeTermRequest = z.infer<
  typeof ProductAttributeTermRequestSchema
>;
export class ApiProductAttributeTermRequest extends createZodDto(
  ProductAttributeTermRequestSchema
) {}
