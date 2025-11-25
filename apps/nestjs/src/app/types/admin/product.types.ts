import {
  AdminProductCategorySchema,
  AdminProductTagSchema,
  AdminProductBrandSchema,
  AdminProductAttributeSchema,
  AdminProductDefaultAttributeSchema,
  AdminDownloadableFileSchema,
  AdminProductSchema,
  AdminProductVariationSchema,
  AdminProductRequestSchema,
  AdminProductQueryParamsSchema,
  AdminProductCustomFieldNameQueryParamsSchema,
} from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAdminProductCategory extends createZodDto(
  AdminProductCategorySchema
) {}
export class ApiAdminProductTag extends createZodDto(AdminProductTagSchema) {}
export class ApiAdminProductBrand extends createZodDto(
  AdminProductBrandSchema
) {}
export class ApiAdminProductAttribute extends createZodDto(
  AdminProductAttributeSchema
) {}
export class ApiAdminProductDefaultAttribute extends createZodDto(
  AdminProductDefaultAttributeSchema
) {}
export class ApiAdminDownloadableFile extends createZodDto(
  AdminDownloadableFileSchema
) {}
export class ApiAdminProduct extends createZodDto(AdminProductSchema) {}
export class ApiAdminProductVariation extends createZodDto(
  AdminProductVariationSchema
) {}
export class ApiAdminProductRequest extends createZodDto(
  AdminProductRequestSchema
) {}
export class ApiProductQueryParams extends createZodDto(
  AdminProductQueryParamsSchema
) {}
export class ApiProductCustomFieldNameQueryParams extends createZodDto(
  AdminProductCustomFieldNameQueryParamsSchema
) {}
