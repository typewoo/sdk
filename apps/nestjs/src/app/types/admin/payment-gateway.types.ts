import {
  AdminPaymentGatewaySchema,
  AdminPaymentGatewayRequestSchema,
  AdminPaymentGatewayQueryParamsSchema,
} from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAdminPaymentGateway extends createZodDto(
  AdminPaymentGatewaySchema
) {}
export class ApiAdminPaymentGatewayRequest extends createZodDto(
  AdminPaymentGatewayRequestSchema
) {}
export class ApiAdminPaymentGatewayQueryParams extends createZodDto(
  AdminPaymentGatewayQueryParamsSchema
) {}
