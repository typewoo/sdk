import { BaseService } from '../base.service.js';
import { doGet } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AnalyticsDownload,
  AnalyticsDownloadStats,
  AnalyticsDownloadsStatsQueryParams,
  AnalyticsDownloadsListQueryParams,
  AnalyticsStatsResponse,
} from '../../types/analytics/index.js';
import { RequestOptions } from '../../types/request.js';
import { PaginatedRequest } from '../../extensions/paginated-request.js';

/**
 * WooCommerce Analytics Downloads Service
 *
 * Provides download analytics through the WooCommerce Analytics API (wp-json/wc-analytics/reports/downloads)
 */
export class AnalyticsDownloadsService extends BaseService {
  private readonly endpoint = 'wp-json/wc-analytics/reports/downloads';

  /**
   * List download detail rows
   */
  list(
    params?: AnalyticsDownloadsListQueryParams,
    options?: RequestOptions
  ): PaginatedRequest<AnalyticsDownload[], AnalyticsDownloadsListQueryParams> {
    const request = async (
      pageParams?: AnalyticsDownloadsListQueryParams
    ): Promise<ApiPaginationResult<AnalyticsDownload[]>> => {
      const query = pageParams
        ? qs.stringify(pageParams, { encode: false })
        : '';
      const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

      const { data, error, headers } = await doGet<AnalyticsDownload[]>(
        url,
        options
      );
      const pagination = extractPagination(headers);

      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
  }

  /**
   * Get download statistics with time intervals
   */
  async getStats(
    params?: AnalyticsDownloadsStatsQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<AnalyticsStatsResponse<AnalyticsDownloadStats>>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/stats${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<
      AnalyticsStatsResponse<AnalyticsDownloadStats>
    >(url, options);
    return { data, error };
  }
}
