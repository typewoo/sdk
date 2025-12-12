import { BaseService } from '../base.service.js';
import { doGet } from '../../utilities/axios.utility.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult } from '../../types/api.js';
import { AdminRefundQueryParams, AdminRefund } from '../../types/index.js';

/**
 * WooCommerce REST API Refunds Service
 *
 * Manages refunds through the WooCommerce REST API (wp-json/wc/v3/refunds)
 * Note: Refunds are typically created through order endpoints, this service provides read access
 */
export class AdminRefundService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/refunds';

  /**
   * List refunds
   */
  async list(
    params?: AdminRefundQueryParams
  ): Promise<ApiPaginationResult<AdminRefund[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminRefund[]>(url);

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }
}
