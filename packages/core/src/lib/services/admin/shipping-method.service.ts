import { BaseService } from '../base.service.js';
import {
  WcAdminShippingMethod,
  WcAdminShippingMethodQueryParams,
} from '../../types/admin/shipping-method.types.js';
import { ApiResult, ApiPaginationResult } from '../../types/api.js';
import { doGet } from '../../utilities/axios.utility.js';
import { parseLinkHeader } from '../../utilities/common.js';
import qs from 'qs';

/**
 * WooCommerce REST API Shipping Methods Service
 *
 * Manages shipping methods through the WooCommerce REST API (wp-json/wc/v3/shipping_methods)
 */
export class WcAdminShippingMethodService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/shipping_methods';

  /**
   * List shipping methods
   */
  async list(
    params?: WcAdminShippingMethodQueryParams
  ): Promise<ApiPaginationResult<WcAdminShippingMethod[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<WcAdminShippingMethod[]>(url);

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single shipping method by ID
   */
  async get(
    id: string,
    params?: WcAdminShippingMethodQueryParams
  ): Promise<ApiResult<WcAdminShippingMethod>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<WcAdminShippingMethod>(url);
    return { data, error };
  }
}
