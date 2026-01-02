import { BaseService } from '../base.service.js';
import { doGet, doPost, doPut, doDelete } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AdminCouponQueryParams,
  AdminCoupon,
  AdminCouponRequest,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';
import { PaginatedRequest } from '../../extensions/paginated-request.js';

/**
 * WooCommerce REST API Coupons Service
 *
 * Manages coupons through the WooCommerce REST API (wp-json/wc/v3/coupons)
 */
export class AdminCouponService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/coupons';

  /**
   * List coupons with pagination support.
   *
   * @example
   * ```typescript
   * // Standard usage (backward compatible)
   * const { data, pagination } = await sdk.admin.coupons.list({ per_page: 10 });
   *
   * // Loop through all pages with callback
   * const { data: allCoupons } = await sdk.admin.coupons.list({ per_page: 100 }).loop({
   *   onPage: ({ page, totalPages }) => console.log(`Page ${page}/${totalPages}`)
   * });
   *
   * // Simple - get all items
   * const { data: allCoupons } = await sdk.admin.coupons.list().loop();
   * ```
   */
  list(
    params?: AdminCouponQueryParams,
    options?: RequestOptions
  ): PaginatedRequest<AdminCoupon[], AdminCouponQueryParams> {
    const request = async (
      pageParams?: AdminCouponQueryParams
    ): Promise<ApiPaginationResult<AdminCoupon[]>> => {
      const query = pageParams
        ? qs.stringify(pageParams, { encode: false })
        : '';
      const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

      const { data, error, headers } = await doGet<AdminCoupon[]>(url, options);
      const pagination = extractPagination(headers);

      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
  }

  /**
   * Get single coupon by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' },
    options?: RequestOptions
  ): Promise<ApiResult<AdminCoupon>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminCoupon>(url, options);
    return { data, error };
  }

  /**
   * Create a new coupon
   */
  async create(
    coupon: AdminCouponRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminCoupon>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<AdminCoupon, AdminCouponRequest>(
      url,
      coupon,
      options
    );

    return { data, error };
  }

  /**
   * Update a coupon
   */
  async update(
    id: number,
    coupon: AdminCouponRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminCoupon>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<AdminCoupon, AdminCouponRequest>(
      url,
      coupon,
      options
    );

    return { data, error };
  }

  /**
   * Delete a coupon
   */
  async delete(
    id: number,
    force = false,
    options?: RequestOptions
  ): Promise<ApiResult<AdminCoupon>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminCoupon>(url, options);

    return { data, error };
  }

  /**
   * Batch create/update/delete coupons
   */
  async batch(
    operations: {
      create?: AdminCouponRequest[];
      update?: Array<AdminCouponRequest & { id: number }>;
      delete?: number[];
    },
    options?: RequestOptions
  ): Promise<
    ApiResult<{
      create: AdminCoupon[];
      update: AdminCoupon[];
      delete: AdminCoupon[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: AdminCoupon[];
        update: AdminCoupon[];
        delete: AdminCoupon[];
      },
      typeof operations
    >(url, operations, options);

    return { data, error };
  }
}
