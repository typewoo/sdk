import * as qs from 'qs';
import { BaseService } from '../base.service.js';
import { doGet } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import { ApiPaginationResult } from '../../types/api.js';
import {
  ProductReviewRequest,
  ProductReviewResponse,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';
import { PaginatedRequest } from '../../extensions/paginated-request.js';

/**
 * Product Reviews API
 *
 * This endpoint returns product reviews (comments) and can also show results from either specific products or specific categories.
 */
export class ProductReviewService extends BaseService {
  private readonly endpoint = 'wp-json/wc/store/v1/products/reviews';

  /**
   * List Product Reviews
   * @param params
   * @returns
   */
  list(
    params?: ProductReviewRequest,
    options?: RequestOptions
  ): PaginatedRequest<ProductReviewResponse[], ProductReviewRequest> {
    const request = async (
      pageParams?: ProductReviewRequest
    ): Promise<ApiPaginationResult<ProductReviewResponse[]>> => {
      const query = qs.stringify(pageParams, { encode: true });
      const url = `/${this.endpoint}?${query}`;
      const { data, error, headers } = await doGet<ProductReviewResponse[]>(
        url,
        options
      );

      const pagination = extractPagination(headers);
      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
  }
}
