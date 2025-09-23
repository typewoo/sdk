import { BaseService } from '../base.service.js';
import {
  WcAdminRefund,
  WcAdminRefundQueryParams,
} from '../../types/admin/refund.types.js';
import { ApiPaginationResult } from '../../types/api.js';
import { doGet } from '../../utilities/axios.utility.js';
import { parseLinkHeader } from '../../utilities/common.js';
import qs from 'qs';

/**
 * WooCommerce REST API Refunds Service
 *
 * Manages refunds through the WooCommerce REST API (wp-json/wc/v3/refunds)
 * Note: Refunds are typically created through order endpoints, this service provides read access
 */
export class WcAdminRefundService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/refunds';

  /**
   * List refunds
   */
  async list(
    params?: WcAdminRefundQueryParams
  ): Promise<ApiPaginationResult<WcAdminRefund[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<WcAdminRefund[]>(url);

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }
}
