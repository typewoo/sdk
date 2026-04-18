import { BaseService } from '../base.service.js';
import { doGet } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AnalyticsCoupon,
  AnalyticsCouponStats,
  AnalyticsCouponsStatsQueryParams,
  AnalyticsCouponsListQueryParams,
  AnalyticsStatsResponse,
} from '../../types/analytics/index.js';
import { RequestOptions } from '../../types/request.js';
import { PaginatedRequest } from '../../extensions/paginated-request.js';

/**
 * WooCommerce Analytics Coupons Service
 *
 * Provides coupon analytics through the WooCommerce Analytics API (wp-json/wc-analytics/reports/coupons)
 */
export class AnalyticsCouponsService extends BaseService {
  private readonly endpoint = 'wp-json/wc-analytics/reports/coupons';

  /**
   * List coupon detail rows
   */
  list(
    params?: AnalyticsCouponsListQueryParams,
    options?: RequestOptions
  ): PaginatedRequest<AnalyticsCoupon[], AnalyticsCouponsListQueryParams> {
    const request = async (
      pageParams?: AnalyticsCouponsListQueryParams
    ): Promise<ApiPaginationResult<AnalyticsCoupon[]>> => {
      const query = pageParams
        ? qs.stringify(pageParams, { encode: false })
        : '';
      const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

      const { data, error, headers } = await doGet<AnalyticsCoupon[]>(
        url,
        options
      );
      const pagination = extractPagination(headers);

      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
  }

  /**
   * Get coupon statistics with time intervals
   */
  async getStats(
    params?: AnalyticsCouponsStatsQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<AnalyticsStatsResponse<AnalyticsCouponStats>>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/stats${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<
      AnalyticsStatsResponse<AnalyticsCouponStats>
    >(url, options);
    return { data, error };
  }
}
