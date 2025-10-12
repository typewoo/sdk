import { BaseService } from '../base.service.js';
import {
  AdminSystemStatus,
  AdminSystemStatusQueryParams,
} from '../../types/admin/system-status.types.js';
import { ApiResult } from '../../types/api.js';
import { doGet } from '../../utilities/axios.utility.js';
import qs from 'qs';

/**
 * WooCommerce REST API System Status Service
 *
 * Manages system status through the WooCommerce REST API (wp-json/wc/v3/system_status)
 */
export class AdminSystemStatusService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/system_status';

  /**
   * Get system status
   */
  async get(
    params?: AdminSystemStatusQueryParams
  ): Promise<ApiResult<AdminSystemStatus>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminSystemStatus>(url);
    return { data, error };
  }
}
