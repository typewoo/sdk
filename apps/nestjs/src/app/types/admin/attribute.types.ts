import { AdminProductAttributeSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
import {
  AdminProductAttributeRequestSchema,
  AdminProductAttributeQueryParamsSchema,
  AdminProductAttributeTermSchema,
  AdminProductAttributeTermRequestSchema,
  AdminProductAttributeTermQueryParamsSchema,
} from '.';
export class ApiAdminProductAttribute extends createZodDto(
  AdminProductAttributeSchema
) {}
export class ApiAdminProductAttributeRequest extends createZodDto(
  AdminProductAttributeRequestSchema
) {}
export class ApiAdminProductAttributeQueryParams extends createZodDto(
  AdminProductAttributeQueryParamsSchema
) {}
export class ApiAdminProductAttributeTerm extends createZodDto(
  AdminProductAttributeTermSchema
) {}
export class ApiAdminProductAttributeTermRequest extends createZodDto(
  AdminProductAttributeTermRequestSchema
) {}
export class ApiAdminProductAttributeTermQueryParams extends createZodDto(
  AdminProductAttributeTermQueryParamsSchema
) {}
