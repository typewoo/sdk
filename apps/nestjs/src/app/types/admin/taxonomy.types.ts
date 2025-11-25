import {
  AdminTaxonomyCategorySchema,
  AdminTaxonomyCategoryRequestSchema,
  AdminTaxonomyCategoryQueryParamsSchema,
  AdminTaxonomyTagSchema,
  AdminTaxonomyTagRequestSchema,
  AdminTaxonomyTagQueryParamsSchema,
  AdminShippingClassSchema,
  AdminShippingClassRequestSchema,
  AdminShippingClassQueryParamsSchema,
} from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';
export class ApiAdminTaxonomyCategory extends createZodDto(
  AdminTaxonomyCategorySchema
) {}
export class ApiAdminTaxonomyCategoryRequest extends createZodDto(
  AdminTaxonomyCategoryRequestSchema
) {}
export class ApiAdminTaxonomyCategoryQueryParams extends createZodDto(
  AdminTaxonomyCategoryQueryParamsSchema
) {}
export class ApiAdminTaxonomyTag extends createZodDto(AdminTaxonomyTagSchema) {}
export class ApiAdminTaxonomyTagRequest extends createZodDto(
  AdminTaxonomyTagRequestSchema
) {}
export class ApiAdminTaxonomyTagQueryParams extends createZodDto(
  AdminTaxonomyTagQueryParamsSchema
) {}
export type AdminShippingClass = z.infer<typeof AdminShippingClassSchema>;
export class ApiAdminShippingClass extends createZodDto(
  AdminShippingClassSchema
) {}
export class ApiAdminShippingClassRequest extends createZodDto(
  AdminShippingClassRequestSchema
) {}
export class ApiAdminShippingClassQueryParams extends createZodDto(
  AdminShippingClassQueryParamsSchema
) {}
