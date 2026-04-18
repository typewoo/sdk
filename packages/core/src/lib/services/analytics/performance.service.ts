import { BaseService } from '../base.service.js';
import { doGet } from '../../http/http.js';
import * as qs from 'qs';
import { ApiResult } from '../../types/api.js';
import {
  AnalyticsPerformanceIndicator,
  AnalyticsPerformanceAllowed,
  AnalyticsPerformanceQueryParams,
} from '../../types/analytics/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * WooCommerce Analytics Performance Indicators Service
 *
 * Provides performance indicator data from multiple stats endpoints
 * (wp-json/wc-analytics/reports/performance-indicators)
 */
export class AnalyticsPerformanceService extends BaseService {
  private readonly endpoint =
    'wp-json/wc-analytics/reports/performance-indicators';

  /**
   * Get performance indicators for the requested stats
   */
  async getIndicators(
    params?: AnalyticsPerformanceQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<AnalyticsPerformanceIndicator[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AnalyticsPerformanceIndicator[]>(
      url,
      options
    );
    return { data, error };
  }

  /**
   * Get the list of allowed performance indicators
   */
  async getAllowed(
    options?: RequestOptions
  ): Promise<ApiResult<AnalyticsPerformanceAllowed[]>> {
    const url = `/${this.endpoint}/allowed`;

    const { data, error } = await doGet<AnalyticsPerformanceAllowed[]>(
      url,
      options
    );
    return { data, error };
  }
}
