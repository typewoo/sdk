import { BaseService } from '../base.service.js';
import { doGet } from '../../http/http.js';
import * as qs from 'qs';
import { ApiResult } from '../../types/api.js';
import {
  AnalyticsRevenueStats,
  AnalyticsRevenueQueryParams,
  AnalyticsStatsResponse,
} from '../../types/analytics/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * WooCommerce Analytics Revenue Service
 *
 * Provides revenue stats through the WooCommerce Analytics API (wp-json/wc-analytics/reports/revenue/stats)
 */
export class AnalyticsRevenueService extends BaseService {
  private readonly endpoint = 'wp-json/wc-analytics/reports/revenue/stats';

  /**
   * Get revenue statistics with time intervals
   */
  async getStats(
    params?: AnalyticsRevenueQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<AnalyticsStatsResponse<AnalyticsRevenueStats>>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<
      AnalyticsStatsResponse<AnalyticsRevenueStats>
    >(url, options);
    return { data, error };
  }
}
