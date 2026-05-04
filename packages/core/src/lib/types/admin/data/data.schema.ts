import { z } from 'zod';

export const AdminCountrySchema = z.looseObject({
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

export const AdminCurrencySchema = z.looseObject({
  code: z.string(),
  name: z.string(),
  symbol: z.string(),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminCurrency = z.infer<typeof AdminCurrencySchema>;

export const AdminContinentSchema = z.looseObject({
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

export const AdminDataQueryParamsSchema = z.looseObject({
  context: z.literal('view').optional(),
});

export type AdminDataQueryParams = z.infer<typeof AdminDataQueryParamsSchema>;
