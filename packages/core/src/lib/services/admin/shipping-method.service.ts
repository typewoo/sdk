import { BaseService } from '../base.service.js';
import { doGet } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AdminShippingMethodQueryParams,
  AdminShippingMethod,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';
import { PaginatedRequest } from '../../extensions/paginated-request.js';

/**
 * WooCommerce REST API Shipping Methods Service
 *
 * Manages shipping methods through the WooCommerce REST API (wp-json/wc/v3/shipping_methods)
 */
export class AdminShippingMethodService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/shipping_methods';

  /**
   * List shipping methods
   */
  list(
    params?: AdminShippingMethodQueryParams,
    options?: RequestOptions
  ): PaginatedRequest<AdminShippingMethod[], AdminShippingMethodQueryParams> {
    const request = async (
      pageParams?: AdminShippingMethodQueryParams
    ): Promise<ApiPaginationResult<AdminShippingMethod[]>> => {
      const query = pageParams
        ? qs.stringify(pageParams, { encode: false })
        : '';
      const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

      const { data, error, headers } = await doGet<AdminShippingMethod[]>(
        url,
        options
      );
      const pagination = extractPagination(headers);

      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
  }

  /**
   * Get single shipping method by ID
   */
  async get(
    id: string,
    params?: AdminShippingMethodQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<AdminShippingMethod>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminShippingMethod>(url, options);
    return { data, error };
  }
}
