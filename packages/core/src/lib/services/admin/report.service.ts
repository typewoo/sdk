import { BaseService } from '../base.service.js';
import { doGet } from '../../utilities/axios.utility.js';
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
    params?: AdminReportsQueryParams
  ): Promise<ApiPaginationResult<AdminReport[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminReport[]>(url);

    const { total, totalPages, link } = extractPagination(headers);

    return { data, error, total, totalPages, link };
  }

  /**
   * Get sales report
   */
  async getSalesReport(
    params?: AdminSalesReportQueryParams
  ): Promise<ApiResult<AdminSalesReport[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/sales${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminSalesReport[]>(url);
    return { data, error };
  }

  /**
   * Get top sellers report
   */
  async getTopSellersReport(
    params?: AdminTopSellersReportQueryParams
  ): Promise<ApiPaginationResult<AdminTopSellersReport[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/top_sellers${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminTopSellersReport[]>(url);

    const { total, totalPages, link } = extractPagination(headers);

    return { data, error, total, totalPages, link };
  }

  /**
   * Get customers report
   */
  async getCustomersReport(
    params?: AdminCustomersReportQueryParams
  ): Promise<ApiPaginationResult<AdminCustomersReport[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/customers/totals${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminCustomersReport[]>(url);

    const { total, totalPages, link } = extractPagination(headers);

    return { data, error, total, totalPages, link };
  }

  /**
   * Get orders report
   */
  async getOrdersReport(
    params?: AdminOrdersReportQueryParams
  ): Promise<ApiResult<AdminOrdersReport[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/orders/totals${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminOrdersReport[]>(url);
    return { data, error };
  }

  /**
   * Orders totals report
   */
  async getOrdersTotals(
    params?: AdminReportsQueryParams
  ): Promise<ApiPaginationResult<AdminTotalsReportEntry[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/orders/totals${query ? `?${query}` : ''}`;
    const { data, error, headers } = await doGet<AdminTotalsReportEntry[]>(url);
    const { total, totalPages, link } = extractPagination(headers);
    return { data, error, total, totalPages, link };
  }

  /**
   * Products totals report
   */
  async getProductsTotals(
    params?: AdminReportsQueryParams
  ): Promise<ApiPaginationResult<AdminTotalsReportEntry[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/products/totals${query ? `?${query}` : ''}`;
    const { data, error, headers } = await doGet<AdminTotalsReportEntry[]>(url);
    const { total, totalPages, link } = extractPagination(headers);
    return { data, error, total, totalPages, link };
  }

  /**
   * Customers totals report
   */
  async getCustomersTotals(
    params?: AdminReportsQueryParams
  ): Promise<ApiPaginationResult<AdminTotalsReportEntry[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/customers/totals${query ? `?${query}` : ''}`;
    const { data, error, headers } = await doGet<AdminTotalsReportEntry[]>(url);
    const { total, totalPages, link } = extractPagination(headers);
    return { data, error, total, totalPages, link };
  }

  /**
   * Coupons totals report
   */
  async getCouponsTotals(
    params?: AdminReportsQueryParams
  ): Promise<ApiPaginationResult<AdminTotalsReportEntry[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/coupons/totals${query ? `?${query}` : ''}`;
    const { data, error, headers } = await doGet<AdminTotalsReportEntry[]>(url);
    const { total, totalPages, link } = extractPagination(headers);
    return { data, error, total, totalPages, link };
  }

  /**
   * Reviews totals report
   */
  async getReviewsTotals(
    params?: AdminReportsQueryParams
  ): Promise<ApiPaginationResult<AdminTotalsReportEntry[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/reviews/totals${query ? `?${query}` : ''}`;
    const { data, error, headers } = await doGet<AdminTotalsReportEntry[]>(url);
    const { total, totalPages, link } = extractPagination(headers);
    return { data, error, total, totalPages, link };
  }
}
