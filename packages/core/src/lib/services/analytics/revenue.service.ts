import { BaseService } from '../base.service.js';
import * as qs from 'qs';
import { ApiResult } from '../../types/api.js';
import {
  AnalyticsRevenueStatsResponse,
  AnalyticsRevenueQueryParams,
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
  ): Promise<ApiResult<AnalyticsRevenueStatsResponse>> {
    const query = params
      ? qs.stringify(params, { encodeValuesOnly: true })
      : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error } = await this.http.get<AnalyticsRevenueStatsResponse>(
      url,
      options
    );
    return { data, error };
  }
}
