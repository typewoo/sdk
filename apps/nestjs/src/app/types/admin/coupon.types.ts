import {
  AdminCouponSchema,
  AdminCouponRequestSchema,
  AdminCouponQueryParamsSchema,
} from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAdminCoupon extends createZodDto(AdminCouponSchema) {}
export class ApiAdminCouponRequest extends createZodDto(
  AdminCouponRequestSchema
) {}
export class ApiAdminCouponQueryParams extends createZodDto(
  AdminCouponQueryParamsSchema
) {}
