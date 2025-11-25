import {
  AdminReportSchema,
  AdminSalesReportSchema,
  AdminTopSellersReportSchema,
  AdminCustomersReportSchema,
  AdminOrdersReportSchema,
  AdminTotalsReportEntrySchema,
  AdminReportsQueryParamsSchema,
  AdminSalesReportQueryParamsSchema,
  AdminTopSellersReportQueryParamsSchema,
  AdminCustomersReportQueryParamsSchema,
  AdminOrdersReportQueryParamsSchema,
} from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAdminReport extends createZodDto(AdminReportSchema) {}
export class ApiAdminSalesReport extends createZodDto(AdminSalesReportSchema) {}
export class ApiAdminTopSellersReport extends createZodDto(
  AdminTopSellersReportSchema
) {}
export class ApiAdminCustomersReport extends createZodDto(
  AdminCustomersReportSchema
) {}
export class ApiAdminOrdersReport extends createZodDto(
  AdminOrdersReportSchema
) {}
export class ApiAdminTotalsReportEntry extends createZodDto(
  AdminTotalsReportEntrySchema
) {}
export class ApiAdminReportsQueryParams extends createZodDto(
  AdminReportsQueryParamsSchema
) {}
export class ApiAdminSalesReportQueryParams extends createZodDto(
  AdminSalesReportQueryParamsSchema
) {}
export class ApiAdminTopSellersReportQueryParams extends createZodDto(
  AdminTopSellersReportQueryParamsSchema
) {}
export class ApiAdminCustomersReportQueryParams extends createZodDto(
  AdminCustomersReportQueryParamsSchema
) {}
export class ApiAdminOrdersReportQueryParams extends createZodDto(
  AdminOrdersReportQueryParamsSchema
) {}
