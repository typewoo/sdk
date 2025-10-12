import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * Common meta data structure used across multiple WooCommerce resources
 */
export const AdminMetaData = z.object({
  /**
   * Meta ID.
   */
  id: z.number(),
  /**
   * Meta key.
   */
  key: z.string(),
  /**
   * Meta value.
   */
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.record(z.string(), z.unknown()),
    z.null(),
  ]),
});

export type AdminMetaDataType = z.infer<typeof AdminMetaData>;
export class ApiAdminMetaData extends createZodDto(AdminMetaData) {}

/**
 * Common address structure for billing and shipping
 */
export const AdminAddress = z.object({
  first_name: z.string(),
  last_name: z.string(),
  company: z.string(),
  address_1: z.string(),
  address_2: z.string(),
  city: z.string(),
  state: z.string(),
  postcode: z.string(),
  country: z.string(),
  email: z.string().optional(), // Only present on billing
  phone: z.string().optional(),
});

export type AdminAddressType = z.infer<typeof AdminAddress>;
export class ApiAdminAddress extends createZodDto(AdminAddress) {}

/**
 * Common links structure
 */
export const AdminLinks = z.object({
  self: z.array(z.object({ href: z.string() })),
  collection: z.array(z.object({ href: z.string() })).optional(),
});

export type AdminLinksType = z.infer<typeof AdminLinks>;
export class ApiAdminLinks extends createZodDto(AdminLinks) {}

/**
 * Common image structure
 */
export const AdminImage = z.object({
  id: z.number(),
  date_created: z.string(),
  date_created_gmt: z.string(),
  date_modified: z.string(),
  date_modified_gmt: z.string(),
  src: z.string(),
  name: z.string(),
  alt: z.string(),
});

export type AdminImageType = z.infer<typeof AdminImage>;
export class ApiAdminImage extends createZodDto(AdminImage) {}

/**
 * Common dimension structure
 */
export const AdminDimensions = z.object({
  length: z.string(),
  width: z.string(),
  height: z.string(),
});

export type AdminDimensionsType = z.infer<typeof AdminDimensions>;
export class ApiAdminDimensions extends createZodDto(AdminDimensions) {}

/**
 * Common tax structure
 */
export const AdminTaxLine = z.object({
  id: z.number(),
  total: z.string(),
  subtotal: z.string(),
});

export type AdminTaxLineType = z.infer<typeof AdminTaxLine>;
export class ApiAdminTaxLine extends createZodDto(AdminTaxLine) {}

/**
 * Common status values
 */
export type AdminStatus = 'draft' | 'pending' | 'private' | 'publish';

/**
 * Order status values
 */
export type AdminOrderStatus =
  | 'pending'
  | 'processing'
  | 'on-hold'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'failed'
  | 'checkout-draft';

/**
 * Product type values
 */
export type AdminProductType = 'simple' | 'grouped' | 'external' | 'variable';

/**
 * Stock status values
 */
export type AdminStockStatus = 'instock' | 'outofstock' | 'onbackorder';

/**
 * Backorder values
 */
export type AdminBackorderStatus = 'no' | 'notify' | 'yes';

/**
 * Tax status values
 */
export type AdminTaxStatus = 'taxable' | 'shipping' | 'none';

/**
 * Catalog visibility values
 */
export type AdminCatalogVisibility =
  | 'visible'
  | 'catalog'
  | 'search'
  | 'hidden';
