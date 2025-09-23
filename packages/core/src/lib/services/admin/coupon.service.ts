import { BaseService } from '../base.service.js';
import {
  WcAdminCoupon,
  WcAdminCouponRequest,
  WcAdminCouponQueryParams,
} from '../../types/admin/coupon.types.js';
import { ApiResult, ApiPaginationResult } from '../../types/api.js';
import {
  doGet,
  doPost,
  doPut,
  doDelete,
} from '../../utilities/axios.utility.js';
import { parseLinkHeader } from '../../utilities/common.js';
import qs from 'qs';

/**
 * WooCommerce REST API Coupons Service
 *
 * Manages coupons through the WooCommerce REST API (wp-json/wc/v3/coupons)
 */
export class WcAdminCouponService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/coupons';

  /**
   * List coupons
   */
  async list(
    params?: WcAdminCouponQueryParams
  ): Promise<ApiPaginationResult<WcAdminCoupon[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<WcAdminCoupon[]>(url);

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single coupon by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<WcAdminCoupon>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<WcAdminCoupon>(url);
    return { data, error };
  }

  /**
   * Create a new coupon
   */
  async create(
    coupon: WcAdminCouponRequest
  ): Promise<ApiResult<WcAdminCoupon>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<WcAdminCoupon, WcAdminCouponRequest>(
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
    coupon: WcAdminCouponRequest
  ): Promise<ApiResult<WcAdminCoupon>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<WcAdminCoupon, WcAdminCouponRequest>(
      url,
      coupon
    );

    return { data, error };
  }

  /**
   * Delete a coupon
   */
  async delete(id: number, force = false): Promise<ApiResult<WcAdminCoupon>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<WcAdminCoupon>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete coupons
   */
  async batch(operations: {
    create?: WcAdminCouponRequest[];
    update?: Array<WcAdminCouponRequest & { id: number }>;
    delete?: number[];
  }): Promise<
    ApiResult<{
      create: WcAdminCoupon[];
      update: WcAdminCoupon[];
      delete: WcAdminCoupon[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: WcAdminCoupon[];
        update: WcAdminCoupon[];
        delete: WcAdminCoupon[];
      },
      typeof operations
    >(url, operations);

    return { data, error };
  }
}
