import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ProductPriceResponseSchema = z.object({
  currency_code: z.string(),
  currency_symbol: z.string(),
  currency_minor_unit: z.number(),
  currency_decimal_separator: z.string(),
  currency_thousand_separator: z.string(),
  currency_prefix: z.string(),
  currency_suffix: z.string(),
  price: z.string(),
  regular_price: z.string(),
  sale_price: z.string(),
  price_range: z.unknown(),
});

export type ProductPriceResponse = z.infer<typeof ProductPriceResponseSchema>;
export class ApiProductPriceResponse extends createZodDto(
  ProductPriceResponseSchema
) {}
