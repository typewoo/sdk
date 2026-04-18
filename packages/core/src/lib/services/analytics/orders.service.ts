import { BaseService } from '../base.service.js';
import { doGet } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AnalyticsOrder,
  AnalyticsOrderStats,
  AnalyticsOrdersStatsQueryParams,
  AnalyticsOrdersListQueryParams,
  AnalyticsStatsResponse,
} from '../../types/analytics/index.js';
import { RequestOptions } from '../../types/request.js';
import { PaginatedRequest } from '../../extensions/paginated-request.js';

/**
 * WooCommerce Analytics Orders Service
 *
 * Provides order analytics through the WooCommerce Analytics API (wp-json/wc-analytics/reports/orders)
 */
export class AnalyticsOrdersService extends BaseService {
  private readonly endpoint = 'wp-json/wc-analytics/reports/orders';

  /**
   * List order detail rows
   */
  list(
    params?: AnalyticsOrdersListQueryParams,
    options?: RequestOptions
  ): PaginatedRequest<AnalyticsOrder[], AnalyticsOrdersListQueryParams> {
    const request = async (
      pageParams?: AnalyticsOrdersListQueryParams
    ): Promise<ApiPaginationResult<AnalyticsOrder[]>> => {
      const query = pageParams
        ? qs.stringify(pageParams, { encode: false })
        : '';
      const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

      const { data, error, headers } = await doGet<AnalyticsOrder[]>(
        url,
        options
      );
      const pagination = extractPagination(headers);

      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
  }

  /**
   * Get order statistics with time intervals
   */
  async getStats(
    params?: AnalyticsOrdersStatsQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<AnalyticsStatsResponse<AnalyticsOrderStats>>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/stats${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<
      AnalyticsStatsResponse<AnalyticsOrderStats>
    >(url, options);
    return { data, error };
  }
}
