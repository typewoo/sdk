import { BaseService } from '../base.service.js';
import {
  doGet,
  doPost,
  doPut,
  doDelete,
} from '../../utilities/axios.utility.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AdminCouponQueryParams,
  AdminCoupon,
  AdminCouponRequest,
} from '../../types/index.js';

/**
 * WooCommerce REST API Coupons Service
 *
 * Manages coupons through the WooCommerce REST API (wp-json/wc/v3/coupons)
 */
export class AdminCouponService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/coupons';

  /**
   * List coupons
   */
  async list(
    params?: AdminCouponQueryParams
  ): Promise<ApiPaginationResult<AdminCoupon[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminCoupon[]>(url);

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get single coupon by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<AdminCoupon>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminCoupon>(url);
    return { data, error };
  }

  /**
   * Create a new coupon
   */
  async create(coupon: AdminCouponRequest): Promise<ApiResult<AdminCoupon>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<AdminCoupon, AdminCouponRequest>(
      url,
      coupon
    );

    return { data, error };
  }

  /**
   * Update a coupon
   */
  async update(
    id: number,
    coupon: AdminCouponRequest
  ): Promise<ApiResult<AdminCoupon>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<AdminCoupon, AdminCouponRequest>(
      url,
      coupon
    );

    return { data, error };
  }

  /**
   * Delete a coupon
   */
  async delete(id: number, force = false): Promise<ApiResult<AdminCoupon>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminCoupon>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete coupons
   */
  async batch(operations: {
    create?: AdminCouponRequest[];
    update?: Array<AdminCouponRequest & { id: number }>;
    delete?: number[];
  }): Promise<
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
    >(url, operations);

    return { data, error };
  }
}
