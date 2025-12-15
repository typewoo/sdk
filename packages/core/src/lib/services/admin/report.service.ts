import { BaseService } from '../base.service.js';
import { doGet } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AdminReportsQueryParams,
  AdminReport,
  AdminSalesReportQueryParams,
  AdminSalesReport,
  AdminTopSellersReportQueryParams,
  AdminTopSellersReport,
  AdminCustomersReportQueryParams,
  AdminCustomersReport,
  AdminOrdersReportQueryParams,
  AdminOrdersReport,
  AdminTotalsReportEntry,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * WooCommerce REST API Reports Service
 *
 * Manages reports through the WooCommerce REST API (wp-json/wc/v3/reports)
 */
export class AdminReportService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/reports';

  /**
   * List available reports
   */
  async list(
    params?: AdminReportsQueryParams,
    options?: RequestOptions,
  ): Promise<ApiPaginationResult<AdminReport[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminReport[]>(url, options);

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get sales report
   */
  async getSalesReport(
    params?: AdminSalesReportQueryParams,
    options?: RequestOptions,
  ): Promise<ApiResult<AdminSalesReport[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/sales${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminSalesReport[]>(url, options);
    return { data, error };
  }

  /**
   * Get top sellers report
   */
  async getTopSellersReport(
    params?: AdminTopSellersReportQueryParams,
    options?: RequestOptions,
  ): Promise<ApiPaginationResult<AdminTopSellersReport[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/top_sellers${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminTopSellersReport[]>(
      url,
      options,
    );

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get customers report
   */
  async getCustomersReport(
    params?: AdminCustomersReportQueryParams,
    options?: RequestOptions,
  ): Promise<ApiPaginationResult<AdminCustomersReport[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/customers/totals${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminCustomersReport[]>(
      url,
      options,
    );

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get orders report
   */
  async getOrdersReport(
    params?: AdminOrdersReportQueryParams,
    options?: RequestOptions,
  ): Promise<ApiResult<AdminOrdersReport[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/orders/totals${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminOrdersReport[]>(url, options);
    return { data, error };
  }

  /**
   * Orders totals report
   */
  async getOrdersTotals(
    params?: AdminReportsQueryParams,
    options?: RequestOptions,
  ): Promise<ApiPaginationResult<AdminTotalsReportEntry[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/orders/totals${query ? `?${query}` : ''}`;
    const { data, error, headers } = await doGet<AdminTotalsReportEntry[]>(
      url,
      options,
    );
    const pagination = extractPagination(headers);
    return { data, error, pagination };
  }

  /**
   * Products totals report
   */
  async getProductsTotals(
    params?: AdminReportsQueryParams,
    options?: RequestOptions,
  ): Promise<ApiPaginationResult<AdminTotalsReportEntry[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/products/totals${query ? `?${query}` : ''}`;
    const { data, error, headers } = await doGet<AdminTotalsReportEntry[]>(
      url,
      options,
    );
    const pagination = extractPagination(headers);
    return { data, error, pagination };
  }

  /**
   * Customers totals report
   */
  async getCustomersTotals(
    params?: AdminReportsQueryParams,
    options?: RequestOptions,
  ): Promise<ApiPaginationResult<AdminTotalsReportEntry[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/customers/totals${query ? `?${query}` : ''}`;
    const { data, error, headers } = await doGet<AdminTotalsReportEntry[]>(
      url,
      options,
    );
    const pagination = extractPagination(headers);
    return { data, error, pagination };
  }

  /**
   * Coupons totals report
   */
  async getCouponsTotals(
    params?: AdminReportsQueryParams,
    options?: RequestOptions,
  ): Promise<ApiPaginationResult<AdminTotalsReportEntry[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/coupons/totals${query ? `?${query}` : ''}`;
    const { data, error, headers } = await doGet<AdminTotalsReportEntry[]>(
      url,
      options,
    );
    const pagination = extractPagination(headers);
    return { data, error, pagination };
  }

  /**
   * Reviews totals report
   */
  async getReviewsTotals(
    params?: AdminReportsQueryParams,
    options?: RequestOptions,
  ): Promise<ApiPaginationResult<AdminTotalsReportEntry[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/reviews/totals${query ? `?${query}` : ''}`;
    const { data, error, headers } = await doGet<AdminTotalsReportEntry[]>(
      url,
      options,
    );
    const pagination = extractPagination(headers);
    return { data, error, pagination };
  }
}
