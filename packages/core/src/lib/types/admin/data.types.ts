import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AdminCountrySchema = z.object({
  code: z.string(),
  name: z.string(),
  states: z.array(
    z.object({
      code: z.string(),
      name: z.string(),
    })
  ),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminCountry = z.infer<typeof AdminCountrySchema>;
export class ApiAdminCountry extends createZodDto(AdminCountrySchema) {}

export const AdminCurrencySchema = z.object({
  code: z.string(),
  name: z.string(),
  symbol: z.string(),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminCurrency = z.infer<typeof AdminCurrencySchema>;
export class ApiAdminCurrency extends createZodDto(AdminCurrencySchema) {}

export const AdminContinentSchema = z.object({
  code: z.string(),
  name: z.string(),
  countries: z.array(
    z.object({
      code: z.string(),
      name: z.string(),
      currency_code: z.string(),
      currency_pos: z.string(),
      decimal_sep: z.string(),
      dimension_unit: z.string(),
      num_decimals: z.number(),
      thousand_sep: z.string(),
      weight_unit: z.string(),
      states: z.array(
        z.object({
          code: z.string(),
          name: z.string(),
        })
      ),
    })
  ),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminContinent = z.infer<typeof AdminContinentSchema>;
export class ApiAdminContinent extends createZodDto(AdminContinentSchema) {}

export const AdminDataQueryParamsSchema = z.object({
  context: z.literal('view').optional(),
});

export type AdminDataQueryParams = z.infer<typeof AdminDataQueryParamsSchema>;
export class ApiAdminDataQueryParams extends createZodDto(
  AdminDataQueryParamsSchema
) {}
