import { BaseService } from '../base.service.js';
import { doGet } from '../../http/http.js';
import * as qs from 'qs';
import { ApiResult } from '../../types/api.js';
import {
  AnalyticsLeaderboard,
  AnalyticsLeaderboardAllowed,
  AnalyticsLeaderboardsQueryParams,
} from '../../types/analytics/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * WooCommerce Analytics Leaderboards Service
 *
 * Provides leaderboard data (wp-json/wc-analytics/leaderboards)
 */
export class AnalyticsLeaderboardsService extends BaseService {
  private readonly endpoint = 'wp-json/wc-analytics/leaderboards';

  /**
   * List leaderboards with their data
   */
  async list(
    params?: AnalyticsLeaderboardsQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<AnalyticsLeaderboard[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AnalyticsLeaderboard[]>(url, options);
    return { data, error };
  }

  /**
   * Get the list of allowed leaderboards
   */
  async getAllowed(
    options?: RequestOptions
  ): Promise<ApiResult<AnalyticsLeaderboardAllowed[]>> {
    const url = `/${this.endpoint}/allowed`;

    const { data, error } = await doGet<AnalyticsLeaderboardAllowed[]>(
      url,
      options
    );
    return { data, error };
  }
}
