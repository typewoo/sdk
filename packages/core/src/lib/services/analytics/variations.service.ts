import { BaseService } from '../base.service.js';
import { doGet } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AnalyticsVariation,
  AnalyticsVariationStats,
  AnalyticsVariationsStatsQueryParams,
  AnalyticsVariationsListQueryParams,
  AnalyticsStatsResponse,
} from '../../types/analytics/index.js';
import { RequestOptions } from '../../types/request.js';
import { PaginatedRequest } from '../../extensions/paginated-request.js';

/**
 * WooCommerce Analytics Variations Service
 *
 * Provides variation analytics through the WooCommerce Analytics API (wp-json/wc-analytics/reports/variations)
 */
export class AnalyticsVariationsService extends BaseService {
  private readonly endpoint = 'wp-json/wc-analytics/reports/variations';

  /**
   * List variation detail rows
   */
  list(
    params?: AnalyticsVariationsListQueryParams,
    options?: RequestOptions
  ): PaginatedRequest<
    AnalyticsVariation[],
    AnalyticsVariationsListQueryParams
  > {
    const request = async (
      pageParams?: AnalyticsVariationsListQueryParams
    ): Promise<ApiPaginationResult<AnalyticsVariation[]>> => {
      const query = pageParams
        ? qs.stringify(pageParams, { encode: false })
        : '';
      const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

      const { data, error, headers } = await doGet<AnalyticsVariation[]>(
        url,
        options
      );
      const pagination = extractPagination(headers);

      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
  }

  /**
   * Get variation statistics with time intervals
   */
  async getStats(
    params?: AnalyticsVariationsStatsQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<AnalyticsStatsResponse<AnalyticsVariationStats>>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/stats${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<
      AnalyticsStatsResponse<AnalyticsVariationStats>
    >(url, options);
    return { data, error };
  }
}
